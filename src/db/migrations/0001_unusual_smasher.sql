CREATE TABLE `games` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`board` text DEFAULT '{}' NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`time_remaining` integer DEFAULT 800 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DROP TABLE `highscores`;