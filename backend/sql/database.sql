-- ==========================================================
-- 70 STUDIO DATABASE EXPORT
-- Database: 70_studio_db
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `70_studio_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `70_studio_db`;

-- --------------------------------------------------------
-- Table structure for table `admins`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `admins` (Default: admin / admin123)
INSERT INTO `admins` (`username`, `password`, `name`) VALUES
('admin', '$2a$10$f3winVAwLuNgY1b/Ab35tuBDQa2WcEFLxqbvDbu0rtpMJwfoENTtK', 'Administrator 70 Studio');

-- --------------------------------------------------------
-- Table structure for table `categories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `label` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `cover_image` VARCHAR(255),
  `order_index` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `categories`
INSERT INTO `categories` (`id`, `slug`, `name`, `label`, `description`, `cover_image`, `order_index`) VALUES
(1, 'prewedding', 'Prewedding', 'Prewedding', 'Romansa abadi berdua dalam estetika elegan dan hangat', '/uploads-70-studio/portfolios/Prewedding/08_DSCF2216.jpg', 1),
(2, 'graduation', 'Graduation', 'Wisuda', 'Rayakan pencapaian terbaik bersama jubah kebanggaan', '/uploads-70-studio/portfolios/Graduation/01_DSCF0311.jpg', 2),
(3, 'family', 'Family', 'Keluarga', 'Kehangatan & tawa keluarga dalam satu frame penuh makna', '/uploads-70-studio/portfolios/Family/01_DSCF0010.jpg', 3),
(4, 'group', 'Group', 'Group', 'Momen kebersamaan seru bersama sahabat terdekat', '/uploads-70-studio/portfolios/Group/01_DSCF0105.jpg', 4),
(5, 'maternity', 'Maternity', 'Maternity', 'Perjalanan cinta menyambut kehadiran buah hati tersayang', '/uploads-70-studio/portfolios/Maternity/01_DSCF1011.jpg', 5),
(6, 'model', 'Model', 'Model', 'Editorial look, lookbook komersial, & portfolio modelling', '/uploads-70-studio/portfolios/Model/07_dasha-25-juli-20254413.jpg', 6),
(7, 'personal', 'Personal', 'Personal', 'Eksplorasi karakter & profil diri dengan pencahayaan sinematik', '/uploads-70-studio/portfolios/Personal/02_DSCF1440.jpg', 7),
(8, 'birthday', 'Birthday', 'Birthday', 'Kemeriahan hari spesial bertabur senyum ceria', '/uploads-70-studio/portfolios/Birthday/01_DSCF6667_.jpg', 8);

-- --------------------------------------------------------
-- Table structure for table `portfolios`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `portfolios`;
CREATE TABLE `portfolios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `width` INT DEFAULT 1600,
  `height` INT DEFAULT 1200,
  `aspect_ratio` DECIMAL(5,3) DEFAULT 1.333,
  `order_index` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (category_id),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `portfolios`
INSERT INTO `portfolios` (`title`, `category_id`, `image_url`, `width`, `height`, `aspect_ratio`, `order_index`) VALUES
('Birthday Collection #1', 8, '/uploads-70-studio/portfolios/Birthday/01_DSCF6667_.jpg', 899, 1600, 0.562, 1),
('Birthday Collection #2', 8, '/uploads-70-studio/portfolios/Birthday/02_DSCF6797_.jpg', 899, 1600, 0.562, 2),
('Birthday Collection #3', 8, '/uploads-70-studio/portfolios/Birthday/03_DSCF6821_.jpg', 899, 1600, 0.562, 3),
('Birthday Collection #4', 8, '/uploads-70-studio/portfolios/Birthday/04_DSCF6884_.jpg', 1600, 899, 1.78, 4),
('Birthday Collection #5', 8, '/uploads-70-studio/portfolios/Birthday/05_DSCF7890_.jpg', 1600, 1066, 1.501, 5),
('Birthday Collection #6', 8, '/uploads-70-studio/portfolios/Birthday/06_DSCF7918_.jpg', 1066, 1600, 0.666, 6),
('Birthday Collection #7', 8, '/uploads-70-studio/portfolios/Birthday/07_DSCF7949_.jpg', 1600, 1066, 1.501, 7),
('Birthday Collection #8', 8, '/uploads-70-studio/portfolios/Birthday/08_DSCF7965_.jpg', 1600, 1066, 1.501, 8),
('Birthday Collection #9', 8, '/uploads-70-studio/portfolios/Birthday/09_DSCF8694_.jpg', 1600, 1066, 1.501, 9),
('Birthday Collection #10', 8, '/uploads-70-studio/portfolios/Birthday/10_DSCF8969_.jpg', 1600, 1066, 1.501, 10),
('Family Collection #1', 3, '/uploads-70-studio/portfolios/Family/01_DSCF0010.jpg', 1600, 1066, 1.501, 11),
('Family Collection #2', 3, '/uploads-70-studio/portfolios/Family/02_DSCF0070.jpg', 1600, 1066, 1.501, 12),
('Family Collection #3', 3, '/uploads-70-studio/portfolios/Family/03_DSCF0161.jpg', 1600, 1066, 1.501, 13),
('Family Collection #4', 3, '/uploads-70-studio/portfolios/Family/04_DSCF1930_.jpg', 1600, 899, 1.78, 14),
('Family Collection #5', 3, '/uploads-70-studio/portfolios/Family/05_DSCF1943_.jpg', 1600, 899, 1.78, 15),
('Family Collection #6', 3, '/uploads-70-studio/portfolios/Family/06_DSCF2002_.jpg', 1599, 1066, 1.5, 16),
('Family Collection #7', 3, '/uploads-70-studio/portfolios/Family/07_DSCF2550_.jpg', 899, 1600, 0.562, 17),
('Family Collection #8', 3, '/uploads-70-studio/portfolios/Family/08_DSCF3232_.jpg', 1600, 899, 1.78, 18),
('Family Collection #9', 3, '/uploads-70-studio/portfolios/Family/09_DSCF4291_.jpg', 1599, 1066, 1.5, 19),
('Family Collection #10', 3, '/uploads-70-studio/portfolios/Family/10_DSCF4389_.jpg', 1600, 899, 1.78, 20),
('Family Collection #11', 3, '/uploads-70-studio/portfolios/Family/11_DSCF4707_.jpg', 899, 1600, 0.562, 21),
('Family Collection #12', 3, '/uploads-70-studio/portfolios/Family/12_DSCF4724_.jpg', 899, 1600, 0.562, 22),
('Family Collection #13', 3, '/uploads-70-studio/portfolios/Family/13_DSCF4731.jpg', 1600, 899, 1.78, 23),
('Family Collection #14', 3, '/uploads-70-studio/portfolios/Family/14_DSCF5030_.jpg', 1600, 899, 1.78, 24),
('Family Collection #15', 3, '/uploads-70-studio/portfolios/Family/15_DSCF5106_.jpg', 1600, 1006, 1.59, 25),
('Family Collection #16', 3, '/uploads-70-studio/portfolios/Family/16_DSCF5537_.jpg', 899, 1600, 0.562, 26),
('Family Collection #17', 3, '/uploads-70-studio/portfolios/Family/17_DSCF5926_.jpg', 1600, 899, 1.78, 27),
('Family Collection #18', 3, '/uploads-70-studio/portfolios/Family/18_DSCF7215.jpg', 1600, 1066, 1.501, 28),
('Family Collection #19', 3, '/uploads-70-studio/portfolios/Family/19_DSCF8667.jpg', 1000, 1500, 0.667, 29),
('Family Collection #20', 3, '/uploads-70-studio/portfolios/Family/20_DSCF8681.jpg', 1000, 1500, 0.667, 30),
('Family Collection #21', 3, '/uploads-70-studio/portfolios/Family/21_DSCF8732.jpg', 1000, 1500, 0.667, 31),
('Family Collection #22', 3, '/uploads-70-studio/portfolios/Family/22_DSCF9188_.jpg', 1066, 1600, 0.666, 32),
('Graduation Collection #1', 2, '/uploads-70-studio/portfolios/Graduation/01_DSCF0311.jpg', 1066, 1600, 0.666, 33),
('Graduation Collection #2', 2, '/uploads-70-studio/portfolios/Graduation/02_DSCF0413.jpg', 1066, 1600, 0.666, 34),
('Graduation Collection #3', 2, '/uploads-70-studio/portfolios/Graduation/03_DSCF0905.jpg', 1600, 1066, 1.501, 35),
('Graduation Collection #4', 2, '/uploads-70-studio/portfolios/Graduation/04_DSCF1632_.jpg', 1066, 1600, 0.666, 36),
('Graduation Collection #5', 2, '/uploads-70-studio/portfolios/Graduation/05_DSCF2257_.jpg', 1066, 1600, 0.666, 37),
('Graduation Collection #6', 2, '/uploads-70-studio/portfolios/Graduation/06_DSCF6465_.jpg', 1600, 899, 1.78, 38),
('Graduation Collection #7', 2, '/uploads-70-studio/portfolios/Graduation/07_DSCF6619_.jpg', 899, 1600, 0.562, 39),
('Graduation Collection #8', 2, '/uploads-70-studio/portfolios/Graduation/08_DSCF8184_.jpg', 1066, 1600, 0.666, 40),
('Graduation Collection #9', 2, '/uploads-70-studio/portfolios/Graduation/09_DSCF8531_.jpg', 1066, 1600, 0.666, 41),
('Group Collection #1', 4, '/uploads-70-studio/portfolios/Group/01_DSCF0105.jpg', 1600, 1066, 1.501, 42),
('Group Collection #2', 4, '/uploads-70-studio/portfolios/Group/02_DSCF0160_.jpg', 1600, 1066, 1.501, 43),
('Group Collection #3', 4, '/uploads-70-studio/portfolios/Group/03_DSCF0209_1.jpg', 1600, 1066, 1.501, 44),
('Group Collection #4', 4, '/uploads-70-studio/portfolios/Group/04_DSCF1450.jpg', 1599, 1066, 1.5, 45),
('Group Collection #5', 4, '/uploads-70-studio/portfolios/Group/05_DSCF2237.jpg', 1600, 1066, 1.501, 46),
('Group Collection #6', 4, '/uploads-70-studio/portfolios/Group/06_DSCF2509.jpg', 1599, 1066, 1.5, 47),
('Group Collection #7', 4, '/uploads-70-studio/portfolios/Group/07_DSCF4222_.jpg', 1600, 1066, 1.501, 48),
('Group Collection #8', 4, '/uploads-70-studio/portfolios/Group/08_DSCF4236.jpg', 1600, 1066, 1.501, 49),
('Group Collection #9', 4, '/uploads-70-studio/portfolios/Group/09_DSCF5556-2.jpg', 1599, 1066, 1.5, 50),
('Group Collection #10', 4, '/uploads-70-studio/portfolios/Group/10_DSCF5752-2.jpg', 1599, 1066, 1.5, 51),
('Group Collection #11', 4, '/uploads-70-studio/portfolios/Group/11_DSCF5780-2.jpg', 1599, 1066, 1.5, 52),
('Group Collection #12', 4, '/uploads-70-studio/portfolios/Group/12_DSCF6595.jpg', 1599, 1066, 1.5, 53),
('Group Collection #13', 4, '/uploads-70-studio/portfolios/Group/13_DSCF6872.jpg', 1600, 1066, 1.501, 54),
('Group Collection #14', 4, '/uploads-70-studio/portfolios/Group/14_DSCF7355.jpg', 1599, 1066, 1.5, 55),
('Group Collection #15', 4, '/uploads-70-studio/portfolios/Group/15_DSCF7531.edit.jpg', 1278, 1600, 0.799, 56),
('Group Collection #16', 4, '/uploads-70-studio/portfolios/Group/16_DSCF7569edit.jpg', 1599, 1066, 1.5, 57),
('Group Collection #17', 4, '/uploads-70-studio/portfolios/Group/17_DSCF9660.jpg', 1599, 1066, 1.5, 58),
('Group Collection #18', 4, '/uploads-70-studio/portfolios/Group/18_DSCF9675.jpg', 1599, 1066, 1.5, 59),
('Group Collection #19', 4, '/uploads-70-studio/portfolios/Group/19_DSCF9687.jpg', 1066, 1599, 0.667, 60),
('Group Collection #20', 4, '/uploads-70-studio/portfolios/Group/20_Santos-02.jpg', 1599, 1066, 1.5, 61),
('Maternity Collection #1', 5, '/uploads-70-studio/portfolios/Maternity/01_DSCF1011.jpg', 1600, 1066, 1.501, 62),
('Maternity Collection #2', 5, '/uploads-70-studio/portfolios/Maternity/02_DSCF1075.jpg', 1066, 1600, 0.666, 63),
('Maternity Collection #3', 5, '/uploads-70-studio/portfolios/Maternity/03_DSCF1169.jpg', 1066, 1600, 0.666, 64),
('Maternity Collection #4', 5, '/uploads-70-studio/portfolios/Maternity/04_DSCF3787.jpg', 1066, 1599, 0.667, 65),
('Maternity Collection #5', 5, '/uploads-70-studio/portfolios/Maternity/05_DSCF3977.jpg', 1066, 1599, 0.667, 66),
('Maternity Collection #6', 5, '/uploads-70-studio/portfolios/Maternity/06_DSCF9458_.jpg', 1066, 1600, 0.666, 67),
('Maternity Collection #7', 5, '/uploads-70-studio/portfolios/Maternity/07_DSCF9566_.jpg', 1066, 1600, 0.666, 68),
('Maternity Collection #8', 5, '/uploads-70-studio/portfolios/Maternity/08_DSCF9570_.jpg', 1066, 1600, 0.666, 69),
('Model Collection #1', 6, '/uploads-70-studio/portfolios/Model/01_11.jpg', 1600, 1066, 1.501, 70),
('Model Collection #2', 6, '/uploads-70-studio/portfolios/Model/02_12_1.jpg', 1066, 1600, 0.666, 71),
('Model Collection #3', 6, '/uploads-70-studio/portfolios/Model/03_CARD5999.jpg', 1066, 1600, 0.666, 72),
('Model Collection #4', 6, '/uploads-70-studio/portfolios/Model/04_Charlene-8-Agustus-20257614.jpg', 1066, 1600, 0.666, 73),
('Model Collection #5', 6, '/uploads-70-studio/portfolios/Model/05_Esmod---Mutiara6251.jpg', 1066, 1600, 0.666, 74),
('Model Collection #6', 6, '/uploads-70-studio/portfolios/Model/06_adena-2-July0381.jpg', 1066, 1600, 0.666, 75),
('Model Collection #7', 6, '/uploads-70-studio/portfolios/Model/07_dasha-25-juli-20254413.jpg', 1066, 1600, 0.666, 76),
('Model Collection #8', 6, '/uploads-70-studio/portfolios/Model/08_kaes-9-agustus-20256512.jpg', 1066, 1600, 0.666, 77),
('Personal Collection #1', 7, '/uploads-70-studio/portfolios/Personal/01_192d7d97-acc7-4e9e-8440-8acc262b7a98.jpg', 1066, 1600, 0.666, 78),
('Personal Collection #2', 7, '/uploads-70-studio/portfolios/Personal/02_DSCF1440_.jpg', 1066, 1600, 0.666, 79),
('Personal Collection #3', 7, '/uploads-70-studio/portfolios/Personal/03_DSCF1467_.jpg', 1066, 1600, 0.666, 80),
('Personal Collection #4', 7, '/uploads-70-studio/portfolios/Personal/04_DSCF1530_.jpg', 1066, 1600, 0.666, 81),
('Personal Collection #5', 7, '/uploads-70-studio/portfolios/Personal/05_DSCF1662_.jpg', 1066, 1600, 0.666, 82),
('Personal Collection #6', 7, '/uploads-70-studio/portfolios/Personal/06_DSCF5656.jpg', 1066, 1599, 0.667, 83),
('Personal Collection #7', 7, '/uploads-70-studio/portfolios/Personal/07_DSCF6083_.jpg', 1066, 1599, 0.667, 84),
('Personal Collection #8', 7, '/uploads-70-studio/portfolios/Personal/08_DSCF6101.jpg', 1066, 1599, 0.667, 85),
('Prewedding Collection #1', 1, '/uploads-70-studio/portfolios/Prewedding/01_DSC01992.jpg', 1066, 1600, 0.666, 86),
('Prewedding Collection #2', 1, '/uploads-70-studio/portfolios/Prewedding/02_DSC02044.jpg', 1066, 1600, 0.666, 87),
('Prewedding Collection #3', 1, '/uploads-70-studio/portfolios/Prewedding/03_DSC02056.jpg', 1066, 1600, 0.666, 88),
('Prewedding Collection #4', 1, '/uploads-70-studio/portfolios/Prewedding/04_DSC02270.jpg', 1066, 1600, 0.666, 89),
('Prewedding Collection #5', 1, '/uploads-70-studio/portfolios/Prewedding/05_DSCF0252.jpg', 1066, 1600, 0.666, 90),
('Prewedding Collection #6', 1, '/uploads-70-studio/portfolios/Prewedding/06_DSCF0312.jpg', 1066, 1600, 0.666, 91),
('Prewedding Collection #7', 1, '/uploads-70-studio/portfolios/Prewedding/07_DSCF0363.jpg', 1066, 1600, 0.666, 92),
('Prewedding Collection #8', 1, '/uploads-70-studio/portfolios/Prewedding/08_DSCF2216.jpg', 1599, 1066, 1.5, 93),
('Prewedding Collection #9', 1, '/uploads-70-studio/portfolios/Prewedding/09_DSCF2217.jpg', 1066, 1599, 0.667, 94),
('Prewedding Collection #10', 1, '/uploads-70-studio/portfolios/Prewedding/10_DSCF2238.jpg', 1066, 1599, 0.667, 95),
('Prewedding Collection #11', 1, '/uploads-70-studio/portfolios/Prewedding/11_DSCF9491.jpg', 1599, 1066, 1.5, 96),
('Prewedding Collection #12', 1, '/uploads-70-studio/portfolios/Prewedding/12_DSCF9517.jpg', 1599, 1066, 1.5, 97),
('Prewedding Collection #13', 1, '/uploads-70-studio/portfolios/Prewedding/13_DSCF9599.jpg', 1599, 1066, 1.5, 98);

-- --------------------------------------------------------
-- Table structure for table `banners`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL DEFAULT '70 Studio',
  `subtitle` TEXT,
  `image_url` VARCHAR(500) NOT NULL,
  `badge` VARCHAR(100) DEFAULT NULL,
  `link_url` VARCHAR(255) DEFAULT '#portfolio',
  `order_index` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `banners`
INSERT INTO `banners` (`title`, `subtitle`, `image_url`, `badge`, `link_url`, `order_index`, `is_active`) VALUES
('70 Studio', 'Timeless memories, lovingly captured', '/uploads-70-studio/portfolios/Prewedding/08_DSCF2216.jpg', 'Exclusive Photography', '#portfolio', 1, 1),
('70 Studio', 'Professional Photography Studio in Duren Sawit, Jakarta Timur', '/uploads-70-studio/portfolios/Graduation/01_DSCF0311.jpg', 'Modern & Warm', '#portfolio', 2, 1),
('70 Studio', 'Abadikan Momen Bahagia & Berharga Anda Bersama Kami', '/uploads-70-studio/portfolios/Family/01_DSCF0010.jpg', 'Signature Moment', '#portfolio', 3, 1),
('70 Studio', 'Editorial look, lookbook komersial, & portfolio modelling', '/uploads-70-studio/portfolios/Model/07_dasha-25-juli-20254413.jpg', 'Creative Concept', '#portfolio', 4, 1);
