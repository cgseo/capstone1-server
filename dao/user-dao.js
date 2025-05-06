const db = require('../config/db');

/* SELECT */



/* INSERT */
// 계정생성: query로 받은 user를 디비에 추가
exports.insertUser = async (name, device_id) => {
    console.log("user-dao-insert:", name);
    const sql = 'INSERT INTO `users` (`name`, `device_id`) '
                            + 'VALUES(?, ?)';
    const [results] = await db.execute(sql, [name, device_id]);
  
    return results;
  };


/* DELETE */
// 계정삭제: 특정 user 삭제
exports.deleteUser = async (id) => {
    const sql = 'DELETE FROM `users` WHERE `id`=?';
    const [results] = await db.execute(sql, [id]);
    return results;
  }
