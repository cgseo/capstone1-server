// DAO를 이용해 user-log 데이터 받아옴
// && 데이터 처리

const userDao = require('../dao/user-dao');

/* SELECT */


/* INSERT */
// 계정 생성
exports.insertUser = async (name, device_id) => {
    const result = await noiseDao.insertUser(name, device_id);
    return result;
}


/* DELETE */
// 계정 삭제
exports.deleteUser = async (id) => {
    const result = await noiseDao.deleteUser(id);
    return result;
}
