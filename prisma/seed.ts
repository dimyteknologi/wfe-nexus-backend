import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();

  await prisma.permission.createMany({
    data: [
      { permissionCode: 'read:dashboard', permissionName: 'Dashboard' },
      { permissionCode: 'manage:roles',  permissionName: 'Manage Roles' },
      { permissionCode: 'manage:user',  permissionName: 'Manage Users' },
      { permissionCode: 'manage:kota',  permissionName: 'Manage Kota' },
      { permissionCode: 'manage:permissions',  permissionName: 'Manage Permissions' },
      { permissionCode: 'manage:institusi',  permissionName: 'Manage Institusi' },
      { permissionCode: 'manage:import',  permissionName: 'Manage Import' },
      { permissionCode: 'manage:data',  permissionName: 'Manage Data' },
      { permissionCode: 'read:data',  permissionName: 'Read Data' },
    ],
    skipDuplicates: true,
  });

  // Create Data Types
  await prisma.dataType.createMany({
    data: [
      { name: 'histories' },
      { name: 'simulations' },
    ],
    skipDuplicates: true,
  });

  // Create Admin role first
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      updatedBy: 'system',
    },
  });

  // Get ALL permissions for Admin role
  const allPerms = await prisma.permission.findMany();

  // Delete existing role permissions for Admin to avoid duplicates
  await prisma.rolePermission.deleteMany({
    where: { roleId: adminRole.id },
  });

  // Assign all permissions to Admin role
  for (const perm of allPerms) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Debug: check available models
  console.log('Available prisma models:', Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_')));
  
  // Check if scenario model exists
  console.log('Has scenario model:', 'scenario' in prisma);
  
  const defaultCity = await prisma.cities.upsert({
    where: { name: 'Kantor Pusat' },
    update: {},
    create: {
      name: 'Kantor Pusat',
    },
  });

  const defaultInstitution = await prisma.institution.upsert({
    where: { name: 'Institusi Default' },
    update: {},
    create: {
      name: 'Institusi Default',
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
      cities: { connect: { id: defaultCity.id } },
      institution: { connect: { id: defaultInstitution.id } },
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