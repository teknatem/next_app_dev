CREATE TABLE "llm_chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"model" varchar(50),
	"provider" varchar(20) DEFAULT 'openai',
	"prompt_tokens" integer,
	"completion_tokens" integer,
	"total_tokens" integer,
	"cost" numeric(10, 6),
	"finish_reason" varchar(50),
	"response_time" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "llm_chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"message_count" integer DEFAULT 0,
	"total_tokens" integer DEFAULT 0,
	"total_cost" numeric(10, 6) DEFAULT '0',
	"default_model" varchar(50) DEFAULT 'gpt-3.5-turbo',
	"system_prompt" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
