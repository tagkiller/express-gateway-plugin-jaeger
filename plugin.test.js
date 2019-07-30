const axios = require('axios').default;
const path = require('path');
const gateway = require('express-gateway');
const express = require('express');

let Application = undefined;
let axiosInstance = undefined;

beforeAll((done) => {
  axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/',
    validateStatus: (status) => status < 400
  });

  const app = express();
  const hello = (req, res) => res.status(200).send('Hello!');

  app.get('/status/:code', (req, res) => res.sendStatus(req.params.code));
  app.get('/src/js/*', hello);
  app.get('/api/v1/*', hello)

  Application = app.listen(8081, done);

});

afterAll((done) => {
  Application.close(done);
})