CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`completed` integer DEFAULT false,
	`due_date` text DEFAULT (CURRENT_DATE)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tasks_slug_unique` ON `tasks` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `tasks_description_unique` ON `tasks` (`description`);--> statement-breakpoint
DROP TABLE `users`;