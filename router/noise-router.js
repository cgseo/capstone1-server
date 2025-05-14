// 라우터 설정

const noiseController = require('../controller/noise-controller');
const express = require('express');
const router = express.Router();

router.get('/', noiseController.getNoiseLogByUserId);
router.get('/byDate', noiseController.getNoiseLogsByDate);
router.get('/maxDbList', noiseController.getMaxDecibelsForMonth);


router.post('/insertNoiseLog', noiseController.insertNoiseLog);

router.delete('/delete', noiseController.deleteNoiseLog);


/*Deviceid */
router.get('/users', noiseController.getUserByDeviceId);

//invite_code 가져오기
router.get('/group/invite', noiseController.getGroupByInviteCode);
//name 가져오기
router.get('/users/name', noiseController.getUserName);
//
//그룹가입(invite_code,name)
router.post('/groups/join', noiseController.joinGroup);
//nickname 조회
router.get('/group-members/nickname-check', noiseController.checkNickname);
//그룹가입(invite_code,nickname)
router.post('/groups/join/nickname', noiseController.groupnickname);
//퇴실
router.delete('/groups/out',noiseController.groupout);

router.patch('/users/online',noiseController.isonline);

module.exports = router;