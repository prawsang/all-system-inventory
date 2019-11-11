const { Pool } = require('pg');
// your credentials
DATABASE_URL = 'postgres://postgres:testdb@127.0.0.1:5432/all-system';

const pool = new Pool({
  connectionString: DATABASE_URL
});

module.exports = pool