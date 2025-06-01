// group 관련 데이터 접근 객체
const db = require('../config/db');

/* SELECT */
// 본인이 속한 그룹 조회
exports.getGroupsByUserId = async (userId) => {
    const sql = 'SELECT `grouptb`.* FROM `group_members` INNER JOIN `grouptb` '
        +'ON `group_members`.`group_id`=`grouptb`.`id` WHERE `user_id`=?';
    const [results] = await db.execute(sql, [userId]);

    return results;
};

// 본인이 생성한 그룹 조회  ** is_owner == 1인 그룹만 조회
exports.getOwnedGroupsByUserId = async (userId) => {

};

// 생성한 난수와 일치하는 invite_code있는지 확인
exports.isDuplicateInviteCode = async (inviteCode) => {
    const sql = 'SELECT `invite_code` FROM `grouptb` WHERE `invite_code` = ?';
    const [results] = await db.execute(sql, [inviteCode]);

    return results;
}

// 사용자가 그룹의 owner인지
exports.isOwner = async (userId, groupId) => {
    const sql = 'SELECT `is_owner` FROM `group_members` WHERE `user_id`=? AND `group_id`=?';
    const [results] = await db.execute(sql, [userId, groupId]);

    return results;
}

/* INSERT */
// 그룹 생성    ** 그룹 생성자가 owner로 자동지정
exports.insertGroup = async (groupName, description, inviteCode) => {
    const sql = 'INSERT INTO `grouptb` (`group_name`, `description`, `invite_code`) '
                + 'VALUES(?, ?, ?)';
    const [results] = await db.execute(sql, [groupName, description, inviteCode]);
    
    return results;
};

// group_memebers 레코드 생성
exports.insertGroupMember = async (groupId, userId, nickname, isOwner) => {
    const sql = 'INSERT INTO `group_members` (`group_id`, `user_id`, `nickname`, `is_owner`) '
                + 'VALUES(?, ?, ?, ?)';
    const [results] = await db.execute(sql, [groupId, userId, nickname, isOwner]);

    return results;
};

/* DELETE */
// 그룹 삭제    **owner만 삭제 가능
exports.deleteGroup = async (id) => {
    const sql = 'DELETE FROM `grouptb` WHERE `id`=?';
    const [result] = await db.execute(sql, [id]);
    return result;
};


/* UPDATE */
// 그룹 정보 수정   **owner만 수정 가능
exports.updateGroupInfo = async (id, columnsForUpdate, valuesForUpdate) => {
    const values = valuesForUpdate;
    values.push(id);
    const sql = 'UPDATE grouptb SET '+ columnsForUpdate.join(', ') + ' WHERE `id`=?';
    const [results] = await db.execute(sql, values);
    return results;
};