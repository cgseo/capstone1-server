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

//nickname 조회
exports.checkNickname = async (nickname) => {
  const member = await noiseDao.findByNickname(nickname);
  return !!member; // 존재하면 true, 없으면 false
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


// 그룹가입(invite_code, nickname)
exports.joinGroupWithNickname = async (invite_code, nickname, user_id) => {
    try {
        // 1. 초대 코드 유효성 검사
        const group = await noiseDao.getGroupByInviteCode(invite_code);
        if (!group) {
            throw new Error('Invalid invite code');
        }

        // 3. group_members 테이블에 사용자 추가
        const result = await noiseDao.addMemberToGroup(invite_code, nickname,user_id);

        // 4. 결과 반환
        return { message: 'Successfully joined the group', invite_code, nickname };

    } catch (error) {
        throw error;
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

// 퇴실
exports.groupOut = async (userId, groupId) => {
    try {
        // 1. 데이터베이스에서 해당 사용자를 그룹에서 제거
        const result = await noiseDao.removeMemberFromGroup(userId, groupId);

        // 2. 제거된 데이터가 있는지 확인 (옵션)
        if (result.affectedRows === 0) {
            throw new Error('User is not a member of this group.'); //  제거된 행이 없으면 에러 처리
        }

        // 3. 결과 반환
        return { message: 'Successfully removed from the group', result };
    } catch (error) {
        // 4. 오류 처리
        throw error;
    }
};

/* ALTER */

//isonline
exports.updateIsOnline = async (userId) => {
    try {
        // 1. DAO 함수 호출하여 is_online 값 변경
        const updatedUser = await noiseDao.updateIsOnline(userId);

        // 2. 사용자 정보가 존재하는지 확인
        if (!updatedUser) {
            throw new Error('User not found');
        }

        // 3. 업데이트된 사용자 정보 반환
        return updatedUser;
    } catch (error) {
        // 4. 오류 처리
        throw error;
    }
};
