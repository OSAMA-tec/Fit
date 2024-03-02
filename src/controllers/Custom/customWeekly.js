const CustomizedExercisePlan = require('../../models/CustomWeek');
const User = require('../../models/User');
const createWeeklyExercisePlan = async (req, res) => {
  const userId = req.user.id;
  const { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = req.body;
  if (Monday.length === 0 || Tuesday.length === 0 || Wednesday.length === 0 || Thursday.length === 0 || Friday.length === 0 || Saturday.length === 0 || Sunday.length === 0) {
    return res.status(400).json({ message: 'Exercise IDs for each day must not be empty' });
  }
  try {
    const user = await User.findById(userId).populate('plan');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.plan || !(["premium", "elite"].includes(user.plan.name.toLowerCase()))) {
      return res.status(403).json({ message: 'Kindly change the plan to use this feature' });
    }
    await CustomizedExercisePlan.deleteMany({ userId: userId });
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);

    const weeklyExercisePlan = [
      { dayOfWeek: 'Monday', exerciseIds: Monday },
      { dayOfWeek: 'Tuesday', exerciseIds: Tuesday },
      { dayOfWeek: 'Wednesday', exerciseIds: Wednesday },
      { dayOfWeek: 'Thursday', exerciseIds: Thursday },
      { dayOfWeek: 'Friday', exerciseIds: Friday },
      { dayOfWeek: 'Saturday', exerciseIds: Saturday },
      { dayOfWeek: 'Sunday', exerciseIds: Sunday }
    ];

    // Create a new CustomizedExercisePlan document
    const newPlan = new CustomizedExercisePlan({
      userId,
      startDate,
      endDate,
      weeklyExercisePlan
    });

    // Save the plan
    await newPlan.save();

    return res.status(201).json({ message: 'Weekly exercise plan created successfully', planId: newPlan._id });
  } catch (error) {
    return res.status(500).json({ message: `Error creating weekly exercise plan: ${error.message}` });
  }
};



const getWeeklyExercises = async (req, res) => {
  const userId = req.user.id;

  try {
    const exercisePlans = await CustomizedExercisePlan.find({ userId }).populate('weeklyExercisePlan.exerciseIds');
    console.log(exercisePlans)
    if (!exercisePlans) {
      return res.status(404).json({ message: 'No exercise plans found for this user.' });
    }

    // Return the exercise plans
    return res.status(200).json({ exercisePlans });
  } catch (error) {
    // Handle potential errors
    console.error('Error fetching weekly exercises:', error);
    return res.status(500).json({ message: 'An error occurred while retrieving the weekly exercises.' });
  }
};



const updateCustomExercisePlan = async (req, res) => {
  const { exerciseId, CustomizedExercisePlanID, weekDay, remove } = req.body;
  const userId = req.user.id;

  // Validate weekDay
  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if (!validDays.includes(weekDay)) {
    return res.status(400).json({ message: 'Invalid weekday provided.' });
  }

  try {
    const plan = await CustomizedExercisePlan.findOne({ _id: CustomizedExercisePlanID, userId: userId });
    if (!plan) {
      return res.status(404).json({ message: 'Customized exercise plan not found.' });
    }

    if (remove) {
      await CustomizedExercisePlan.updateOne(
        { _id: CustomizedExercisePlanID, 'weeklyExercisePlan.dayOfWeek': weekDay },
        { $pull: { 'weeklyExercisePlan.$.exerciseIds': exerciseId } }
      );
    } else {
      await CustomizedExercisePlan.updateOne(
        { _id: CustomizedExercisePlanID, 'weeklyExercisePlan.dayOfWeek': weekDay },
        { $addToSet: { 'weeklyExercisePlan.$.exerciseIds': exerciseId } }
      );
    }

    return res.status(200).json({ message: `Exercise has been ${remove ? 'removed' : 'added'} successfully.` });

  } catch (error) {
    console.error('Error updating custom exercise plan:', error);
    return res.status(500).json({ message: 'An error occurred while updating the custom exercise plan.' });
  }
};




const deleteCustomExercisePlan = async (req, res) => {
  const { CustomizedExercisePlanID } = req.body;
  const userId = req.user.id;

  try {
    const plan = await CustomizedExercisePlan.findOne({ _id: CustomizedExercisePlanID, userId: userId });
    if (!plan) {
      return res.status(404).json({ message: 'Customized exercise plan not found or does not belong to the user.' });
    }
    console.log(plan)
    // Delete the plan
    await CustomizedExercisePlan.deleteMany({ _id: CustomizedExercisePlanID });

    return res.status(200).json({ message: 'Customized exercise plan deleted successfully.' });
  } catch (error) {
    console.error('Error deleting custom exercise plan:', error);
    return res.status(500).json({ message: 'An error occurred while attempting to delete the exercise plan.' });
  }
};



module.exports = { createWeeklyExercisePlan, getWeeklyExercises, updateCustomExercisePlan, deleteCustomExercisePlan };
