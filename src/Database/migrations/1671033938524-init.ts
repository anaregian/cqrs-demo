import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1671033938524 implements MigrationInterface {
  name = 'init1671033938524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "part" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "quantityOnHand" integer NOT NULL, CONSTRAINT "UQ_a5362eb271179ceec5304917d0d" UNIQUE ("name"), CONSTRAINT "PK_58888debdf048d2dfe459aa59da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_part" ("id" SERIAL NOT NULL, "orderId" integer, "partId" integer, CONSTRAINT "PK_5e4fb144df7a1c24c48d355b458" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2022-12-14T16:05:41.149Z"', "customerId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb" UNIQUE ("email"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_part" ADD CONSTRAINT "FK_1aa5632d84f0db4effbda0c5fdb" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_part" ADD CONSTRAINT "FK_98905a09bcdd678c69e1cd9a81b" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`);
    await queryRunner.query(`ALTER TABLE "order_part" DROP CONSTRAINT "FK_98905a09bcdd678c69e1cd9a81b"`);
    await queryRunner.query(`ALTER TABLE "order_part" DROP CONSTRAINT "FK_1aa5632d84f0db4effbda0c5fdb"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "order_part"`);
    await queryRunner.query(`DROP TABLE "part"`);
  }
}
