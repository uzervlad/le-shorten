require('dotenv').config();

const TOKEN = process.env.TOKEN;

const sqlite = require('sqlite3');
const db = new sqlite.Database("db.sqlite");

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

const ALPHABET = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890-_".split('').sort(_ => Math.random() - 0.5);
function generateId() {
  const SIZE = 8;
  let id = "";
  for(let i = 0; i < SIZE; i++)
    id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return id;
}

app.post('/generate', (req, res) => {
  console.log(req.body);
  if(req.body.token != TOKEN)
    return res.status(403).send({ error: "fuck off lmao" });

  let id = generateId();

  db.run("INSERT INTO links (id, url) VALUES (?, ?)", [id, req.body.url], (err) => {
    res.send({ id });
  })
});

app.get('/:id', (req, res) => {
  db.get("SELECT url FROM links WHERE id = ?", [req.params.id], (_, row) => {
    if(!row)
      return res.status(404).send("unknown link");
    res.redirect(row.url);
  });
});

db.run(`CREATE TABLE IF NOT EXISTS links (id text, url text);`);
app.listen(9310); 
