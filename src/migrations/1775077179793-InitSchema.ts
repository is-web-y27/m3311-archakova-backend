import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1775077179793 implements MigrationInterface {
  name = 'InitSchema1775077179793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "label_stats" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "revenue" numeric(15,2) NOT NULL, "market_share" numeric(5,2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "label_id" integer NOT NULL, CONSTRAINT "PK_da4d078b2273c7c95a4b5a52c63" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "music_labels" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "country" character varying(100), "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0a725e21636db382c45b8ba4f32" UNIQUE ("name"), CONSTRAINT "PK_b8c6dc01a0f69fd7c4484767253" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artists" ("id" SERIAL NOT NULL, "stageName" character varying(150) NOT NULL, "genre" character varying(100), "country" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "label_id" integer, CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."articles_type_enum" AS ENUM('news', 'review', 'concert_announcement')`,
    );
    await queryRunner.query(
      `CREATE TABLE "articles" ("id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "slug" character varying(200) NOT NULL, "type" "public"."articles_type_enum" NOT NULL, "summary" text, "content" text NOT NULL, "published_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "author_id" integer NOT NULL, "artist_id" integer, CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "feedbacks" ("id" SERIAL NOT NULL, "message" text NOT NULL, "rating" integer NOT NULL DEFAULT '5', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_79affc530fdd838a9f1e0cc30be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "role" character varying(30) NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "label_stats" ADD CONSTRAINT "FK_182270e8168f614f814a0eb2dc6" FOREIGN KEY ("label_id") REFERENCES "music_labels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "artists" ADD CONSTRAINT "FK_d34e386ee0cdc689480e39a2098" FOREIGN KEY ("label_id") REFERENCES "music_labels"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD CONSTRAINT "FK_6515da4dff8db423ce4eb841490" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD CONSTRAINT "FK_a335fb6f1d7aefc76d2f390908d" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedbacks" ADD CONSTRAINT "FK_4334f6be2d7d841a9d5205a100e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedbacks" DROP CONSTRAINT "FK_4334f6be2d7d841a9d5205a100e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" DROP CONSTRAINT "FK_a335fb6f1d7aefc76d2f390908d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" DROP CONSTRAINT "FK_6515da4dff8db423ce4eb841490"`,
    );
    await queryRunner.query(
      `ALTER TABLE "artists" DROP CONSTRAINT "FK_d34e386ee0cdc689480e39a2098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "label_stats" DROP CONSTRAINT "FK_182270e8168f614f814a0eb2dc6"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "feedbacks"`);
    await queryRunner.query(`DROP TABLE "articles"`);
    await queryRunner.query(`DROP TYPE "public"."articles_type_enum"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "music_labels"`);
    await queryRunner.query(`DROP TABLE "label_stats"`);
  }
}
