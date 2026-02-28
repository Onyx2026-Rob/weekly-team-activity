import { AppDataSource } from '../data-source';

async function runSeed() {
  await AppDataSource.initialize();
  const employeeRepository = AppDataSource.getRepository('employees');

  const employees = [
    { full_name: 'Gino Motyka', email: 'gino.motyka@company.com' },
    { full_name: 'Todd Allen', email: 'todd.allen@company.com' },
    { full_name: 'Nikhal Bele', email: 'nikhal.bele@company.com' },
  ];

  for (const emp of employees) {
    const existing = await employeeRepository.findOne({
      where: { email: emp.email },
    });
    if (!existing) {
      await employeeRepository.query(
        `INSERT INTO employees (full_name, email) VALUES ($1, $2)`,
        [emp.full_name, emp.email],
      );
      console.log(`Seeded employee: ${emp.full_name}`);
    } else {
      console.log(`Employee already exists: ${emp.full_name}`);
    }
  }

  await AppDataSource.destroy();
  console.log('Seed complete.');
}

runSeed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
