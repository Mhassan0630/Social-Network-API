// All user routes
userRoutes
.routes('/')
.get(userControllers.allUsers) // GET all users
.post(userControllers.newUser); // POST a new user

const { User, Thought } = require('../models/index');

// Aggregate function to get the number of users overall
const userCount = async () =>
    User.aggregate()
        .count('userCount')
        .then((numberOfUsers) => numberOfUsers);

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
    // Get a single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate('thoughts')
            .populate('friends')
            .select('-__v')
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json({
                        user,
                    })
            )
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
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No such user exists' })
                    : Thought.findOneAndUpdate(
                        { students: req.params.userId },
                        { $pull: { students: req.params.userId } },
                        { new: true }
                    )
            )
            .then((thought) =>
                !thought
                    ? res.status(404).json({
                        message: 'User deleted, but no thoughts found',
                    })
                    : res.json({ message: 'User successfully deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // Update a user
    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (err, user) => {
            if (err) {
                return res.status(400).send(err);
            } else {
                return res.send(user);
            }
        });
    },

    // Add a friend by id 
    addFriend: async (req, res) => {
        try {
            const user = await User.findById(req.params.userId);
            const friend = await User.findById(req.params.friendsId);
    
            user.friends.push(friend);
            const updatedUser = await user.save();
    
            return res.json(updatedUser);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    // Delete a friend by id
    deleteFriend: async (req, res) => {
        try {
            const user = await User.findById(req.params.userId);
    
            user.friends = user.friends.filter(friendId => friendId.toString() !== req.params.friendsId);
    
            const updatedFriends = await user.save();
    
            return res.json(updatedFriends);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
};