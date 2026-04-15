import pg from 'pg';
const { Client } = pg;
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

async function runSeed() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to DB.');

    const sql = fs.readFileSync('seed_flacons.sql', 'utf8');
    await client.query(sql);
    console.log('Seed SQL executed successfully.');
  } catch (err) {
    console.error('Error executing seed:', err);
  } finally {
    await client.end();
  }
}

runSeed();
