// 라우터 설정

const noiseController = require('../controller/noise-controller');
const express = require('express');
const router = express.Router();

router.get('/', noiseController.getNoiseLogByUserId);
router.get('/byDate', noiseController.getNoiseLogsByDate);
router.get('/maxDbList', noiseController.getMaxDecibelsForMonth);
router.get('/membersNoiseLogs', noiseController.getNoiseLogsByGroupId);

router.post('/insertNoiseLog', noiseController.insertNoiseLog);

router.delete('/delete', noiseController.deleteNoiseLog);

module.exports = router;