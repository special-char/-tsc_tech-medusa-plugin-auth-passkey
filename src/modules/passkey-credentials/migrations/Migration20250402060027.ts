import { Migration } from '@mikro-orm/migrations';

export class Migration20250402060027 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "passkey-credentials" ("id" text not null, "publicKey" text not null, "counter" text not null, "transports" text[] null, "passKeyName" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "passkey-credentials_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_passkey-credentials_deleted_at" ON "passkey-credentials" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "passkey-credentials" cascade;`);
  }

}
