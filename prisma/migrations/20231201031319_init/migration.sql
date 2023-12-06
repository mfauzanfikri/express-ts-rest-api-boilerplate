/*
  Warnings:

  - You are about to drop the column `position_id` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the `disposition_form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `priority` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nip]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nik]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `incoming_letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `outgoing_letter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `disposition_form` DROP FOREIGN KEY `disposition_form_incoming_letter_id_fkey`;

-- DropForeignKey
ALTER TABLE `disposition_form` DROP FOREIGN KEY `disposition_form_priority_id_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `employee_user_id_fkey`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `position_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `nik` VARCHAR(191) NULL,
    ADD COLUMN `position` VARCHAR(191) NOT NULL,
    ADD COLUMN `positionId` INTEGER NULL,
    MODIFY `nip` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `incoming_letter` ADD COLUMN `path` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `outgoing_letter` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `path` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `employee_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `disposition_form`;

-- DropTable
DROP TABLE `priority`;

-- CreateTable
CREATE TABLE `disposition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from` INTEGER NOT NULL,
    `to` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,
    `instruction_id` INTEGER NOT NULL,
    `incoming_letter_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instruction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instruction` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `employee_nip_key` ON `employee`(`nip`);

-- CreateIndex
CREATE UNIQUE INDEX `employee_nik_key` ON `employee`(`nik`);

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `position`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disposition` ADD CONSTRAINT `disposition_incoming_letter_id_fkey` FOREIGN KEY (`incoming_letter_id`) REFERENCES `incoming_letter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disposition` ADD CONSTRAINT `disposition_instruction_id_fkey` FOREIGN KEY (`instruction_id`) REFERENCES `instruction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
