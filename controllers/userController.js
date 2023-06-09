const { User, Thought } = require('../models/index');

// Aggregate function to get the number of users overall
const userCount = async () =>
    User.countDocuments();

module.exports = {
    // Get all users
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                    userCount: await userCount(),
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // Delete a user and their thoughts 
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No such user exists' })
                    : Thought.deleteMany(
                        { _id: { $in: user.thoughts } }
                    )
            )
            .then(() =>
                res.json({ message: 'User and associated thoughts successfully deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Other methods...
};
