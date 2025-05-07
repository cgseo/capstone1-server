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
exports.updateUserById = async (name, id) => {
    const result = await userDao.updateUserById(name, id);
    return result;
};