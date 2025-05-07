const userController = require('../controller/user-controller');
const express = require('express');
const router = express.Router();

router.get('/getUserById', userController.getUserById);

router.post('/insertUser', userController.insertUser);

router.delete('/deleteUserById', userController.deleteUserById);

router.patch('/updateUserById', userController.updateUserById);

module.exports = router;