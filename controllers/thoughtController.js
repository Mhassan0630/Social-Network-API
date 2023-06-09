const { User, Thought } = require('../models/index');

// Counts all the thoughts
const thoughtCount = async () => 
    Thought.countDocuments();

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then(async (thought) => {
                const thoughtObj = {
                    thought,
                    thoughtCount: await thoughtCount(),
                };
                return res.json(thoughtObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Create thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                console.log(thought.reactions);
                const thoughtId = thought._id;
                const userId = req.body.userId;

                return User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { thoughts: thoughtId } },
                    { new: true }
                );
            })
            .then(() => {
                res.json({ message: "Thought created!" });
            })
            .catch((err) => res.status(500).json(err));
    },
    // Other methods...
};
