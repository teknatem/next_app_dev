-- Create d001_bots table
CREATE TABLE IF NOT EXISTS "d001_bots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" integer NOT NULL DEFAULT 0,
	"name" varchar(255) NOT NULL,
	"gender" varchar(50) NOT NULL,
	"position" varchar(255) NOT NULL,
	"hierarchy_level" integer NOT NULL DEFAULT 1,
	"avatar_url" varchar(2048),
	"primary_color" varchar(7) NOT NULL DEFAULT '#3B82F6',
	"role" text NOT NULL,
	"goals" text NOT NULL,
	"rules" text NOT NULL,
	"llm_provider" varchar(100) NOT NULL,
	"llm_model" varchar(100) NOT NULL,
	"is_deleted" boolean NOT NULL DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid REFERENCES "users"("id"),
	"updated_by" uuid REFERENCES "users"("id"),
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid REFERENCES "users"("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "d001_bots_name_idx" ON "d001_bots" ("name");
CREATE INDEX IF NOT EXISTS "d001_bots_position_idx" ON "d001_bots" ("position");
CREATE INDEX IF NOT EXISTS "d001_bots_hierarchy_level_idx" ON "d001_bots" ("hierarchy_level");
CREATE INDEX IF NOT EXISTS "d001_bots_llm_provider_idx" ON "d001_bots" ("llm_provider");
CREATE INDEX IF NOT EXISTS "d001_bots_is_deleted_idx" ON "d001_bots" ("is_deleted");
CREATE INDEX IF NOT EXISTS "d001_bots_created_at_idx" ON "d001_bots" ("created_at");

-- Add comments
COMMENT ON TABLE "d001_bots" IS 'AI боты-сотрудники';
COMMENT ON COLUMN "d001_bots"."id" IS 'Уникальный идентификатор бота';
COMMENT ON COLUMN "d001_bots"."version" IS 'Версия записи для оптимистичной блокировки';
COMMENT ON COLUMN "d001_bots"."name" IS 'Имя бота';
COMMENT ON COLUMN "d001_bots"."gender" IS 'Пол бота (male, female, other)';
COMMENT ON COLUMN "d001_bots"."position" IS 'Должность бота';
COMMENT ON COLUMN "d001_bots"."hierarchy_level" IS 'Уровень иерархии (1-10)';
COMMENT ON COLUMN "d001_bots"."avatar_url" IS 'URL аватара бота';
COMMENT ON COLUMN "d001_bots"."primary_color" IS 'Основной цвет бота в формате #RRGGBB';
COMMENT ON COLUMN "d001_bots"."role" IS 'Роль бота для Prompt';
COMMENT ON COLUMN "d001_bots"."goals" IS 'Цели бота для Prompt';
COMMENT ON COLUMN "d001_bots"."rules" IS 'Правила бота для Prompt';
COMMENT ON COLUMN "d001_bots"."llm_provider" IS 'Провайдер LLM (openai, anthropic, yandex, google, mistral)';
COMMENT ON COLUMN "d001_bots"."llm_model" IS 'Модель LLM (gpt-4, claude-3-opus, etc.)';
COMMENT ON COLUMN "d001_bots"."is_deleted" IS 'Флаг мягкого удаления';
COMMENT ON COLUMN "d001_bots"."created_at" IS 'Дата создания';
COMMENT ON COLUMN "d001_bots"."updated_at" IS 'Дата последнего обновления';
COMMENT ON COLUMN "d001_bots"."created_by" IS 'ID пользователя, создавшего запись';
COMMENT ON COLUMN "d001_bots"."updated_by" IS 'ID пользователя, обновившего запись';
COMMENT ON COLUMN "d001_bots"."deleted_at" IS 'Дата удаления';
COMMENT ON COLUMN "d001_bots"."deleted_by" IS 'ID пользователя, удалившего запись'; 