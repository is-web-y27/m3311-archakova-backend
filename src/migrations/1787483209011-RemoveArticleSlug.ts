import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveArticleSlug1787483209011 implements MigrationInterface {
    name = 'RemoveArticleSlug1787483209011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "slug"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "slug" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug")`);
    }

}
