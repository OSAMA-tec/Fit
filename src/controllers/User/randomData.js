
// const axios = require('axios');
// require('dotenv').config();

// const generateGymInfo = async (req, res) => {
//   try {
//     const options = {
//       method: 'POST',
//       url: 'https://api.perplexity.ai/chat/completions',
//       headers: {
//         accept: 'application/json',
//         'content-type': 'application/json',
//         authorization: process.env.PER_AI_KEY
//       },
//       data: {
//         model: 'llama-2-70b-chat',
//         messages: [
//           {role: 'system', content: `generate random things`},
//           {role: 'user', content: 'generate a random gym quote, a meal plan with random one meal, an random exercise, and a random food name'}
//         ],
//         max_tokens: 3000
//       }
//     };

//     const response = await axios.request(options);
//     const gymInfoString = response.data.choices[0].message.content;

//    const parts = gymInfoString.split('\n\n');

//    const gymInfo = {
//      gymQuote: parts[1],
//      mealPlan: {
//        breakfast: parts[3]
//      },
//      exercise: parts[4],
//      foodName: parts[5]
//    };

//    res.status(200).json({ gymInfo });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// module.exports={generateGymInfo}

const Quote = require('../../models/randomQuote');
const Meal = require('../../models/randomMeal');

const generateGymInfo = async (req, res) => {
  try {
    const options = ['quote', 'meal'];
    const selectedOption = options[Math.floor(Math.random() * options.length)];

    let gymInfo;

    switch (selectedOption) {
      case 'quote':
        const quote = await Quote.findOneAndUpdate({ used: false }, { used: true });
        const quotesCount = await Quote.countDocuments({ used: true });
        const totalQuotes = await Quote.countDocuments();
        if (quotesCount === totalQuotes) {
          await Quote.updateMany({}, { used: false });
        }
        gymInfo = { type: 'quote', content: quote ? quote.quote : 'No quote available' };
        break;

      case 'meal':
        const meal = await Meal.findOneAndUpdate({ used: false }, { used: true });
        const mealsCount = await Meal.countDocuments({ used: true });
        const totalMeals = await Meal.countDocuments();
        if (mealsCount === totalMeals) {
          await Meal.updateMany({}, { used: false });
        }
        gymInfo = { type: 'meal', content: meal ? meal.meal : 'No meal available' };
        break;

      default:
        break;
    }

    res.status(200).json({ gymInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports={generateGymInfo}
