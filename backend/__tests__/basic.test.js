const request = require('supertest');
const express = require('express');

// Mock simple express app for basic testing configuration
const app = express();
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

describe('Basic API Configuration Test', () => {
  it('should run and return a correct success message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Expense Tracker API is running...');
  });
});
