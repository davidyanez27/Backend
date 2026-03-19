import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ===== 1. Seed Permissions =====
  const permissions = [
    { key: 'INVOICE_CREATE', description: 'Create invoices' },
    { key: 'INVOICE_VIEW', description: 'View invoices' },
    { key: 'INVOICE_EDIT', description: 'Edit invoices' },
    { key: 'INVOICE_DELETE', description: 'Delete invoices' },
    { key: 'CLIENT_MANAGE', description: 'Manage clients' },
    { key: 'PRODUCT_CREATE', description: 'Create products' },
    { key: 'PRODUCT_VIEW', description: 'View products' },
    { key: 'PRODUCT_EDIT', description: 'Edit products' },
    { key: 'PRODUCT_DELETE', description: 'Delete products' },
    { key: 'ROLE_CREATE', description: 'Create roles' },
    { key: 'ROLE_ASSIGN', description: 'Assign roles' },
    { key: 'COMPANY_EDIT', description: 'Edit company info' },
    { key: 'MEMBER_INVITE', description: 'Invite members' },
    { key: 'MEMBER_REMOVE', description: 'Remove members' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { description: perm.description },
      create: perm
    });
  }

  console.log(`Seeded ${permissions.length} permissions`);

  // ===== 2. Seed Plans =====
  const plans = [
    { key: 'FREE', name: 'Free', maxUsers: 2 },
    { key: 'STARTER', name: 'Starter', maxUsers: 5 },
    { key: 'PROFESSIONAL', name: 'Professional', maxUsers: 15 },
    { key: 'ENTERPRISE', name: 'Enterprise', maxUsers: 100 },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { key: plan.key },
      update: { name: plan.name, maxUsers: plan.maxUsers },
      create: plan
    });
  }

  console.log(`Seeded ${plans.length} plans`);

  // ===== 3. Seed Features =====
  const features = [
    { key: 'BILLING', name: 'Billing & Invoicing' },
    { key: 'INVENTORY', name: 'Inventory Management' },
    { key: 'PROJECTS', name: 'Project Management' },
    { key: 'CUSTOM_ROLES', name: 'Custom Roles' },
    { key: 'API_ACCESS', name: 'API Access' },
    { key: 'REPORTS', name: 'Advanced Reports' },
  ];

  for (const feature of features) {
    await prisma.feature.upsert({
      where: { key: feature.key },
      update: { name: feature.name },
      create: feature
    });
  }

  console.log(`Seeded ${features.length} features`);

  console.log('Seeding finished!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
