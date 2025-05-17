import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747421488866 implements MigrationInterface {
    name = 'InitSchema1747421488866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicles" ("vehicleId" nvarchar(255) NOT NULL, "vehicleType" nvarchar(255) NOT NULL, "vehicleModel" nvarchar(255) NOT NULL, "vehicleName" nvarchar(255) NOT NULL, "vehicleLicensePlateNumber" nvarchar(255) NOT NULL, "vehicleRFIDTagId" nvarchar(255) NOT NULL, "isGuest" bit NOT NULL CONSTRAINT "DF_099b664fe29afb6393394083142" DEFAULT 0, "createdAt" datetime NOT NULL CONSTRAINT "DF_d5f17172ea79dbece9fa7c3f0db" DEFAULT GETDATE(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_2682b7297b4393fc872fcf04600" DEFAULT GETDATE(), "residentid" uniqueidentifier, CONSTRAINT "PK_cc2bbdf57cb1356341edef83d44" PRIMARY KEY ("vehicleId"))`);
        await queryRunner.query(`ALTER TABLE "vehicles" ADD CONSTRAINT "FK_768cdb766dfb621e783856f55ee" FOREIGN KEY ("residentid") REFERENCES "residences"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicles" DROP CONSTRAINT "FK_768cdb766dfb621e783856f55ee"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
    }

}
