// DAO를 이용해 noise-log 데이터 받아옴
// && 데이터 처리

const groupDao = require('../dao/group-dao');
const pool = require('../config/db');

/* SELECT */
exports.getGroupsByUserId = async (userId) => {
    const result = await groupDao.getGroupsByUserId(userId);
    return result;
};

exports.isOwner = async (userId, groupId) => {
    const result = await groupDao.isOwner(userId, groupId);
    return result;
};

/* INSERT */
// 그룹 생성
exports.insertGroup = async (groupName, description, userId, nickname) => {
    /* inviteCode 생성 */
    let randomString = "";
    for(let i=0; i<10; i++){    // 무한루프를 피하기위해 반복횟수 제한
        // 랜덤 문자열 생성(A-Z, 0-9를 포함하는 6자리 문자열)
        randomString = Math.random().toString(36).slice(2, 8).toUpperCase();
        if(randomString.length < 6) {   // 생성한 문자열의 길이가 6보다 작은 경우
            randomString = "";
            continue; // 다시 생성
        }

        // 생성한 randomString이 DB에 이미 존재하는지 확인
        const isDuplicate = await groupDao.isDuplicateInviteCode(randomString);
        if(isDuplicate) {  // 중복O, 다시 생성
            randomString = "";
        } else {   // 중복X, for문 종료
            break;
        }
    }
    console.log("grp_service_randomstirng: ", randomString);
    if(randomString === ""){    // 문자열 생성 실패 error message 전송
        throw new Error("failed to create invite_code");
    }


    /* 그룹 생성 및 생성자를 owner로 하는 group_members 레코드 추가 */
    const conn = await pool.getConnection();    // db 연결 객체 생성
    try {
        await conn.beginTransaction(); // 트랜잭션 시작
        
        // 그룹 생성
        const result = await groupDao.insertGroup(groupName, description, randomString);
        // group_members 레코드 생성
        await groupDao.insertGroupMember(result.insertId, userId, nickname, 1);
        
        await conn.commit();    // 트랜잭션 종료

        return result;
    } catch (err) {
        await conn.rollback();  // 쿼리 실패 시 롤백
        throw err;
    } finally {
        conn.release(); // 커넥션 반환
    }
}


/* DELETE */
// 그룹 삭제
exports.deleteGroup = async (userId, groupId) => {

    const conn = await pool.getConnection();    // db 연결 객체 생성
    try {
        await conn.beginTransaction(); // 트랜잭션 시작
        
        // 삭제하려는 사용자가 그룹의 owner인지 확인
        const isOwner = await groupDao.isOwner(userId, groupId);
        if(!isOwner) {  // owner가 아님
            const err = new Error("그룹 삭제 권한 없음");
            err.status = 403;   // 리소스 액세스 권한 X
            throw err;
        }

        // 그룹 삭제
        const result = await groupDao.deleteGroup(groupId);
        
        await conn.commit();    // 트랜잭션 종료

        return result;
    } catch (err) {
        await conn.rollback();  // 쿼리 실패 시 롤백
        throw err;
    } finally {
        conn.release(); // 커넥션 반환
    }
};

/* UPDATE */
// 그룹 정보 수정
exports.updateGroupInfo = async (id, groupName, description) => {
    const columnsForUpdate = [];    // 수정할 칼럼들
    const valuesForUpdate = [];     // 수정할 칼럼들의 new values

    // 수정할 칼럼 리스트
    // todo: 만약 ""이나 null값 들어오면 undefined랑 같은 취급할 건지
    if(groupName !== undefined) {
        columnsForUpdate.push('`group_name`=?');
        valuesForUpdate.push(groupName);
    }
    if(description !== undefined) {
        columnsForUpdate.push('`description`=?');
        valuesForUpdate.push(description);
    }

    //update할 column 없음 > update 안함
    if(columnsForUpdate.length === 0) {
        const err = new Error("수정할 그룹정보 없음");
        err.status = 400;   
        throw err;
    }

    //update
    const result = await groupDao.updateGroupInfo(id, columnsForUpdate, valuesForUpdate);
    return result;
};