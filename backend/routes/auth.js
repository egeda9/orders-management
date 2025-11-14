const express = require('express');
const router = express.Router();

// MOCK AUTH - ALWAYS RETURNS TOKEN
router.post('/token', async (req, res) => {  
  // Just return a fake token - no validation!
  res.json({
    access_token: 'mock-token-12345',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: null
  });
});

router.get('/token', async (req, res) => {
  res.json({
    access_token: 'mock-token-12345',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: null
  });
});

module.exports = router;