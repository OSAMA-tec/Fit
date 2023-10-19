const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.jefit.com/exercises/';

axios(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const exercises = [];

    $('.col-4.col-md-3.my-3.rounded-border').each(function(i, elem) {
      const exercise = {
        name: $(this).find('div.text-center.mt-2 > a').text(),
        image: $(this).find('a > img').attr('src')
      };
      exercises.push(exercise);
    });

    fs.writeFile('exercisesName.json', JSON.stringify(exercises, null, 2), (err) => {
      if (err) throw err;
      console.log('Data successfully written to file');
    });
  })
  .catch(console.error);