const express = require('express');
const userControllers = require('../../controllers/userController');

const userRoutes = express.Router();

// All user routes
userRoutes.route('/')
    .get(userControllers.getUsers) // GET all users
    .post(userControllers.createUser); // POST a new user

userRoutes.route('/:userId')
    .get(userControllers.getSingleUser) // GET single user by id
    .put(userControllers.updateUser) // PUT (update) a user by id
    .delete(userControllers.deleteUser); // DELETE a single user

userRoutes.route('/:userId/friends')
    .post(userControllers.addFriend); // POST a friend to a user

userRoutes.route('/:userId/friends/:friendsId')
    .delete(userControllers.deleteFriend); // DELETE a friend by id

module.exports = userRoutes;
