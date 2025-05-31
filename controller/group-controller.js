// group 관련 client의 request 처리, Rest API 엔드포인트 정의

const groupService = require('../service/group-service');

/* SELECT */
// 본인이 속한 그룹 리스트
exports.getGroupsByUserId = async (req, res) => {
    try {
        const userId = req.query.userId;
        const result = await groupService.getGroupsByUserId(userId);
        res.json(result);
    } catch (err) {
        console.error('controller_groupsByUserId:', err.stack);
        res.status(500).json({error: err.message});
    }
};

exports.isOwner = async (req, res) => {
    try {
        const userId = req.query.userId;
        const groupId = req.query.groupId;
        const result = await groupService.isOwner(userId, groupId);
        res.json(result);
    } catch (err) {
        console.error('controller_isowner:', err.stack);
        res.status(500).json({error: err.message});
    }
}

/* INSERT */
// 그룹 생성
exports.insertGroup = async (req, res) => {
    console.log("here");

    const groupName = req.body.group_name;
    const description = req.body.description;
    const userId = req.body.user_id;
    const nickname = req.body.nickname;

    try {
        const result = await groupService.insertGroup(groupName, description, userId, nickname);
        res.json(result.insertId);  // 생성한 그룹의 group_id 반환
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};


/* DELETE */
// 그룹 삭제
exports.deleteGroup = async (req, res) => {
    const userId = parseInt(req.query.userId);
    const groupId = parseInt(req.query.groupId);
    try{
        const result = await groupService.deleteGroup(userId, groupId);
        res.json(result.affectedRows); // 삭제된 행의 수 반환
    } catch (err) {
        console.error('controller-deleteGroup: ', err.message);
        res.status(err.status || 500).json({error: err.message});
    }
};

/* UPDATE */
// 그룹정보수정
exports.updateGroupInfo = async (req, res) => {
    try {
        const id = req.body.id;
        const groupName = req.body.group_name;
        const description = req.body.description;

        const result = await groupService.updateGroupInfo(id, groupName, description);
        res.json(result.changedRows);   // 수정된경우: 1 / 수정X: 0 반환
    } catch (err) {
        console.error('controller_UpdateGroupInfo: ', err.message);
        res.status(err.status || 500).json({error: err.message});
    }
}