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
  const SIZE = 10;
  let id = "";
  for(let i = 0; i < SIZE; i++)
    id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return id;
}

app.post('/generate', (req, res) => {
  if(req.body.token != TOKEN)
    return res.status(403).send({ error: "fuck off lmao" });

  let id = req.body.id || generateId();

  db.run("INSERT INTO links (id, url) VALUES (?, ?)", [id, req.body.url], (err) => {
    if(err)
      res.status(500).send({ error: "Couldn't generate link" });
    else
      res.send({ id });
  })
});

app.get('/:id', (req, res) => {
  db.get("SELECT url FROM links WHERE id = ?", [req.params.id], (_, row) => {
    if(!row)
      return res.status(404).send("unknown link");
    res.redirect(row.url);
    db.run("UPDATE links SET uses = uses + 1 WHERE id = ?", [req.params.id]);
  });
});

db.run(`CREATE TABLE IF NOT EXISTS links (id text PRIMARY KEY, url text, uses int DEFAULT 0);`);
app.listen(9310); 
