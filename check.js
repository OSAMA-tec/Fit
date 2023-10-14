const axios = require('axios');
const fs = require('fs');

const bodyParts = [
    "back",
    "cardio",
    "chest",
    "lower arms",
    "lower legs",
    "neck",
    "shoulders",
    "upper arms",
    "upper legs",
    "waist"
];

let allExercises = {};

async function fetchData(bodyPart) {
  const options = {
    method: 'GET',
    url: `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
    params: {limit: '100'},
    headers: {
      'X-RapidAPI-Key':'2ac4b2f3f0msh95e8dfffddb907fp17f92ajsn6dc028f9a477',
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    allExercises[bodyPart] = response.data;
    console.log(`Data fetched for ${bodyPart}`);
  } catch (error) {
    console.error(error);
  }
}

async function fetchAllData() {
  for (let i = 0; i < bodyParts.length; i++) {
    await fetchData(bodyParts[i]);
    // Wait for 1 second before making the next request
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  fs.writeFileSync('allExercises.json', JSON.stringify(allExercises, null, 2));
  console.log('Data saved to allExercises.json');
}

fetchAllData();