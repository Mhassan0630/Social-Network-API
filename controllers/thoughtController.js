const { Thought, User } = require('../models/index');

const totalThoughts = async () =>
    Thought.aggregate()
        .count('totalThoughts')
        .then((thoughtsNum) => thoughtsNum);

module.exports = {
    fetchAllThoughts(req, res) {
        Thought.find()
            .then(async (allThoughts) => {
                const thoughtsData = {
                    allThoughts,
                    totalThoughts: await totalThoughts(),
                };
                return res.json(thoughtsData);
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json(error);
            });
    },
    createNewThought(req, res) {
        Thought.create(req.body)
            .then((newThought) => {
                const idOfThought = newThought._id;
                const userProvidedId = req.body.userId;
                const reactionsList = newThought.reactions;

                const userThoughtsUpdate = User.findOneAndUpdate(
                    { _id: userProvidedId },
                    { $push: { thoughts: idOfThought } },
                    { new: true }
                );

                const userReactionsUpdate = User.findOneAndUpdate(
                    { _id: userProvidedId },
                    { $push: { reactions: { $each: reactionsList } } },
                    { new: true }
                );

                return Promise.all([userThoughtsUpdate, userReactionsUpdate]);
            })
            .then(() => {
                res.json({ message: "New thought successfully created!" });
            })
            .catch((error) => res.status(500).json(error));
    },
    fetchSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then(async (singleThought) =>
                !singleThought
                    ? res.status(404).json({ message: 'No thought found with this ID' })
                    : res.json({ singleThought })
            )
            .catch((error) => {
                console.log(error);
                return res.status(500).json(error);
            });
    },
    modifyThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true }, (error, updatedThought) => {
            if (error) {
                return res.status(400).send(error);
            } else {
                return res.send(updatedThought);
            }
        });
    },
    removeThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((deletedThought) =>
                !deletedThought
                    ? res.status(404).json({ message: 'No thought found with this ID' })
                    : res.status(200).json({ message: 'Thought has been deleted!' })
            )
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $push: { reactions: req.body } }, { new: true }, (error, addedReaction) => {
            if (error) {
                return res.status(400).send(error);
            } else {
                return res.send(addedReaction);
            }
        });
    },
    removeReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.body.reactionId } } }, { new: true }, (error, removedReaction) => {
            if (error) {
                return res.status(400).send(error);
            } else {
                return res.send(removedReaction);
            }
        });
    }
};
