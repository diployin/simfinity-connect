CREATE TABLE "data_plans_packages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" varchar NOT NULL,
	"slug" text NOT NULL,
	"destination_id" varchar,
	"region_id" varchar,
	"title" text NOT NULL,
	"data_amount" text NOT NULL,
	"data_mb" integer NOT NULL,
	"validity" integer NOT NULL,
	"wholesale_price" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"type" text NOT NULL,
	"operator" text,
	"operator_image" text,
	"coverage" text[],
	"is_unlimited" boolean DEFAULT false NOT NULL,
	"voice_credits" integer DEFAULT 0,
	"sms_credits" integer DEFAULT 0,
	"active" boolean DEFAULT true NOT NULL,
	"data_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "data_plans_packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "topups" DROP CONSTRAINT "topups_package_id_airalo_packages_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "data_plans_packages" ADD CONSTRAINT "data_plans_packages_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_plans_packages" ADD CONSTRAINT "data_plans_packages_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_plans_packages" ADD CONSTRAINT "data_plans_packages_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topups" ADD CONSTRAINT "topups_package_id_unified_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."unified_packages"("id") ON DELETE no action ON UPDATE no action;