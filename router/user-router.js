const userController = require('../controller/user-controller');
const express = require('express');
const router = express.Router();

router.get('/insertUser', userController.insertUser);

router.get('/deleteUser', userController.deleteUser);

module.exports = router;