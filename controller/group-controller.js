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

// group의 id로 특정 그룹 info 조회
exports.getGroupInfo = async (req, res) => {
    const id = req.query.id;

    try {
        const result = await groupService.getGroupInfo(id);
        console.log("group_controller-info: ", result.group_name);
        res.json(result);
    } catch (err) {
        console.error("group_controller-info: ", err.stack);
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

// 연결된 wifi의 bssid로 가입한 그룹의 아이디 반환
exports.getGroupIdByWifi = async (req, res) => {
    const { userId, wifiBssid } = req.query;

    try {
        const results = await groupService.getGroupIdByWifi(userId, wifiBssid); // DAO에서 [{ group_id: X }] 또는 [] 반환

        let groupId = null; // 기본값을 null로 설정

        if (results && results.length > 0) {
            groupId = results[0].group_id; // 배열의 첫 번째 객체에서 group_id를 추출
        }

        // 디버깅 로그 강화: 클라이언트에 보낼 최종 groupId 값 확인
        console.log(`group_controller-wifi(userId, BSSID, finalGroupId): ${userId} ${wifiBssid} ${groupId}`);

        // 클라이언트가 파싱할 수 있도록 JSON 형태로 응답
        res.status(200).json({ group_id: groupId }); // null이거나 실제 ID 값이거나

    } catch (err) {
        console.error('group_controller-getGroupIdByWifi: ', err.stack);
        res.status(err.status || 500).json({ message: err.message || '서버 오류: Wi-Fi 그룹 ID를 가져오는 데 실패했습니다.' });
    }
};

/* INSERT */
// 그룹 생성
exports.insertGroup = async (req, res) => {
    const groupName = req.body.group_name;
    const description = req.body.description;
    const userId = req.body.user_id;
    const nickname = req.body.nickname;
    const wifiBssid = req.body.wifi_bssid;

    try {
        const insertId = await groupService.insertGroup(groupName, description, userId, nickname, wifiBssid);
        console.log("group-controller-insert: ", insertId);
        res.json(insertId);  // 생성한 그룹의 group_id 반환
    } catch (err) {
        console.error('group_controller_insert:', err.stack);
        res.status(err.status || 500).json({message: err.message});
    }
};


/* DELETE */
// 그룹 삭제
exports.deleteGroup = async (req, res, next) => {
    try {
        // Android 앱에서 보낸 쿼리 파라미터 이름(user_id, group_id)과 일치하도록 수정
        const userId = req.query.user_id; // <-- user_id로 변경
        const groupId = req.query.group_id; // <-- group_id로 변경

        console.log(`[Controller] deleteGroup 요청 수신 - userId: ${userId}, groupId: ${groupId}`); // 디버깅 로그

        // userId 또는 groupId가 null/undefined/빈 문자열인지 확인 (방어 코드)
        if (!userId || !groupId) {
            console.warn(`[Controller] deleteGroup - 필수 파라미터 누락: userId=${userId}, groupId=${groupId}`);
            return res.status(400).json({ error: '사용자 ID 또는 그룹 ID가 필요합니다.' });
        }

        // 숫자 타입으로 변환 (데이터베이스가 숫자를 기대할 경우)
        // 만약 ID가 문자열 UUID 등이라면 이 변환은 필요하지 않습니다.
        // 현재 로그에서 '10'과 '8'은 숫자로 보이므로 parseInt를 사용합니다.
        const parsedUserId = parseInt(userId, 10);
        const parsedGroupId = parseInt(groupId, 10);

        // NaN 여부 다시 확인
        if (isNaN(parsedUserId) || isNaN(parsedGroupId)) {
            console.warn(`[Controller] deleteGroup - 유효하지 않은 ID 형식: parsedUserId=${parsedUserId}, parsedGroupId=${parsedGroupId}`);
            return res.status(400).json({ error: '유효하지 않은 사용자 ID 또는 그룹 ID 형식입니다.' });
        }
        
        // 서비스 계층으로 올바르게 파싱된 숫자 ID 전달
        const affectedRows = await groupService.deleteGroup(parsedUserId, parsedGroupId);

        if (affectedRows > 0) {
            console.log(`[Controller] 그룹 삭제 성공 - groupId: ${parsedGroupId}, affectedRows: ${affectedRows}`);
            res.status(200).json({ message: '그룹 삭제 완료' });
        } else {
            console.warn(`[Controller] 그룹 삭제 실패 또는 그룹 없음 - groupId: ${parsedGroupId}, affectedRows: ${affectedRows}`);
            res.status(404).json({ error: '그룹을 찾을 수 없거나 삭제 권한이 없습니다.' });
        }
    } catch (error) {
        console.error(`[Controller] deleteGroup 오류: ${error.message}`);
        // 에러 유형에 따라 다른 HTTP 상태 코드 반환
        if (error.status) {
            res.status(error.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: '서버 내부 오류: ' + error.message });
        }
        // next(error); // Express 에러 핸들러로 전달하려면 이 주석을 해제
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