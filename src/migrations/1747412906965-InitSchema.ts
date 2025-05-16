import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747412906965 implements MigrationInterface {
    name = 'InitSchema1747412906965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "residences" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_505bad416f6552d9481a82385bb" DEFAULT NEWSEQUENTIALID(), "addressLine1" nvarchar(255), "addressLine2" nvarchar(255), "city" nvarchar(255), "state" nvarchar(255), "country" nvarchar(255), "postalCode" nvarchar(255), "residenceType" varchar(20) NOT NULL CONSTRAINT "DF_0601e563265b00f0a3198bbceaf" DEFAULT 'owned', "residence" varchar(20) NOT NULL CONSTRAINT "DF_dfeccaef892f13a165030dbb0aa" DEFAULT 'flat', "isPrimary" bit NOT NULL CONSTRAINT "DF_fe14035dcb92f34b4e6aba00bb4" DEFAULT 0, "isApprovedBySociety" bit NOT NULL CONSTRAINT "DF_e15eb313817b9ac28e62025ef21" DEFAULT 0, "approvedBy" nvarchar(255), "approvedAt" datetime, "societyName" nvarchar(255), "buildingName" nvarchar(255), "flatNumber" nvarchar(255), "block" nvarchar(255), "createdAt" datetime NOT NULL CONSTRAINT "DF_a9499bd60ee51e83fd50cfd2e5a" DEFAULT GETDATE(), "updatedAt" datetime NOT NULL CONSTRAINT "DF_25ca70d2691290620c97fbd9480" DEFAULT GETDATE(), "userid" nvarchar(255), CONSTRAINT "PK_505bad416f6552d9481a82385bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" nvarchar(20)`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "DF_ace513fa30d485cfd25c11a9e4a"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "DF_ace513fa30d485cfd25c11a9e4a" DEFAULT 'resident' FOR "role"`);
        await queryRunner.query(`ALTER TABLE "residences" ADD CONSTRAINT "FK_d3685ad68ed3fa2fbb49d136990" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "residences" DROP CONSTRAINT "FK_d3685ad68ed3fa2fbb49d136990"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "DF_ace513fa30d485cfd25c11a9e4a"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "DF_ace513fa30d485cfd25c11a9e4a" DEFAULT 'user' FOR "role"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`DROP TABLE "residences"`);
    }

}
