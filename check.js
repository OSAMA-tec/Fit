const fs = require('fs');

fs.readFile('Ex2.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const exercises = JSON.parse(data);
    console.log(exercises.length);
});