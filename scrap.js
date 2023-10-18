// const axios = require('axios');
// const cheerio = require('cheerio');

// async function scrapeExerciseData() {
//   const { data } = await axios.get('https://www.bodybuilding.com/exercises/finder/?level=beginner,intermediate,expert&muscle=chest,forearms,lats,middle-back,lower-back,neck,quadriceps,hamstrings,calves,triceps,traps,shoulders,abdominals,glutes,biceps,adductors,abductors');
//   const $ = cheerio.load(data);
//   const exerciseLinks = [];

//   $('#js-ex-category-body > div.ExCategory-results > div > div.ExResult-cell.ExResult-cell--nameEtc > h3 > a').each((i, link) => {
//     exerciseLinks.push('https://www.bodybuilding.com' + $(link).attr('href'));
//   });

//   console.log(exerciseLinks)

  
  
//   let exercises = [];
  
//   for (let link of exerciseLinks) {
//     const { data } = await axios.get(link);
//     const $ = cheerio.load(data);
    
//     let exercise = {};

//     exercise.name = $('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.flexo-between > div.grid-8.grid-12-s.grid-12-m > h1').text();
//     exercise.about = $('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.flexo-between > div.ExDetail-shortDescription.grid-10').text();
//     exercise.benefits = $('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.flexo-between > div.ExDetail-benefits.grid-8').text();
    
//     exercise.videoLink = $('#js-ex-jwplayer-video > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video');
    
//         console.log(exercise.videoLink)
//     exercise.type = $('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.paywall__video > div.grid-3.grid-12-s.grid-8-m > ul > li:nth-child(1)').text();
//     exercise.mainMuscleWorked = $('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.paywall__video > div.grid-3.grid-12-s.grid-8-m > ul > li:nth-child(2)').text();

//     exercises.push(exercise);
//   }

//   // Save to JSON file
//   const fs = require('fs');
//   fs.writeFileSync('exercises.json', JSON.stringify(exercises));

//   console.log("Scraping done");
// }

// scrapeExerciseData().catch(console.error);
const puppeteer = require('puppeteer');

async function scrapeExerciseData() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto('https://www.bodybuilding.com/combined-signin?referrer=https%3A%2F%2Fshop.bodybuilding.com%2F&country=PK', { timeout: 60000 });

// Type into the email and password fields
await page.type('input[name="username"]', 'hashmiosama555@gmail.com');
await page.type('input[name="password"]', 'Hashmi1@body');
  // Click the login button
  await Promise.all([
    page.waitForNavigation(),
    page.click('#root > div > div > div.combined-sign-in--signin-signup > div.combined-sign-in--signin > div.combined-sign-in--alternate-signin > div > button'),
  ]);

  // Navigate to the exercise finder page
  await page.goto('https://www.bodybuilding.com/exercises/finder/?level=beginner,intermediate,expert&muscle=chest,forearms,lats,middle-back,lower-back,neck,quadriceps,hamstrings,calves,triceps,traps,shoulders,abdominals,glutes,biceps,adductors,abductors', { timeout: 60000 });

  const exerciseLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#js-ex-category-body > div.ExCategory-results > div > div.ExResult-cell.ExResult-cell--nameEtc > h3 > a'), link => 'https://www.bodybuilding.com' + link.getAttribute('href'))
  );

  console.log(exerciseLinks)

  let exercises = [];

  for (let link of exerciseLinks) {
    await page.goto(link, { timeout: 60000 });

    let exercise = await page.evaluate(() => {
      let name = document.querySelector('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.flexo-between > div.grid-8.grid-12-s.grid-12-m > h1').innerText;
      let about = document.querySelector('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.flexo-between > div.ExDetail-shortDescription.grid-10').innerText;
      let benefits = document.querySelector('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.flexo-between > div.ExDetail-benefits.grid-8').innerText;
      let videoLink = document.querySelector('#js-ex-jwplayer-video > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video').getAttribute('src');
      let type = document.querySelector('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.paywall__video > div.grid-3.grid-12-s.grid-8-m > ul > li:nth-child(1)').innerText;
      let mainMuscleWorked = document.querySelector('#js-ex-content > div > section.ExDetail-section.ExDetail-meta.flexo-container.flexo-start.paywall__video > div.grid-3.grid-12-s.grid-8-m > ul > li:nth-child(2)').innerText;

      return {
        name,
        about,
        benefits,
        videoLink,
        type,
        mainMuscleWorked
      };
    });

    exercises.push(exercise);
  }

  // Save to JSON file
  const fs = require('fs');
  fs.writeFileSync('exercises.json', JSON.stringify(exercises));

  console.log("Scraping done");

  await browser.close();
}

scrapeExerciseData().catch(console.error);