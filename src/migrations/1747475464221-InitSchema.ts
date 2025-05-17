import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747475464221 implements MigrationInterface {
    name = 'InitSchema1747475464221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" ADD "vehicleColor" nvarchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" DROP COLUMN "vehicleColor"`);
    }

}
