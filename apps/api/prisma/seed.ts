import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const superadminEmail = 'superadmin@southgo.com';
  const superadminPassword = await bcrypt.hash('admin123', 10);

  // Check if SUPERADMIN already exists
  const existingUser = await prisma.user.findFirst({
    where: { email: superadminEmail }
  });

  if (existingUser) {
    console.log('El Superadmin ya existe.');
    return;
  }

  // Define a default global organization for the SUPERADMIN
  const defaultOrg = await prisma.organization.create({
    data: {
      name: 'SouthGo Global Admin',
      slug: 'southgo-global',
    }
  });

  // Create User
  const user = await prisma.user.create({
    data: {
      email: superadminEmail,
      password: superadminPassword,
      rut: '12345678-9',
      firstName: 'Super',
      lastName: 'Admin',
    }
  });

  // Create Member Association as SUPERADMIN
  await prisma.member.create({
    data: {
      userId: user.id,
      organizationId: defaultOrg.id,
      role: 'SUPERADMIN',
    }
  });

  console.log(`✅ Superadmin creado exitosamente!`);
  console.log(`Email: ${superadminEmail}`);
  console.log(`Password: admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
