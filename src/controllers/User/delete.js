const User = require('../../models/User');
const Plan = require('../../models/Plan');
const Payment = require('../../models/Payment');

const deleteUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Plan.deleteOne({ _id: user.plan });

        await Payment.deleteMany({ userId: userId });

        await User.deleteOne({ _id: userId });

        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports={deleteUser}