CREATE TABLE `models` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`heroVideoUrl` text,
	`heroImageUrl` text,
	`aboutText` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`primaryColor` varchar(50) DEFAULT 'oklch(0.50 0.22 15)',
	`secondaryColor` varchar(50) DEFAULT 'oklch(0.25 0.15 330)',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `models_id` PRIMARY KEY(`id`),
	CONSTRAINT `models_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `modelId` int;