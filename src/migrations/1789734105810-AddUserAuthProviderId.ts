import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAuthProviderId1789734105810 implements MigrationInterface {
    name = 'AddUserAuthProviderId1789734105810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "auth_provider_id" character varying(128)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_1c844df74e011d4b0694ad5b2cc" UNIQUE ("auth_provider_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_1c844df74e011d4b0694ad5b2cc"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "auth_provider_id"`);
    }

}
