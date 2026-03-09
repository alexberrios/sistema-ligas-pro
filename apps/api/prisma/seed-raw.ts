import * as bcrypt from 'bcrypt';
import { Client } from 'pg';
import "dotenv/config";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
     console.warn('DATABASE_URL is not set!');
  }
  const client = new Client({ connectionString });
  
  await client.connect();

  try {
    const superadminEmail = 'superadmin@southgo.com';
    const superadminPassword = await bcrypt.hash('admin123', 10);

    // Check if SUPERADMIN exists
    const resUser = await client.query('SELECT * FROM "User" WHERE email = $1', [superadminEmail]);
    
    if (resUser.rows.length > 0) {
      console.log('El Superadmin ya existe.');
      return;
    }

    // Insert Organization
    const resOrg = await client.query(
      'INSERT INTO "Organization" (name, slug) VALUES ($1, $2) RETURNING id',
      ['SouthGo Global Admin', 'southgo-global']
    );
    const orgId = resOrg.rows[0].id;

    // Insert User
    const resNewUser = await client.query(
      'INSERT INTO "User" (email, password, rut, "firstName", "lastName") VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [superadminEmail, superadminPassword, '12345678-9', 'Super', 'Admin']
    );
    const userId = resNewUser.rows[0].id;

    // Insert Member
    await client.query(
      'INSERT INTO "Member" ("userId", "organizationId", role) VALUES ($1, $2, $3)',
      [userId, orgId, 'SUPERADMIN']
    );

    console.log(`✅ Superadmin creado exitosamente!`);
    console.log(`Email: ${superadminEmail}`);
    console.log(`Password: admin123`);
  } catch (error) {
    console.error('Error insertando data:', error);
  } finally {
    await client.end();
  }
}

main();
