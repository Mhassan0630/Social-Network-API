const { User, Thought } = require('../models/index');

// Helper function to calculate the total number of users
async function calculateUserCount() {
    let totalUsers = await User.aggregate().count('totalUsers');
    return totalUsers;
}

module.exports = {
    // Retrieve all users
    allUsers(req, res) {
        User.find()
            .then(async (userData) => {
                let userInformation = {
                    userData,
                    totalUsers: await calculateUserCount(),
                };
                return res.json(userInformation);
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json(error);
            });
    },
    // Fetch a specific user
    specificUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate('thoughts')
            .populate('friends')
            .select('-__v')
            .then(async (foundUser) =>
                !foundUser
                    ? res.status(404).json({ message: 'No user found with this ID' })
                    : res.json({
                        foundUser,
                    })
            )
            .catch((error) => {
                console.log(error);
                return res.status(500).json(error);
            });
    },
    // Add a new user
    newUser(req, res) {
        User.create(req.body)
            .then((newUser) => res.json(newUser))
            .catch((error) => res.status(500).json(error));
    },
    // Remove a user and their thoughts 
    removeUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((removedUser) =>
                !removedUser
                    ? res.status(404).json({ message: 'No user with this ID exists' })
                    : Thought.findOneAndUpdate(
                        { students: req.params.userId },
                        { $pull: { students: req.params.userId } },
                        { new: true }
                    )
            )
            .then((thoughts) =>
                !thoughts
                    ? res.status(404).json({
                        message: 'User removed, but no thoughts associated',
                    })
                    : res.json({ message: 'User and associated thoughts removed successfully' })
            )
            .catch((error) => {
                console.log(error);
                res.status(500).json(error);
            });
    },
    // Modify a user's details
    modifyUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true }, (error, updatedUser) => {
            if (error) {
                return res.status(400).send(error);
            } else {
                return res.send(updatedUser);
            }
        });
    },
    // Include a friend by id 
    includeFriend: async (req, res) => {
        try {
            const currentUser = await User.findById(req.params.userId);
            const newFriend = await User.findById(req.params.friendsId);
    
            currentUser.friends.push(newFriend);
            const savedUser = await currentUser.save();
    
            return res.json(savedUser);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    // Exclude a friend by id
    excludeFriend: async (req, res) => {
        try {
            const currentUser = await User.findById(req.params.userId);
    
            currentUser.friends = currentUser.friends.filter(friendId => friendId.toString() !== req.params.friendsId);
    
            const updatedFriendList = await currentUser.save();
    
            return res.json(updatedFriendList);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }
};
