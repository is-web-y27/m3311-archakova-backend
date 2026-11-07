import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArticleCoverUrl1789510251964 implements MigrationInterface {
    name = 'AddArticleCoverUrl1789510251964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "cover_url"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "cover_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "cover_url"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "cover_url" character varying(500)`);
    }

}
