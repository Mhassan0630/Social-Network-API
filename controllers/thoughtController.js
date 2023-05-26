const { User, Thought } = require('../models/index');

// Counts all the thoughts
const thoughtCount = async () =>
    Thought.aggregate()
        .count('thoughtCount')
        .then((numberOfThoughts) => numberOfThoughts);

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
                const reactions = thought.reactions;

                const updateThoughts = User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { thoughts: thoughtId } },
                    { new: true }
                );

                const updateReactions = User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { reactions: { $each: reactions } } },
                    { new: true }
                );

                return Promise.all([updateThoughts, updateReactions]);
            })
            .then(() => {
                res.json({ message: "thought created!" });
            })
            .catch((err) => res.status(500).json(err));
    },
    // Get single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then(async (thought) =>
                !thought
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json({
                        thought,
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Update thought
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true }, (err, thought) => {
            if (err) {
                return res.status(400).send(err);
            } else {
                return res.send(thought);
            }
        });
    },
    // Delete thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No such thought exists' })
                    : res.status(200).json({ message: 'Thought was deleted!' })
            )
    },
    // Create a reaction
    createReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $push: { reactions: req.body } }, { new: true }, (err, reaction) => {
            if (err) {
                return res.status(400).send(err);
            } else {
                return res.send(reaction);
            }
        });
    },
    // Delete a reaction 
    deleteReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.body.reactionId } } }, { new: true }, (err, reaction) => {
            if (err) {
                return res.status(400).send(err);
            } else {
                return res.send(reaction);
            }
        });
    }
};