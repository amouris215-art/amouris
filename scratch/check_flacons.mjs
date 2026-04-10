import pg from 'pg';
const { Client } = pg;
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  console.error('Missing DIRECT_URL in .env.local');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function check() {
  await client.connect();
  try {
    const productsRes = await client.query("SELECT id, name_fr, status, product_type FROM products WHERE product_type = 'flacon'");
    console.log('Flacons Products:', productsRes.rows);

    const variantsRes = await client.query(`
      SELECT fv.id, fv.product_id, fv.size_ml, fv.color_name, fv.price, fv.stock_units
      FROM flacon_variants fv
      JOIN products p ON p.id = fv.product_id
      WHERE p.product_type = 'flacon'
    `);
    console.log('Flacon Variants:', variantsRes.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

check();
