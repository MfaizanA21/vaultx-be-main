import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747505810740 implements MigrationInterface {
    name = 'InitSchema1747505810740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "residences" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "residences" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "residences" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "residences" DROP COLUMN "postalCode"`);
        await queryRunner.query(`ALTER TABLE "residences" DROP COLUMN "societyName"`);
        await queryRunner.query(`ALTER TABLE "residences" DROP COLUMN "buildingName"`);
        await queryRunner.query(`ALTER TABLE "residences" ADD "societyid" varchar(30)`);
        await queryRunner.query(`ALTER TABLE "residences" ADD CONSTRAINT "FK_6094a154af7f95930b034b93e6a" FOREIGN KEY ("societyid") REFERENCES "societies"("society_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "residences" DROP CONSTRAINT "FK_6094a154af7f95930b034b93e6a"`);
        await queryRunner.query(`ALTER TABLE "residences" DROP COLUMN "societyid"`);
        await queryRunner.query(`ALTER TABLE "residences" ADD "buildingName" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "residences" ADD "societyName" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "residences" ADD "postalCode" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "residences" ADD "country" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "residences" ADD "state" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "residences" ADD "city" nvarchar(255)`);
    }

}
