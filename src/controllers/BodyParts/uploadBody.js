const fs = require('fs');
const path = require('path');
const BodyPart = require('../../models/BodyPart');

const addBodyParts = async (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../../../exercisesName.json'), 'utf8');

    const bodyParts = JSON.parse(data);

    await BodyPart.insertMany(bodyParts);

    res.status(200).json({ message: 'Body parts added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding body parts' });
  }
};


module.exports={addBodyParts}