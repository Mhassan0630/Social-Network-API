const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend, 
  deleteFriend
} = require('../../controllers/userController');

// GET all users
router.get('/', getUsers);

// GET a single user by its _id and populated thought and friend data
router.get('/:userId', getSingleUser);

// POST a new user
router.post('/', createUser);

// PUT to update a user by its _id
router.put('/:userId', updateUser);

// DELETE to remove user by its _id
router.delete('/:userId', deleteUser);

// POST a new friend to a user's friend list
router.post('/:userId/friends/:friendsId', addFriend)

// DELETE a friend from a user's friend list
router.delete('/:userId/friends/:friendsId', deleteFriend)

module.exports = router;
