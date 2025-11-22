CREATE TABLE `orderBumps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`priceInCents` int NOT NULL,
	`originalPriceInCents` int,
	`imageUrl` text,
	`modelId` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orderBumps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `models` ADD `instagramUrl` varchar(255);