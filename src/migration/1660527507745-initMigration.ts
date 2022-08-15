import { MigrationInterface, QueryRunner } from 'typeorm';

export class initMigration1660527507745 implements MigrationInterface {
  name = 'initMigration1660527507745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "currency" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("account_id" SERIAL NOT NULL, "balance" numeric(10,2) NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "currency" integer, CONSTRAINT "PK_ea08b54a9d7322975ffc57fc612" PRIMARY KEY ("account_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "currency_course" ("id" SERIAL NOT NULL, "course" numeric(10,2) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "from_id" integer, "to_id" integer, CONSTRAINT "PK_483618a163385af50848311a2b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_1bd607c3a38dcdfb1963da0bda2" FOREIGN KEY ("currency") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency_course" ADD CONSTRAINT "FK_d56d3b82590a379632ef8322cae" FOREIGN KEY ("from_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency_course" ADD CONSTRAINT "FK_ff27fcda7cb80dc77954edb275a" FOREIGN KEY ("to_id") REFERENCES "currency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "currency_course" DROP CONSTRAINT "FK_ff27fcda7cb80dc77954edb275a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency_course" DROP CONSTRAINT "FK_d56d3b82590a379632ef8322cae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_1bd607c3a38dcdfb1963da0bda2"`,
    );
    await queryRunner.query(`DROP TABLE "currency_course"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TABLE "currency"`);
  }
}
