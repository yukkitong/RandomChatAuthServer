const express = require('express');
const bodyPaser = require('body-parser');
const axios = require('axios');
const chalk = require('chalk');

const app = express();

app.use(bodyPaser.urlencoded({ extended: true }));
app.use(bodyPaser.json());

const COUCHDB_ADMIN = 'jason:sung1761';
const USER_PREFIX = 'org.couchdb.user'

app.post('/signup', (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;
  
  if (!email) {
    res.status(400).json({
      error: 'email required.'
    }); // bad request
    return;
  }

  if (!password) {
    res.status(400).json({
      error: 'password required.'
    });
    return;
  }
  
  axios.put(
    `http://${COUCHDB_ADMIN}@localhost:5984/_users/${USER_PREFIX}:${email}`, 
    {
      type: 'user',
      roles: ['member'],
      name: email,
      password: password
    })
    .then((res) => {
      res.sendStatus(200); // ok
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500); // internal server error
    });
});

app.use((req, res) => {
  res.sendStatus(403);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server starts on port, ${chalk.cyan(PORT)}`);
})