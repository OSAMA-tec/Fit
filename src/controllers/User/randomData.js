
const axios = require('axios');
require('dotenv').config();

const generateGymInfo = async (req, res) => {
  try {
    const options = {
      method: 'POST',
      url: 'https://api.perplexity.ai/chat/completions',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: process.env.PER_AI_KEY
      },
      data: {
        model: 'llama-2-70b-chat',
        messages: [
          {role: 'system', content: 'generate a gym quote, a meal plan with one meal, an random exercise, and a food name'}
        ],
        max_tokens: 3000
      }
    };

    const response = await axios.request(options);
    const gymInfo = response.data.choices[0].message.content;

    res.status(200).json({ gymInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports={generateGymInfo}