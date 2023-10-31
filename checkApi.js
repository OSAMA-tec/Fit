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
      {role: 'system', content: `give meal plan for Monday`},
      {role: 'user', content: `i wana weight gain,my age is 21 my weight is 54 my height is 5.8.I am male my workout level is begginner and my workout routine is 3days also tell total protein and calories`}
    ],
    max_tokens: 3000
  }
};

axios
  .request(options)
  .then(function (response) {
    const message = response.data.choices[0].message.content;
    const mealPlan = parseMealPlan(message);
    console.log(mealPlan);
  })
  .catch(function (error) {
    console.error(error);
  });

function parseMealPlan(message) {
  const lines = message.split('\n');
  const mealPlan = {};
  let currentMeal = '';

  lines.forEach(line => {
    if (line.endsWith(':')) {
      currentMeal = line.slice(0, -1);
      mealPlan[currentMeal] = [];
    } else if (line.startsWith('*')) {
      mealPlan[currentMeal].push(line.slice(2));
    }
  });

  return mealPlan;
}