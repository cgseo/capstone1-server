// group 관련 라우터 설정

const groupController = require('../controller/group-controller');
const express = require('express');
const router = express.Router();

router.get('/groupList', groupController.getGroupsByUserId);    // 본인이 속한 그룹리스트 조회
router.get('/info', groupController.getGroupInfo);  // group의 id로 특정 그룹 info 조회
router.get('/isOwner', groupController.isOwner);    // 해당 그룹의 owner인지 조회

router.post('/insertGroup', groupController.insertGroup);   // 그룹 생성

router.delete('/deleteGroup', groupController.deleteGroup); // 그룹 삭제

router.patch('/updateInfo', groupController.updateGroupInfo);   // 그룹 정보 수정

module.exports = router;