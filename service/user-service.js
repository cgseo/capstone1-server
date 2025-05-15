// DAO를 이용해 user-log 데이터 받아옴
// && 데이터 처리

const userDao = require('../dao/user-dao');

/* SELECT */
// 본인 정보 조회
exports.getUserById = async (id) => {
    const result = await userDao.getUserById(id);
    return result;
};


/* INSERT */
// 계정 생성
exports.insertUser = async (name, device_id) => {
    const result = await userDao.insertUser(name, device_id);
    return result;
};


/* DELETE */
// 계정 삭제
exports.deleteUserById = async (id) => {
    const result = await userDao.deleteUserById(id);
    return result;
};

/* UPDATE */
// 본인 정보 수정
exports.updateUserById = async (id, name) => {
    const columnsForUpdate = [];    // 수정할 칼럼들
    const valuesForUpdate = [];     // 수정할 칼럼들의 new values

    // 수정할 칼럼 리스트
    if(name !== undefined && name !== null && name !== "") { // name에 빈값 아니면 수정
        columnsForUpdate.push("`name`=?");
        valuesForUpdate.push(name);
    }

    // update할 column X >>> update 하지 않음
    if(columnsForUpdate.length === 0) {
        const err = new Error("수정할 사용자정보 없음");
        err.status = 400;   
        throw err;
    }

    const result = await userDao.updateUserById(id, columnsForUpdate, valuesForUpdate);
    return result;
};