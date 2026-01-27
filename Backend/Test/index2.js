import pkg from "pg";
const { Client } = pkg;

const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

db.connect();

db.query("SELECT * FROM customers", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    console.log(res.rows);
  }

  db.end();
});
