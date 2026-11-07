import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveOldArticleCoverUrl1789510604547 implements MigrationInterface {
    name = 'RemoveOldArticleCoverUrl1789510604547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "cover_url"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "cover_url" character varying(500)`);
    }

}
