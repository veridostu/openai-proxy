const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // fetch için
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors()); // tüm domainlere izin verir
// Middleware örnekleri
const requireAuthOptional = (req, res, next) => { next(); };
const rateLimit = () => (req, res, next) => { next(); };

// /api/solve endpoint
app.post('/api/solve/*', requireAuthOptional, rateLimit(), async (req, res) => {
  try {
    const openaiPath = req.path.replace('/api/solve', ''); // /chat/completions
    const r = await fetch('https://api.openai.com/v1' + openaiPath, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const text = await r.text();
    res.status(r.status).send(text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'OpenAI API call failed' });
  }
});
