const BodyPart = require('../../models/BodyPart');

const getAllBodyParts = async (req, res) => {
  try {
    const bodyParts = await BodyPart.find({});
    res.status(200).json(bodyParts);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching body parts' });
  }
};


module.exports={getAllBodyParts}