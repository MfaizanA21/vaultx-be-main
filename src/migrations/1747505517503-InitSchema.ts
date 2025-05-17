import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747505517503 implements MigrationInterface {
    name = 'InitSchema1747505517503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "societies" ("society_id" varchar(30) NOT NULL, "name" varchar(100) NOT NULL, "address" varchar(255) NOT NULL, "city" varchar(100), "state" varchar(100), "postalCode" varchar(20), CONSTRAINT "PK_54d022c07968203bbc2a1ccc9d8" PRIMARY KEY ("society_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "societies"`);
    }

}
