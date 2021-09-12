const app = require('../dist/server')
const supertest = require('supertest')
const request = supertest(app)

it('/ endpoint', async home =>{
  var res = await request.get('/');
  expect(res.status).toBe(200);
  expect(res.type).toBe("text/html")
  home();
});