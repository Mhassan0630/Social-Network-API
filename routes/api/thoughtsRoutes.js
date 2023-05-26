const router = require('express').Router();
const {
    getThoughts,
    createThought,
    getSingleThought,
    updateThought,
    deleteThought,
    createReaction, 
    deleteReaction
} = require('../../controllers/thoughtController');

// GET all thoughts
router.get('/', getThoughts)

// POST a new thought
router.post('/', createThought)

// GET single thought by id
router.get('/:thoughtId', getSingleThought)

// PUT a thought by id
router.put('/:thoughtId', updateThought)

// DELETE a single thought
router.delete('/:thoughtId', deleteThought)

// POST a reaction to a thought
router.post('/:thoughtId/reactions', createReaction)

// DELETE a reaction by id
router.delete('/:thoughtId/reactions', deleteReaction)

module.exports = router;