const app = require('../src/server')
const supertest = require('supertest')
const request = supertest(app)

it('/ endpoint', async home =>{
  var res = await request.get('/');
  expect(res.status).toBe(200);
  expect(res.type).toBe("text/html")
  home();
})


it('/count endpoint', async count => {
  // Sends GET Request to /test endpoint
  var res = await request.get('/api/count?id=6VjYRSvQiPRMiWxE');
  expect(res.status).toBe(200);
  expect(res.body).toBe(1);
  count();
})

it('/api/status endpoint', async status =>{
  var res = await request.get('/api/status');
  expect(res.body.uptime).toBeGreaterThan(0);
  expect(res.status).toBe(200);
  status()
})