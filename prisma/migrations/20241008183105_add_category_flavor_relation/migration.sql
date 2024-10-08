/*
  Warnings:

  - Added the required column `categoryId` to the `Flavor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Flavor` ADD COLUMN `categoryId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Subscriber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Subscriber_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Flavor_categoryId_idx` ON `Flavor`(`categoryId`);
