CREATE TABLE `contact_submissions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(80) NOT NULL,
	`company` varchar(120) NOT NULL,
	`email` varchar(254) NOT NULL,
	`country` varchar(60) NOT NULL,
	`phone` varchar(24),
	`service` varchar(80) NOT NULL,
	`description` text NOT NULL,
	`ip` varchar(45),
	`user_agent` varchar(255),
	`email_status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`email_error` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`email_sent_at` timestamp,
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);

CREATE TABLE `lead_submissions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(80) NOT NULL,
	`kind` varchar(60) NOT NULL,
	`scale` varchar(60) NOT NULL,
	`email` varchar(254) NOT NULL,
	`ip` varchar(45),
	`user_agent` varchar(255),
	`email_status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`email_error` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`email_sent_at` timestamp,
	CONSTRAINT `lead_submissions_id` PRIMARY KEY(`id`)
);

CREATE INDEX `idx_contact_email_created` ON `contact_submissions` (`email`,`created_at`);
CREATE INDEX `idx_lead_email_created` ON `lead_submissions` (`email`,`created_at`);