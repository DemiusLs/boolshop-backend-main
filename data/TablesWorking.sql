CREATE TABLE `prints`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_artist` INT UNSIGNED NOT NULL,
    `slug` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `creation_year` INT NULL,
    `id_genre` INT UNSIGNED NULL,
    `price` DECIMAL(8, 2) NULL,
    `original_price` DECIMAL(8, 2) NULL,
    `description` TEXT NULL,
    `stock` INT NULL,
    `img_url` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
);
CREATE TABLE `orders`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NULL,
    `mail` VARCHAR(255) NULL,
    `phone_number` VARCHAR(255) NULL,
    `total_price` DECIMAL(8, 2) NULL,
    `billing_address` VARCHAR(255) NULL,
    `shipping_address` VARCHAR(255) NULL,
    `order_status` INT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
);
CREATE TABLE `artists`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
);
CREATE TABLE `order_print`(
    `id_print` INT UNSIGNED NOT NULL,
    `id_order` INT UNSIGNED NOT NULL,
    `quantity_req` INT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    PRIMARY KEY(`id_print`)
);
ALTER TABLE
    `order_print` ADD INDEX `order_print_id_print_id_order_index`(`id_print`, `id_order`);
CREATE TABLE `genres`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NULL,
    `abstract` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL
);
ALTER TABLE
    `order_print` ADD CONSTRAINT `order_print_id_order_foreign` FOREIGN KEY(`id_order`) REFERENCES `orders`(`id`);
ALTER TABLE
    `prints` ADD CONSTRAINT `prints_id_artist_foreign` FOREIGN KEY(`id_artist`) REFERENCES `artists`(`id`);
ALTER TABLE
    `order_print` ADD CONSTRAINT `order_print_id_print_foreign` FOREIGN KEY(`id_print`) REFERENCES `prints`(`id`);
ALTER TABLE
    `prints` ADD CONSTRAINT `prints_id_genre_foreign` FOREIGN KEY(`id_genre`) REFERENCES `genres`(`id`);


-- Modifiche da implementare

ALTER TABLE order_print
DROP PRIMARY KEY,
ADD PRIMARY KEY (id_order, id_print);