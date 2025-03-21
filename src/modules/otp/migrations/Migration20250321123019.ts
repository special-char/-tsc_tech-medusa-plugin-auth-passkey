import { Migration } from '@mikro-orm/migrations';

export class Migration20250321123019 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "otp" ("id" text not null, "phone" text not null, "otp" text not null, "expires_at" timestamptz not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "otp_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_otp_deleted_at" ON "otp" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "otp" cascade;`);
  }

}
