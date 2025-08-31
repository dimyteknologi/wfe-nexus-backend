import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();

  await prisma.permission.createMany({
    data: [
      { permissionCode: 'read:dashboard', permissionName: 'Dashboard' },
      { permissionCode: 'manage:roles',  permissionName: 'Manage Roles' },
      { permissionCode: 'manage:users',  permissionName: 'Manage Users' },
      { permissionCode: 'manage:kota',  permissionName: 'Manage Kota' },
    ],
    skipDuplicates: true,
  });

  const basePerms = await prisma.permission.findMany({
    where: {
      permissionCode: {
        in: ['read:dashboard', 'manage:roles', 'manage:users'],
      },
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      updatedBy: 'system',
      permissions: {
        create: basePerms.map((perm) => ({
          permission: { connect: { id: perm.id } },
        })),
      },
    },
    include: { permissions: true },
  });

  const defaultKota = await prisma.kota.upsert({
    where: { nama: 'Kantor Pusat' },
    update: {},
    create: {
      nama: 'Kantor Pusat',
    },
  });

  const defaultInstitusi = await prisma.institusi.upsert({
    where: { nama: 'Institusi Default' },
    update: {},
    create: {
      nama: 'Institusi Default',
      updatedBy: 'system',
    },
  });

  const passwordHash = await bcrypt.hash('masteradmin@123', 10);
  await prisma.user.upsert({
    where: { email: 'master@admin.com' },
    update: {},
    create: {
      email: 'master@admin.com',
      name: 'Master Admin',
      password: passwordHash,
      role: { connect: { id: adminRole.id } },
      kota: { connect: { id: defaultKota.id } },
      institusi: { connect: { id: defaultInstitusi.id } },
      updatedBy: 'system',
    },
  });

  console.log('✅ Seed complete');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  process.exit(1);
});