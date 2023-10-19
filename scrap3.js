const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const baseUrl = 'https://www.jefit.com/exercises';

axios.defaults.timeout = 300000; 

async function scrapeExerciseDetails(url) {
  const { data } = await axios(url);
  const $ = cheerio.load(data);
  const gifLink = $('.col-sm-12 > a').attr('href');
  const exerciseName = $('#page > div > div:nth-child(5) > div.container-fluid.row > div > div.col-xl-9 > div:nth-child(4) > div.col-xl-8.mt-2 > div > div:nth-child(1) > div > div > p').text();
  const instructions = $('#page > div > div:nth-child(5) > div.container-fluid.row > div > div.col-xl-9 > p').html().split('<br>\n<br>\n').map(s => s.trim());
  return { gifLink, exerciseName, instructions };
}

async function scrapePage(pageNumber) {
  const { data } = await axios(`${baseUrl}/bodypart.php?id=11&exercises=All&All=0&Bands=0&Bench=0&Dumbbell=0&EZBar=0&Kettlebell=0&MachineStrength=0&MachineCardio=0&Barbell=0&BodyOnly=0&ExerciseBall=0&FoamRoll=0&PullBar=0&WeightPlate=0&Other=0&Strength=0&Stretching=0&Powerlifting=0&OlympicWeightLifting=0&Beginner=0&Intermediate=0&Expert=0&page=${pageNumber}`);
  const $ = cheerio.load(data);
  const exerciseLinks = [];
  $('.col-6.col-sm-4.p-2 > a').each((i, link) => {
    let href = $(link).attr('href');
    if (!href.startsWith('/')) {
      href = '/' + href;
    }
    exerciseLinks.push(baseUrl + href);
  });
  return Promise.all(exerciseLinks.map(scrapeExerciseDetails));
}

async function scrapeAllPages() {
  const allExercises = [];
  for (let i = 1; i <= 20; i++) {
    const exercises = await scrapePage(i);
    allExercises.push(...exercises);
  }
  fs.writeFile('exerciseDetails.json', JSON.stringify(allExercises, null, 2), (err) => {
    if (err) throw err;
    console.log('Data successfully written to file');
  });
}

scrapeAllPages().catch(console.error);
