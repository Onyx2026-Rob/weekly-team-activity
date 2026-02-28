import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1772236800000 implements MigrationInterface {
  name = 'InitialSchema1772236800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id" SERIAL PRIMARY KEY,
        "full_name" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "weekly_reports" (
        "id" SERIAL PRIMARY KEY,
        "employee_id" INTEGER NOT NULL REFERENCES "employees"("id") ON DELETE CASCADE,
        "week_start_date" DATE NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        UNIQUE("employee_id", "week_start_date")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "activities" (
        "id" SERIAL PRIMARY KEY,
        "weekly_report_id" INTEGER NOT NULL REFERENCES "weekly_reports"("id") ON DELETE CASCADE,
        "title" VARCHAR NOT NULL,
        "description" TEXT,
        "roadblocks" TEXT,
        "percent_complete" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(`DROP TABLE "weekly_reports"`);
    await queryRunner.query(`DROP TABLE "employees"`);
  }
}
