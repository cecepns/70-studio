const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || '70studio_secret_key_jwt_2026_photography';

// Ensure uploads directories exist
const UPLOADS_ROOT = path.join(__dirname, 'uploads-70-studio');
const CATEGORY_UPLOADS = path.join(UPLOADS_ROOT, 'categories');
const BANNER_UPLOADS = path.join(UPLOADS_ROOT, 'banners');
const PORTFOLIO_UPLOADS = path.join(UPLOADS_ROOT, 'portfolios');

[UPLOADS_ROOT, CATEGORY_UPLOADS, BANNER_UPLOADS, PORTFOLIO_UPLOADS].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Setup Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = PORTFOLIO_UPLOADS;
    if (req.baseUrl.includes('categories') || req.path.includes('categories')) {
      dest = CATEGORY_UPLOADS;
    } else if (req.baseUrl.includes('banners') || req.path.includes('banners')) {
      dest = BANNER_UPLOADS;
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPG, PNG, WEBP, GIF) yang diperbolehkan.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads statically
app.use('/uploads-70-studio', express.static(UPLOADS_ROOT));

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '70_studio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || '70_studio_db');
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error.message);
  }
})();

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa.' });
    }
    req.user = user;
    next();
  });
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    const adminUser = rows[0];
    const validPassword = await bcrypt.compare(password, adminUser.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    const token = jwt.sign(
      { id: adminUser.id, username: adminUser.username, name: adminUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login berhasil.',
      data: {
        token,
        user: { id: adminUser.id, username: adminUser.username, name: adminUser.name },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server: ' + error.message });
  }
});

app.get('/api/auth/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// ----------------------------------------------------
// CATEGORIES ENDPOINTS
// ----------------------------------------------------
app.get('/api/categories', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const search = req.query.search ? req.query.search.trim().toLowerCase() : '';
    const offset = (page - 1) * limit;

    let countSql = 'SELECT COUNT(*) as total FROM categories WHERE 1=1';
    let dataSql = `
      SELECT c.*, COUNT(p.id) as portfolio_count 
      FROM categories c 
      LEFT JOIN portfolios p ON p.category_id = c.id 
      WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
      countSql += ' AND (name LIKE ? OR label LIKE ? OR description LIKE ?)';
      dataSql += ' AND (c.name LIKE ? OR c.label LIKE ? OR c.description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    dataSql += ' GROUP BY c.id ORDER BY c.order_index ASC, c.id ASC LIMIT ? OFFSET ?';

    const [countRows] = await pool.query(countSql, queryParams);
    const total = countRows[0]?.total || 0;

    const [rows] = await pool.query(dataSql, [...queryParams, limit, offset]);

    return res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data kategori: ' + error.message });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ? OR slug = ?', [id, id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get category error:', error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan: ' + error.message });
  }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { name, label, description, order_index } = req.body;
    if (!name || !label) {
      return res.status(400).json({ success: false, message: 'Nama dan label kategori wajib diisi.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const orderNum = parseInt(order_index) || 0;

    const [result] = await pool.query(
      'INSERT INTO categories (slug, name, label, description, order_index) VALUES (?, ?, ?, ?, ?)',
      [slug, name, label, description || '', orderNum]
    );
    return res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan.',
      data: { id: result.insertId, slug, name, label, description, order_index: orderNum },
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({ success: false, message: 'Gagal membuat kategori: ' + error.message });
  }
});

app.put('/api/categories/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { name, label, description, order_index } = req.body;

    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    const updatedName = name || existing[0].name;
    const updatedLabel = label || existing[0].label;
    const updatedSlug = updatedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const updatedDesc = description !== undefined ? description : existing[0].description;
    const updatedOrder = order_index !== undefined ? parseInt(order_index) : existing[0].order_index;

    await pool.query(
      'UPDATE categories SET slug = ?, name = ?, label = ?, description = ?, order_index = ? WHERE id = ?',
      [updatedSlug, updatedName, updatedLabel, updatedDesc, updatedOrder, id]
    );

    return res.json({
      success: true,
      message: 'Kategori berhasil diperbarui.',
      data: { id, slug: updatedSlug, name: updatedName, label: updatedLabel, description: updatedDesc, order_index: updatedOrder },
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui kategori: ' + error.message });
  }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus kategori: ' + error.message });
  }
});

// ----------------------------------------------------
// PORTFOLIOS ENDPOINTS
// ----------------------------------------------------
app.get('/api/portfolios', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ? req.query.search.trim().toLowerCase() : '';
    const category = req.query.category ? req.query.category.trim() : '';
    const offset = (page - 1) * limit;

    let countSql = `
      SELECT COUNT(*) as total 
      FROM portfolios p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    let dataSql = `
      SELECT p.*, c.name as category_name, c.label as category_label, c.slug as category_slug
      FROM portfolios p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
      countSql += ' AND (p.title LIKE ? OR c.name LIKE ? OR c.label LIKE ?)';
      dataSql += ' AND (p.title LIKE ? OR c.name LIKE ? OR c.label LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category && category.toLowerCase() !== 'all') {
      if (!isNaN(category)) {
        countSql += ' AND p.category_id = ?';
        dataSql += ' AND p.category_id = ?';
        queryParams.push(parseInt(category));
      } else {
        countSql += ' AND (LOWER(c.slug) = ? OR LOWER(c.name) = ?)';
        dataSql += ' AND (LOWER(c.slug) = ? OR LOWER(c.name) = ?)';
        queryParams.push(category.toLowerCase(), category.toLowerCase());
      }
    }

    dataSql += ' ORDER BY p.order_index ASC, p.id DESC LIMIT ? OFFSET ?';

    const [countRows] = await pool.query(countSql, queryParams);
    const total = countRows[0]?.total || 0;

    const [rows] = await pool.query(dataSql, [...queryParams, limit, offset]);

    return res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Fetch portfolios error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data portofolio: ' + error.message });
  }
});

app.get('/api/portfolios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.label as category_label 
      FROM portfolios p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Portofolio tidak ditemukan.' });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get portfolio error:', error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan: ' + error.message });
  }
});

app.post('/api/portfolios', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, category_id, width, height, aspect_ratio, order_index } = req.body;
    if (!req.file && !req.body.image_url) {
      return res.status(400).json({ success: false, message: 'File gambar portofolio wajib diunggah.' });
    }

    const image_url = req.file ? `/uploads-70-studio/portfolios/${req.file.filename}` : req.body.image_url;
    const catId = parseInt(category_id) || 1;
    const portTitle = title || `Portfolio Item ${Date.now()}`;
    const w = parseInt(width) || 1600;
    const h = parseInt(height) || 1200;
    const ar = parseFloat(aspect_ratio) || parseFloat((w / h).toFixed(3));
    const orderNum = parseInt(order_index) || 0;

    const [result] = await pool.query(
      'INSERT INTO portfolios (title, category_id, image_url, width, height, aspect_ratio, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [portTitle, catId, image_url, w, h, ar, orderNum]
    );
    return res.status(201).json({
      success: true,
      message: 'Foto portofolio berhasil ditambahkan.',
      data: { id: result.insertId, title: portTitle, category_id: catId, image_url, width: w, height: h, aspect_ratio: ar, order_index: orderNum },
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengunggah foto portofolio: ' + error.message });
  }
});

// Batch Portfolio Upload
app.post('/api/portfolios/batch', authenticateToken, upload.array('images', 20), async (req, res) => {
  try {
    const { category_id } = req.body;
    const catId = parseInt(category_id) || 1;
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada file gambar yang dipilih.' });
    }

    const createdItems = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const image_url = `/uploads-70-studio/portfolios/${file.filename}`;
      const title = `Portfolio Foto #${Date.now().toString().slice(-4)}_${i + 1}`;

      const [result] = await pool.query(
        'INSERT INTO portfolios (title, category_id, image_url, width, height, aspect_ratio, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, catId, image_url, 1600, 1200, 1.333, i + 1]
      );
      createdItems.push({ id: result.insertId, title, category_id: catId, image_url });
    }

    return res.status(201).json({
      success: true,
      message: `Berhasil mengunggah ${createdItems.length} foto portofolio.`,
      data: createdItems,
    });
  } catch (error) {
    console.error('Batch upload error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengunggah batch foto: ' + error.message });
  }
});

app.put('/api/portfolios/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { title, category_id, width, height, aspect_ratio, order_index } = req.body;
    const image_url = req.file ? `/uploads-70-studio/portfolios/${req.file.filename}` : undefined;

    const [existing] = await pool.query('SELECT * FROM portfolios WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Foto tidak ditemukan.' });

    const updatedTitle = title || existing[0].title;
    const updatedCatId = category_id !== undefined ? parseInt(category_id) : existing[0].category_id;
    const updatedImg = image_url || req.body.image_url || existing[0].image_url;
    const updatedW = width ? parseInt(width) : existing[0].width;
    const updatedH = height ? parseInt(height) : existing[0].height;
    const updatedAr = aspect_ratio ? parseFloat(aspect_ratio) : existing[0].aspect_ratio;
    const updatedOrder = order_index !== undefined ? parseInt(order_index) : existing[0].order_index;

    await pool.query(
      'UPDATE portfolios SET title = ?, category_id = ?, image_url = ?, width = ?, height = ?, aspect_ratio = ?, order_index = ? WHERE id = ?',
      [updatedTitle, updatedCatId, updatedImg, updatedW, updatedH, updatedAr, updatedOrder, id]
    );

    return res.json({
      success: true,
      message: 'Portofolio berhasil diperbarui.',
      data: { id, title: updatedTitle, category_id: updatedCatId, image_url: updatedImg, width: updatedW, height: updatedH, aspect_ratio: updatedAr, order_index: updatedOrder },
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui portofolio: ' + error.message });
  }
});

app.delete('/api/portfolios/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [existing] = await pool.query('SELECT * FROM portfolios WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Foto tidak ditemukan.' });

    await pool.query('DELETE FROM portfolios WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Foto portofolio berhasil dihapus.' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus portofolio: ' + error.message });
  }
});

// ----------------------------------------------------
// BANNERS ENDPOINTS
// ----------------------------------------------------
app.get('/api/banners', async (req, res) => {
  try {
    const onlyActive = req.query.active === 'true';

    let sql = 'SELECT * FROM banners';
    if (onlyActive) sql += ' WHERE is_active = 1';
    sql += ' ORDER BY order_index ASC, id ASC';

    const [rows] = await pool.query(sql);
    return res.json({
      success: true,
      data: rows,
      pagination: { page: 1, limit: rows.length, total: rows.length, totalPages: 1 },
    });
  } catch (error) {
    console.error('Fetch banners error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil banner: ' + error.message });
  }
});

app.post('/api/banners', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, badge, link_url, order_index, is_active } = req.body;
    if (!req.file && !req.body.image_url) {
      return res.status(400).json({ success: false, message: 'File gambar banner wajib diunggah.' });
    }

    const image_url = req.file ? `/uploads-70-studio/banners/${req.file.filename}` : req.body.image_url;
    const bTitle = title || '70 Studio';
    const bSub = subtitle || '';
    const bBadge = badge || null;
    const bLink = link_url || '#portfolio';
    const bOrder = parseInt(order_index) || 0;
    const bActive = is_active !== undefined ? (is_active === '1' || is_active === 1 || is_active === true || is_active === 'true' ? 1 : 0) : 1;

    const [result] = await pool.query(
      'INSERT INTO banners (title, subtitle, image_url, badge, link_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bTitle, bSub, image_url, bBadge, bLink, bOrder, bActive]
    );
    return res.status(201).json({
      success: true,
      message: 'Banner berhasil ditambahkan.',
      data: { id: result.insertId, title: bTitle, subtitle: bSub, image_url, badge: bBadge, link_url: bLink, order_index: bOrder, is_active: bActive },
    });
  } catch (error) {
    console.error('Create banner error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan banner: ' + error.message });
  }
});

app.put('/api/banners/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { title, subtitle, badge, link_url, order_index, is_active } = req.body;
    const image_url = req.file ? `/uploads-70-studio/banners/${req.file.filename}` : undefined;

    const [existing] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Banner tidak ditemukan.' });

    const updatedTitle = title !== undefined ? title : existing[0].title;
    const updatedSub = subtitle !== undefined ? subtitle : existing[0].subtitle;
    const updatedBadge = badge !== undefined ? badge : existing[0].badge;
    const updatedLink = link_url !== undefined ? link_url : existing[0].link_url;
    const updatedImg = image_url || req.body.image_url || existing[0].image_url;
    const updatedOrder = order_index !== undefined ? parseInt(order_index) : existing[0].order_index;
    const updatedActive = is_active !== undefined ? (is_active === '1' || is_active === 1 || is_active === true || is_active === 'true' ? 1 : 0) : existing[0].is_active;

    await pool.query(
      'UPDATE banners SET title = ?, subtitle = ?, image_url = ?, badge = ?, link_url = ?, order_index = ?, is_active = ? WHERE id = ?',
      [updatedTitle, updatedSub, updatedImg, updatedBadge, updatedLink, updatedOrder, updatedActive, id]
    );

    return res.json({
      success: true,
      message: 'Banner berhasil diperbarui.',
      data: { id, title: updatedTitle, subtitle: updatedSub, image_url: updatedImg, badge: updatedBadge, link_url: updatedLink, order_index: updatedOrder, is_active: updatedActive },
    });
  } catch (error) {
    console.error('Update banner error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui banner: ' + error.message });
  }
});

app.delete('/api/banners/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [existing] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Banner tidak ditemukan.' });

    await pool.query('DELETE FROM banners WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Banner berhasil dihapus.' });
  } catch (error) {
    console.error('Delete banner error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus banner: ' + error.message });
  }
});

// ----------------------------------------------------
// DASHBOARD STATS
// ----------------------------------------------------
app.get('/api/stats/summary', authenticateToken, async (req, res) => {
  try {
    const [[{ total_portfolios }]] = await pool.query('SELECT COUNT(*) as total_portfolios FROM portfolios');
    const [[{ total_categories }]] = await pool.query('SELECT COUNT(*) as total_categories FROM categories');
    const [[{ total_banners }]] = await pool.query('SELECT COUNT(*) as total_banners FROM banners');
    return res.json({
      success: true,
      data: {
        totalPortfolios: total_portfolios || 0,
        totalCategories: total_categories || 0,
        totalBanners: total_banners || 0,
        serverStatus: 'Online (MySQL Database)',
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil statistik: ' + error.message });
  }
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal server.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 70 Studio Express API Server running on port ${PORT}`);
  console.log(`📂 Serving uploads at http://localhost:${PORT}/uploads-70-studio`);
});
