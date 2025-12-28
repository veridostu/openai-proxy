const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // fetch için
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Middleware örnekleri
const requireAuthOptional = (req, res, next) => { next(); };
const rateLimit = () => (req, res, next) => { next(); };

// /api/solve endpoint
app.post('/api/solve', requireAuthOptional, rateLimit(), async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error('OpenAI API çağrısında hata:', error);
    res.status(500).json({ error: 'OpenAI API çağrısında hata oluştu' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
