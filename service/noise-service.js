// DAO를 이용해 noise-log 데이터 받아옴
// && 데이터 처리

const noiseDao = require('../dao/noise-dao');

/* SELECT */
exports.getNoiseByUserId = async (userId) => {
    // 데이터 처리
    const result = await noiseDao.getNoiseLogByUserId(userId);
    return result;
}

exports.getNoiseLogsByDate = async (date) => {
    const result = await noiseDao.getNoiseLogsByDate(date);
    return result;
}

exports.getMaxDecibelsForMonth = async (userId, year, month) => {
    const result = await noiseDao.getMaxDecibelsForMonth(userId, year, month);
    return result;
}

/* device_id 조회 */
exports.getUserByDeviceId = async (deviceId) => {
    try {
        const result = await noiseDao.getUserByDeviceId(deviceId);
        return result;
    } catch (err) {
        console.error('service-getUserByDeviceId: ', err.stack);
        throw err;
    }
};

// invite_code로 그룹 조회
exports.getGroupByInviteCode = async (inviteCode) => {
    try {
        const group = await noiseDao.getGroupByInviteCode(inviteCode);
        return group;
    } catch (err) {
        console.error('service-getGroupByInviteCode: ', err.stack);
        throw err;
    }
};
// name조회
exports.getUserName = async (name) => {
    return await noiseDao.fetchUserName(name);
};

/* INSERT */
exports.insertNoiseLog = async (noiseLevel, logTime, startTime, endTime, location, maxDb, userId) => {
    const result = await noiseDao.insertNoiseLog(noiseLevel, logTime, startTime, endTime, location, maxDb, userId);
    return result;
}

//그룹가입
exports.joinGroup = async (invite_code, name) => {
    try {
        const group = await noiseDao.getGroupByInviteCode(invite_code);
        if (!group) {
            return { success: false, message: "초대 코드에 해당하는 그룹이 없습니다." };
        }

        const user = await noiseDao.fetchUserName(name); 
        if (!user) {
            return { success: false, message: "유저를 찾을 수 없습니다." };
        }

        const alreadyJoined = await noiseDao.checkGroupMembership(group.id, user.id);
        if (alreadyJoined) {
            return { success: false, message: "이미 가입된 그룹입니다." };
        }

        await noiseDao.addUserToGroup(group.id, user.id);
        return { success: true };
    } catch (err) {
        console.error("joinGroup 오류:", err);
        return { success: false, message: "서버 오류" };
    }
};

/* DELETE */
exports.deleteExpiredNoiseLogs = async () => {
    // 데이터 처리 
    const result = await noiseDao.deleteExpiredNoiseLogs();
    return result;
}

exports.deleteNoiseLog = async (id) => {
    const result = await noiseDao.deleteNoiseLog(id);
    return result;
}



