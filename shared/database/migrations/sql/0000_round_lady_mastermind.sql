CREATE TABLE "production_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"article" text,
	"type" text DEFAULT 'material' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "production_items_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "production_items_consumption" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"item_name" text NOT NULL,
	"item_code" text,
	"item_article" text,
	"receipt_doc" text NOT NULL,
	"receipt_date" date NOT NULL,
	"production_date" date NOT NULL,
	"quantity" numeric(15, 3) NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "production_items_consumption" ADD CONSTRAINT "production_items_consumption_item_id_production_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."production_items"("id") ON DELETE no action ON UPDATE no action;