// noise-log 관련 client의 request 처리, Rest API 엔드포인트 정의
const noiseService = require('../service/noise-service');
const dayjs = require('dayjs');

/* SELECT */
exports.getNoiseLogByUserId = async (req, res) => {
    const userId = req.query.userId;

    try {
        const result = await noiseService.getNoiseByUserId(userId);
        console.log("noise_controller-getNoiseLogByUserId:", userId," length:", result.length);
        res.json(result);
    } catch (err) {
        console.error('noise_controller-getNoiseLogByUserId: ', err.stack);
        res.status(err.status || 500).json({message: 'failed to get noises'});
    }
};

exports.getNoiseLogsByDate = async (req, res) => {
    const userId = req.query.userId;
    const date = req.query.date;

    try {
        const result = await noiseService.getNoiseLogsByDate(userId, date);
        console.log('noise_controller-getNoiseLogsByDate: ', userId, date);
        res.json(result);
    } catch (err) {
        console.error('noise_controller-getNoiseLogsByDate: ', err.stack);
        res.status(err.status || 500).json({message: 'failed to get noises'});
    }
};

exports.getMaxDecibelsForMonth = async (req, res) => {
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month;

    try {
        const result = await noiseService.getMaxDecibelsForMonth(userId, year, month);
        console.log('noise_controller-getMaxs: ', year, month);
        res.json(result); 
    } catch (err) {
        console.error('noise_controller-getMaxs: ', err.stack);
        res.status(err.status || 500).json({message: 'failed to get max_db list'});
    }
};

exports.getNoiseLogsByGroupId = async (req, res) => {
    const groupId = req.query.groupId;

    try {
        const result = await noiseService.getNoiseLogsByGroupId(groupId);
        console.log('noise_controller-noises_group: ', groupId);
        res.json(result);
    } catch (err) { 
        console.error('noise_controller-noises_group: ', err.stack);
        res.status(err.status || 500).json({message: err.message});
    }
}

/*device_id 검색*/
exports.getUserByDeviceId = async (req, res) => {
    const deviceId = req.query.device_id;
    console.log("device_id:", deviceId);

    try {
        const user = await noiseService.getUserByDeviceId(deviceId);  // noiseService 호출
        if (user) {
            res.json(user);  // 사용자 정보 반환
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error('controller-getUserByDeviceId: ', err.stack);
        res.status(500).json({ error: 'Failed to get user' });
    }
};

/* invite_code로 그룹 조회 */
exports.getGroupByInviteCode = async (req, res) => {
    const inviteCode = req.query.invite_code;
    console.log("invite_code:", inviteCode);

    try {
        // noiseService.getGroupByInviteCode 호출하여 group 가져오기
        const group = await noiseService.getGroupByInviteCode(inviteCode);
        
        if (group) {
            // 그룹이 존재하면 group 반환
            res.json(group);
        } else {
            // 그룹이 존재하지 않으면 404 오류 반환
            res.status(404).json({ exists: false, message: 'Invite code not found' });
        }
    } catch (err) {
        console.error('controller-getGroupByInviteCode: ', err.stack);
        res.status(500).json({ error: 'Failed to check invite code' });
    }
};

/*name 조회*/
exports.getUserName = async (req, res) => {
    const name = req.query.name; // 쿼리 파라미터에서 name 받음
    if (!name) {
        return res.status(400).json({ success: false, message: "name 쿼리 파라미터가 필요합니다." });
    }

    try {
        const user = await noiseService.getUserName(name);
        if (!user) {
            return res.status(404).json({ success: false, message: "유저를 찾을 수 없습니다." });
        }
        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
};

// nickname 조회
exports.checkNickname = async (req, res) => {
  const { nickname } = req.query; // 
  try {
    const exists = await noiseService.checkNickname(nickname);
    res.status(200).json({ exists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러' });
  }
};


/* INSERT */
exports.insertNoiseLog = async (req, res) => {
    const noiseLevel = req.body.noise_level;
    const logTime = req.body.log_time;
    const startTime = dayjs(req.body.start_time, 'MMM DD, YYYY hh:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
    const endTime = dayjs(req.body.end_time, 'MMM DD, YYYY hh:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
    const location = req.body.location;
    const maxDb = req.body.max_db;
    const userId = req.body.user_id;
    const groupId = req.body.group_id;

    console.log(noiseLevel, logTime, startTime, endTime, location, maxDb, userId, groupId);
    try {
        const insertId = await noiseService.insertNoiseLog(noiseLevel, logTime, startTime, endTime, location, maxDb, userId, groupId);
        console.log("noise_controller-insertNoise: ", insertId);
        res.json(insertId); 
    } catch (err) {
        console.error('noise_controller-insertNoise: ', err.stack);
        res.status(err.status || 500).json({message: 'failed to get max_db list'});
    }
};

//그룹가입
exports.joinGroup = async (req, res) => {
    try {
        const { invite_code, name } = req.body;

        if (!invite_code || !name) {
            return res.status(400).json({ message: "invite_code와 name은 필수입니다." });
        }

        const result = await noiseService.joinGroup(invite_code, name);

        if (result.success) {
            return res.status(200).json({ message: "그룹에 성공적으로 가입했습니다." });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (err) {
        console.error("joinGroup error:", err);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};


//그룹가입(invite_code,nickname)
exports.groupnickname = async (req, res) => {
    const { invite_code, nickname, user_id } = req.body;

  //  console.log('Received invite_code:', invite_code);  // 디버깅용 로그
   // console.log('Received nickname:', nickname);        // 디버깅용 로그

    try {
        // 서비스 호출
        const result = await noiseService.joinGroupWithNickname(invite_code, nickname, user_id);
        
        // 성공 시 응답
        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

/* DELETE */
// 하나의 noiseLog 삭제 
exports.deleteNoiseLog = async (req, res) => {
    const id = req.query.id;
    try {
        const affectedRows = await noiseService.deleteNoiseLog(id);
        console.log(`noise_controller-deleteNoiseLog: ${affectedRows}개 삭제`);
        res.json(affectedRows);  // 삭제된 행의 수 반환
    } catch (err) {
        console.error('noise_controller-deleteNoiseLog: ', err.stack);
        res.status(err.status || 500).json({message: `failed to delete noise log(id:${id})`});
    }
};





//퇴실
exports.groupout = async (req, res) => {
    const userId = req.query.user_id;
    const groupId = req.query.group_id;

    try {
        // 1. 입력 유효성 검사
        if (!userId || !groupId) {
            return res.status(400).json({ message: 'user_id와 group_id를 모두 제공해야 합니다.' });
        }

        // 2. 서비스 함수를 호출하여 그룹 퇴출 로직 처리
        const result = await noiseService.groupOut(userId, groupId);

        // 3. 성공 응답
        res.status(200).json({ message: 'Successfully left the group', result });
    } catch (error) {
        // 4. 오류 처리
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

/* ALTER */

//isonline
exports.isonline = async (req, res) => {
    const userId = req.query.user_id;

    try {
        // 1. userId 유효성 검사
        if (!userId) {
            return res.status(400).json({ message: 'user_id를 제공해야 합니다.' });
        }

        // 2. 서비스 함수 호출하여 is_online 값 변경
        const updatedUser = await noiseService.updateIsOnline(userId);

        // 3. 성공 응답
        res.status(200).json({ message: 'Successfully updated is_online', user: updatedUser });
    } catch (error) {
        // 4. 오류 처리
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
