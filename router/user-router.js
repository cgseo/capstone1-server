const userController = require('../controller/user-controller');
const express = require('express');
const router = express.Router();

router.get('/info', userController.getUserById);
router.get('/login', userController.login);
router.get('/checkEmail', userController.checkEmail);

router.post('/signup', userController.signUp);

router.delete('/deleteUserById', userController.deleteUserById);

router.patch('/updateInfo', userController.updateUserById);

module.exports = router;