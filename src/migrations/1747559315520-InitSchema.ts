import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747559315520 implements MigrationInterface {
    name = 'InitSchema1747559315520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employees" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_b9535a98350d5b26e7eb0c26af4" DEFAULT NEWSEQUENTIALID(), "internalRole" varchar(100) NOT NULL, "department" varchar(100), "shift" varchar(50), "joiningDate" date, "createdAt" datetime NOT NULL CONSTRAINT "DF_07fe1f0c68504328fa5ef0b98d0" DEFAULT GETDATE(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_a7715c7539ac6f35a203c19c993" DEFAULT GETDATE(), "userid" nvarchar(255), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_19fc098e857550a576b6b16112" ON "employees" ("userid") WHERE "userid" IS NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employees" ADD CONSTRAINT "FK_19fc098e857550a576b6b161125" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employees" DROP CONSTRAINT "FK_19fc098e857550a576b6b161125"`);
        await queryRunner.query(`DROP INDEX "REL_19fc098e857550a576b6b16112" ON "employees"`);
        await queryRunner.query(`DROP TABLE "employees"`);
    }

}
