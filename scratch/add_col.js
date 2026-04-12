const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DIRECT_URL || 'postgresql://postgres.hbdrszzyuozgcxofpfun:Aa123456789..123.@aws-0-eu-west-1.pooler.supabase.com:5432/postgres'
});

async function main() {
  try {
    await client.connect();
    console.log("Connected to DB");

    console.log("Reloading PostgREST schema...");
    await client.query("NOTIFY pgrst, 'reload schema';");
    
    console.log("Success.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

main();
