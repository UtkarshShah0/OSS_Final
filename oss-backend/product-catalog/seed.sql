CREATE DATABASE IF NOT EXISTS `Training` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `Training`;

-- categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- products
CREATE TABLE IF NOT EXISTS `products` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `sku` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(500) NOT NULL,
  `brand` VARCHAR(255),
  `description` TEXT,
  `price` DECIMAL(13,2),
  `currency` VARCHAR(10) DEFAULT 'INR',
  `stock` INT,
  `availability_status` VARCHAR(50),
  `active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- product_specs (ElementCollection map)
CREATE TABLE IF NOT EXISTS `product_specs` (
  `product_id` BIGINT NOT NULL,
  `spec_key` VARCHAR(255) NOT NULL,
  `spec_value` VARCHAR(1000),
  PRIMARY KEY (`product_id`,`spec_key`),
  CONSTRAINT fk_specs_product FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- product_categories (many-to-many)
CREATE TABLE IF NOT EXISTS `product_categories` (
  `product_id` BIGINT NOT NULL,
  `category_id` BIGINT NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  CONSTRAINT fk_pc_product FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  CONSTRAINT fk_pc_category FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- product_images
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `image_data` LONGBLOB,
  `image_url` VARCHAR(1000),
  `content_type` VARCHAR(255),
  `alt_text` VARCHAR(500),
  `sort_order` INT,
  `product_id` BIGINT,
  CONSTRAINT fk_image_product FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `product_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `user_avatar` VARCHAR(1000),
  `rating` INT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `comment` TEXT,
  `verified_purchase` TINYINT(1) NOT NULL DEFAULT 0,
  `helpful_count` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_product FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed categories
INSERT INTO `categories` (`name`,`description`) VALUES
('Electronics','Phones, computers, audio and home electronics'),
('Fashion','Clothing, shoes and accessories'),
('Home & Living','Home appliances and furniture'),
('Books','Printed and digital books'),
('Sports','Sporting goods and equipment'),
('Beauty','Beauty and personal care')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Seed products (realistic values; SKUs must be unique)
INSERT INTO `products` (`sku`,`name`,`brand`,`description`,`price`,`currency`,`stock`,`availability_status`,`active`) VALUES
('SKU-APL-IP15PM','Apple iPhone 15 Pro Max','Apple','A17 Pro chip, Titanium body, Pro camera system',134999.00,'INR',45,'IN_STOCK',1),
('SKU-APL-MB16M3','MacBook Pro 16 M3 Max','Apple','M3 Max, Liquid Retina XDR 16-inch',349999.00,'INR',12,'IN_STOCK',1),
('SKU-SON-WH1000XM5','Sony WH-1000XM5 Headphones','Sony','Noise cancelling, 30hr battery',29999.00,'INR',78,'IN_STOCK',1),
('SKU-SAM-65QLED','Samsung 65 4K QLED','Samsung','Quantum Dot color, Smart Tizen',129999.00,'INR',23,'IN_STOCK',1),
('SKU-NIK-AIR270','Nike Air Max 270','Nike','Air Max cushioning, everyday wear',8999.00,'INR',156,'IN_STOCK',1),
('SKU-BOOK-EVELYN','The Seven Husbands of Evelyn Hugo','Atria Books','Novel by Taylor Jenkins Reid',599.00,'INR',456,'IN_STOCK',1),
('SKU-KIT-ARTSMX','KitchenAid Artisan Stand Mixer','KitchenAid','Versatile stand mixer with 5-qt stainless steel bowl',44999.00,'INR',30,'IN_STOCK',1),
('SKU-YOG-PRO','Manduka Pro Yoga Mat','Manduka','High-density yoga mat for studio practice',6999.00,'INR',120,'IN_STOCK',1),
('SKU-BEA-GLWSET','GlowCare Skincare Set','GlowCare','Hydrating cleanser, serum and moisturizer set for glowing skin',3999.00,'INR',200,'IN_STOCK',1)
ON DUPLICATE KEY UPDATE name=VALUES(name), brand=VALUES(brand), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), availability_status=VALUES(availability_status), active=VALUES(active);

-- Map products to categories
INSERT IGNORE INTO `product_categories` (`product_id`,`category_id`)
SELECT p.id, c.id FROM products p JOIN categories c ON
 (p.sku='SKU-APL-IP15PM' AND c.name='Electronics')
UNION ALL
SELECT p.id, c.id FROM products p JOIN categories c ON
 (p.sku='SKU-APL-MB16M3' AND c.name='Electronics')
UNION ALL
SELECT p.id, c.id FROM products p JOIN categories c ON
 (p.sku='SKU-SON-WH1000XM5' AND c.name='Electronics')
UNION ALL
SELECT p.id, c.id FROM products p JOIN categories c ON
 (p.sku='SKU-SAM-65QLED' AND c.name='Electronics')
UNION ALL
SELECT p.id, c.id FROM products p JOIN categories c ON
 (p.sku='SKU-NIK-AIR270' AND c.name='Fashion')
UNION ALL
SELECT p.id, c.id FROM products p JOIN categories c ON
 (p.sku='SKU-BOOK-EVELYN' AND c.name='Books');

-- Map the new products to categories
INSERT IGNORE INTO `product_categories` (`product_id`,`category_id`)
SELECT p.id, c.id FROM products p JOIN categories c ON
 (p.sku='SKU-KIT-ARTSMX' AND c.name='Home & Living')
UNION ALL
SELECT p.id, c.id FROM products p JOIN categories c ON
 (p.sku='SKU-YOG-PRO' AND c.name='Sports')
UNION ALL
SELECT p.id, c.id FROM products p JOIN categories c ON
 (p.sku='SKU-BEA-GLWSET' AND c.name='Beauty');

-- Product specifications (example key/value)
INSERT INTO `product_specs` (`product_id`,`spec_key`,`spec_value`)
SELECT id,'Storage','256GB' FROM products WHERE sku='SKU-APL-IP15PM' UNION ALL
SELECT id,'Color','Natural Titanium' FROM products WHERE sku='SKU-APL-IP15PM' UNION ALL
SELECT id,'Chip','M3 Max' FROM products WHERE sku='SKU-APL-MB16M3' UNION ALL
SELECT id,'RAM','36GB' FROM products WHERE sku='SKU-APL-MB16M3' UNION ALL
SELECT id,'Battery','30 hours' FROM products WHERE sku='SKU-SON-WH1000XM5' UNION ALL
SELECT id,'Screen Size','65 inch' FROM products WHERE sku='SKU-SAM-65QLED' UNION ALL
SELECT id,'Material','Mesh & Synthetic' FROM products WHERE sku='SKU-NIK-AIR270' UNION ALL
SELECT id,'Format','Paperback' FROM products WHERE sku='SKU-BOOK-EVELYN';

-- Specs for new products
INSERT INTO `product_specs` (`product_id`,`spec_key`,`spec_value`)
SELECT id,'Capacity','5 Quart' FROM products WHERE sku='SKU-KIT-ARTSMX' UNION ALL
SELECT id,'Motor','325 Watts' FROM products WHERE sku='SKU-KIT-ARTSMX' UNION ALL
SELECT id,'Thickness','6mm' FROM products WHERE sku='SKU-YOG-PRO' UNION ALL
SELECT id,'Length','183cm' FROM products WHERE sku='SKU-YOG-PRO' UNION ALL
SELECT id,'Set Items','3' FROM products WHERE sku='SKU-BEA-GLWSET' UNION ALL
SELECT id,'Skin Type','All Skin Types' FROM products WHERE sku='SKU-BEA-GLWSET';

-- Product images: use more reliable Unsplash source queries (updates below patch existing rows)
INSERT INTO `product_images` (`image_data`,`image_url`,`content_type`,`alt_text`,`sort_order`,`product_id`)
VALUES
(NULL,'https://source.unsplash.com/1600x900/?iphone,phone','image/jpeg','iPhone 15 front',1,(SELECT id FROM products WHERE sku='SKU-APL-IP15PM')),
(NULL,'https://source.unsplash.com/1600x900/?laptop,macbook','image/jpeg','MacBook Pro open',1,(SELECT id FROM products WHERE sku='SKU-APL-MB16M3')),
(NULL,'https://source.unsplash.com/1600x900/?headphones,headset','image/jpeg','Sony Headphones',1,(SELECT id FROM products WHERE sku='SKU-SON-WH1000XM5')),
(NULL,'https://source.unsplash.com/1600x900/?television,tv','image/jpeg','Samsung 65 QLED',1,(SELECT id FROM products WHERE sku='SKU-SAM-65QLED')),
(NULL,'https://source.unsplash.com/1600x900/?sneakers,shoes','image/jpeg','Nike Air Max 270',1,(SELECT id FROM products WHERE sku='SKU-NIK-AIR270')),
(NULL,'https://source.unsplash.com/1600x900/?book,novel','image/jpeg','The Seven Husbands of Evelyn Hugo',1,(SELECT id FROM products WHERE sku='SKU-BOOK-EVELYN')),
(NULL,'https://source.unsplash.com/1600x900/?stand-mixer,kitchen-mixer','image/jpeg','KitchenAid Artisan Mixer',1,(SELECT id FROM products WHERE sku='SKU-KIT-ARTSMX')),
(NULL,'https://source.unsplash.com/1600x900/?yoga-mat,yoga','image/jpeg','Manduka Pro Yoga Mat',1,(SELECT id FROM products WHERE sku='SKU-YOG-PRO')),
(NULL,'https://source.unsplash.com/1600x900/?skincare,beauty','image/jpeg','GlowCare Skincare Set',1,(SELECT id FROM products WHERE sku='SKU-BEA-GLWSET'))
ON DUPLICATE KEY UPDATE alt_text=VALUES(alt_text), content_type=VALUES(content_type), image_url=VALUES(image_url), sort_order=VALUES(sort_order);

-- Non-destructive update: update existing product_images.image_url based on product SKU
-- This updates rows already inserted in the database without creating duplicates.
UPDATE product_images pi
JOIN products p ON pi.product_id = p.id
SET pi.image_url = CASE
  WHEN p.sku = 'SKU-APL-IP15PM' THEN 'https://source.unsplash.com/1600x900/?iphone,phone'
  WHEN p.sku = 'SKU-APL-MB16M3' THEN 'https://source.unsplash.com/1600x900/?laptop,macbook'
  WHEN p.sku = 'SKU-SON-WH1000XM5' THEN 'https://source.unsplash.com/1600x900/?headphones,headset'
  WHEN p.sku = 'SKU-SAM-65QLED' THEN 'https://source.unsplash.com/1600x900/?television,tv'
  WHEN p.sku = 'SKU-NIK-AIR270' THEN 'https://source.unsplash.com/1600x900/?sneakers,shoes'
  WHEN p.sku = 'SKU-BOOK-EVELYN' THEN 'https://source.unsplash.com/1600x900/?book,novel'
  WHEN p.sku = 'SKU-KIT-ARTSMX' THEN 'https://source.unsplash.com/1600x900/?stand-mixer,kitchen-mixer'
  WHEN p.sku = 'SKU-YOG-PRO' THEN 'https://source.unsplash.com/1600x900/?yoga-mat,yoga'
  WHEN p.sku = 'SKU-BEA-GLWSET' THEN 'https://source.unsplash.com/1600x900/?skincare,beauty'
  ELSE pi.image_url
END
WHERE p.sku IN ('SKU-APL-IP15PM','SKU-APL-MB16M3','SKU-SON-WH1000XM5','SKU-SAM-65QLED','SKU-NIK-AIR270','SKU-BOOK-EVELYN','SKU-KIT-ARTSMX','SKU-YOG-PRO','SKU-BEA-GLWSET');

-- Reviews (sample)
INSERT INTO `reviews` (`product_id`,`user_id`,`user_name`,`user_avatar`,`rating`,`title`,`comment`,`verified_purchase`,`helpful_count`,`created_at`)
VALUES
((SELECT id FROM products WHERE sku='SKU-APL-IP15PM'),1001,'John Doe',NULL,5,'Amazing phone','Love the new titanium design and the camera is incredible. Battery life is excellent too.',1,234,'2024-01-15 10:12:00'),
((SELECT id FROM products WHERE sku='SKU-APL-IP15PM'),1002,'Jane Smith',NULL,4,'Great upgrade','Upgraded from iPhone 13. The performance improvement is noticeable.',1,189,'2024-01-10 09:00:00'),
((SELECT id FROM products WHERE sku='SKU-SON-WH1000XM5'),1100,'AudioFan',NULL,5,'Fantastic ANC','Best noise cancelling headphones I have used.',1,54,'2024-02-21 14:30:00');

-- End of seed


UPDATE product_images pi
JOIN products p ON pi.product_id = p.id
SET pi.image_url = CASE
  WHEN p.sku = 'SKU-APL-IP15PM' THEN 'https://images.unsplash.com/photo-1720357632099-6d84cd7ee044?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  WHEN p.sku = 'SKU-APL-MB16M3' THEN 'https://images.unsplash.com/photo-1672241860863-fab879bd4a07?q=80&w=1131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  WHEN p.sku = 'SKU-SON-WH1000XM5' THEN 'https://images.unsplash.com/photo-1549206464-82c129240d11?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  WHEN p.sku = 'SKU-SAM-65QLED' THEN 'https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?q=80&w=1026&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  WHEN p.sku = 'SKU-NIK-AIR270' THEN 'https://images.unsplash.com/photo-1731132198530-e4b2dc51d511?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  WHEN p.sku = 'SKU-BOOK-EVELYN' THEN 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  WHEN p.sku = 'SKU-KIT-ARTSMX' THEN 'https://m.media-amazon.com/images/I/51GrUcKik0L._SX679_.jpg'
  WHEN p.sku = 'SKU-YOG-PRO' THEN 'https://images.unsplash.com/photo-1591291621164-2c6367723315?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  WHEN p.sku = 'SKU-BEA-GLWSET' THEN 'https://images.unsplash.com/photo-1765887986673-953fccf56464?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ELSE pi.image_url
END;
