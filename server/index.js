const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const port = 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

const TWITTER_API_URL = 'https://api.twitter.com/2';

app.post('/token', async (req, res) => {
  console.log(`${TWITTER_API_URL}/oauth2/token`, req.body);
  const query = new URLSearchParams(req.body);
  const token = await fetch(`${TWITTER_API_URL}/oauth2/token`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: query.toString(),
  }).then((response) => {
    console.log(response.status, response.body);
    return response.json();
  });
  res.json(token);
});

app.get('/user/:username', async (req, res) => {
  console.log(req.headers.authorization, req.params.username)
  const response = await fetch(
    `${TWITTER_API_URL}/users/me`,
    {
      method: 'get',
      headers: {
        Accept: 'application/json',
        Authorization: req.headers.authorization,
      },
    }
  ).then((response) => {
    return response.json();
  });
  console.log(response);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
