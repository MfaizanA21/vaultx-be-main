import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747478561830 implements MigrationInterface {
    name = 'InitSchema1747478561830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "guests" ("guestId" nvarchar(255) NOT NULL, "guestName" nvarchar(255) NOT NULL, "guestPhoneNumber" nvarchar(255) NOT NULL, "eta" datetime NOT NULL, "visitCompleted" bit NOT NULL CONSTRAINT "DF_12fbb16a70b841475120fc28254" DEFAULT 0, "createdAt" datetime NOT NULL CONSTRAINT "DF_2af8db70ff4b03052f87f57e384" DEFAULT GETDATE(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_c62f2e8b8f191cad7ae0c7c1afa" DEFAULT GETDATE(), "residenceId" uniqueidentifier, "vehicleId" nvarchar(255), CONSTRAINT "PK_a6145db6b105b373e1c1833a3ba" PRIMARY KEY ("guestId"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_cac7e9be74c70ea79eae4ac5c3" ON "guests" ("vehicleId") WHERE "vehicleId" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "guests" ADD CONSTRAINT "FK_426b35f2348dbfdb19a294d3d00" FOREIGN KEY ("residenceId") REFERENCES "residences"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guests" ADD CONSTRAINT "FK_cac7e9be74c70ea79eae4ac5c38" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guests" DROP CONSTRAINT "FK_cac7e9be74c70ea79eae4ac5c38"`);
        await queryRunner.query(`ALTER TABLE "guests" DROP CONSTRAINT "FK_426b35f2348dbfdb19a294d3d00"`);
        await queryRunner.query(`DROP INDEX "REL_cac7e9be74c70ea79eae4ac5c3" ON "guests"`);
        await queryRunner.query(`DROP TABLE "guests"`);
    }

}
