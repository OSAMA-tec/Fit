const axios = require('axios');
require('dotenv').config();
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
      {role: 'system', content: 'give meal plan for 7days'},
      {role: 'user', content: 'i wana weight gain,my age is 22 my weight is 55 and height is 5,8'}
    ],
    max_tokens: 3000
  }
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data.choices);
  })
  .catch(function (error) {
    console.error(error);
  });