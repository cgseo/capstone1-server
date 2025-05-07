const userController = require('../controller/user-controller');
const express = require('express');
const router = express.Router();

router.get('/getUserById', userController.getUserById);

router.get('/insertUser', userController.insertUser);

router.get('/deleteUserById', userController.deleteUserById);

router.get('/updateUserById', userController.updateUserById);

module.exports = router;