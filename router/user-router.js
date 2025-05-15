const userController = require('../controller/user-controller');
const express = require('express');
const router = express.Router();

router.get('/info', userController.getUserById);

router.post('/insertUser', userController.insertUser);

router.delete('/deleteUserById', userController.deleteUserById);

router.patch('/updateInfo', userController.updateUserById);

module.exports = router;