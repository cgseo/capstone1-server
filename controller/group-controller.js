// group 관련 client의 request 처리, Rest API 엔드포인트 정의

const groupService = require('../service/group-service');

/* SELECT */
// 본인이 속한 그룹 리스트
exports.getGroupsByUserId = async (req, res) => {
    const userId = req.query.userId;

    try {
        const result = await groupService.getGroupsByUserId(userId);
        console.log("group_controller-list:", result.length);
        res.json(result);
    } catch (err) {
        console.error('group_controller-list:', err.stack);
        res.status(err.status || 500).json({message: err.message});
    }
};

exports.isOwner = async (req, res) => {
    const userId = req.query.userId;
    const groupId = req.query.groupId;

    try {
        const isOwner = await groupService.isOwner(userId, groupId);
        console.log("group_controller-isOwner(userId, groupId):", isOwner, userId, groupId);
        res.json(isOwner);
    } catch (err) {
        console.error('group_controller_isowner:', err.stack);
        res.status(err.status || 500).json({message: err.message});
    }
}

/* INSERT */
// 그룹 생성
exports.insertGroup = async (req, res) => {
    const groupName = req.body.group_name;
    const description = req.body.description;
    const userId = req.body.user_id;
    const nickname = req.body.nickname;

    try {
        const insertId = await groupService.insertGroup(groupName, description, userId, nickname);
        console.log("group-controller-insert: ", insertId);
        res.json(insertId);  // 생성한 그룹의 group_id 반환
    } catch (err) {
        console.error('group_controller_insert:', err.stack);
        res.status(err.status || 500).json({message: err.message});
    }
};


/* DELETE */
// 그룹 삭제
exports.deleteGroup = async (req, res) => {
    const userId = parseInt(req.query.userId);
    const groupId = parseInt(req.query.groupId);

    try{
        const affectedRows = await groupService.deleteGroup(userId, groupId);
        console.log("group-controller-delete: ", affectedRows);
        res.json(affectedRows); // 삭제된 행의 수 반환
    } catch (err) {
        console.error('group_controller_delete:', err.stack);
        res.status(err.status || 500).json({message: err.message});
    }
};

/* UPDATE */
// 그룹정보수정
exports.updateGroupInfo = async (req, res) => {
    const id = req.body.id;
    const groupName = req.body.group_name;
    const description = req.body.description;

    try {
        const changedRows = await groupService.updateGroupInfo(id, groupName, description);
        console.log("group-controller-update: ", changedRows);
        res.json(changedRows);   // 수정된 행의 수 반환
    } catch (err) {
        console.error('group_controller_update:', err.stack);
        res.status(err.status || 500).json({message: err.message});
    }
}