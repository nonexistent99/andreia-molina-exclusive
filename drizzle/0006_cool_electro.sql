CREATE TABLE `admins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(50) NOT NULL,
	`password` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastLoginAt` timestamp,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `modelProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`modelId` int NOT NULL,
	`productId` int NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`customPrice` int,
	`customName` varchar(255),
	`customDescription` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modelProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `models` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` text,
	`description` text,
	`primaryColor` varchar(7) NOT NULL DEFAULT '#FF0066',
	`secondaryColor` varchar(7) NOT NULL DEFAULT '#9333EA',
	`accentColor` varchar(7) NOT NULL DEFAULT '#FF0066',
	`heroImageUrl` text,
	`aboutImageUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `models_id` PRIMARY KEY(`id`),
	CONSTRAINT `models_slug_unique` UNIQUE(`slug`)
);
