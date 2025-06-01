const db = require('../config/db');

/* SELECT */
// 본인 정보 조회: user의 id로 정보 조회
exports.getUserById = async (id) => {
  const sql = 'SELECT * FROM `users` WHERE `id` = ?';
  const [results] = await db.execute(sql, [id]);

  return results;
};

// email 일치하는 레코드의 id 반환
exports.getIdByEmail = async (email) => {
  const sql = 'SELECT id FROM `users` WHERE `email` = ?';
  const [result] = await db.execute(sql, [email]);

  return result;
};

// email 중복 검사
exports.checkEmail = async (email) => {
  const sql = 'SELECT * FROM `users` WHERE `email` = ?';
  const [result] = await db.execute(sql, [email]);

  return result; 
};


// email로 user의 해시된 비밀번호 가져오기
exports.getPasswordByEmail = async (email) => {
  const sql = 'SELECT password FROM `users` WHERE `email` = ?';
  const [result] = await db.execute(sql, [email]);

  return result;
};

/* INSERT */
// 회원가입: body로 받은 user(email, password)를 디비에 추가
exports.signUp = async (email, password) => {
  const sql = 'INSERT INTO `users` (`email`, `password`, `is_online`) '
                            + 'VALUES(?, ?, ?)';
  const [results] = await db.execute(sql, [email, password, 1]);
  
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
