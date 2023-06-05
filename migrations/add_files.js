const sqlite = require('sqlite3');
const db = new sqlite.Database("db.sqlite");

const migration = `
  ALTER TABLE links
  ADD is_file int DEFAULT 0;
`;

db.run(migration);