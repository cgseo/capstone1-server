const db = require('../config/db');

/* SELECT */
// 본인 정보 조회: user의 id로 정보 조회
exports.getUserById = async (id) => {
  console.log("user-dao-getUserById:", id);
  const sql = 'SELECT * FROM `users` WHERE `id` = ?';
  const [results] = await db.execute(sql, [id]);

  return results;
};


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
exports.deleteUserById = async (id) => {
  const sql = 'DELETE FROM `users` WHERE `id`=?';
  const [results] = await db.execute(sql, [id]);
  return results;
};


/* UPDATE */
// 본인 정보 수정: 변경불가능한 정보를 제외한 정보 수정 
// (변경X정보: id, device_id, create_at)
// (변경O정보: name)
exports.updateUserById = async (id, columnsForUpdate, valuesForUpdate) => {
  const values = valuesForUpdate;
  values.push(id);
  const sql = 'UPDATE `users` SET '+ columnsForUpdate.join(', ') +' WHERE `id`=?';
  const [results] = await db.execute(sql, values);

  return results;
};
