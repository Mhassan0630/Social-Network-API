const express = require('express');
const thoughts = require('../../controllers/thoughtController');

const thoughtRoutes = express.Router();

// All thought routes
thoughtRoutes.route('/')
    .get(thoughts.getThoughts) // GET all thoughts
    .post(thoughts.createThought); // POST a new thought

thoughtRoutes.route('/:thoughtId')
    .get(thoughts.getSingleThought) // GET single thought by id
    .put(thoughts.updateThought) // PUT a thought by id
    .delete(thoughts.deleteThought); // DELETE a single thought

thoughtRoutes.route('/:thoughtId/reactions')
    .post(thoughts.createReaction); // POST a reaction to a thought

thoughtRoutes.route('/:thoughtId/reactions')
    .delete(thoughts.deleteReaction); // DELETE a reaction by id

module.exports = thoughtRoutes;
