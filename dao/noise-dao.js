// noise-log 관련 데이터 접근 객체
const db = require('../config/db');

/* SELECT */
// query로 받은 user_id를 가진 유저의 noiselog list 전달
exports.getNoiseLogByUserId = async (userId) => {
    console.log("noise-dao-getNoiseLogByUserId:", userId);
    const sql = 'SELECT * FROM `noise_log` WHERE `user_id` = ?';
    const [results] = await db.execute(sql, [userId]);

    return results;
};

// 특정 날짜의 noise_log list 전달
exports.getNoiseLogsByDate = async (date) => {
  console.log('noiseDAO_getlogsBYDate: ', date);
  const sql = 'SELECT * FROM `noise_log` WHERE DATE(`start_time`) = ?';
  const [results] = await db.execute(sql, [date]);

  return results;
}

// query로 받은 년월(year, month)의 일별 max_db list 전달
exports.getMaxDecibelsForMonth = async (userId, year, month) => {
  //console.log("noise-dao-getMaxDecibelsForMonth:", userId);
  const sql = 'SELECT ANY_VALUE(`start_time`) as start_time, max(`max_db`) as max_db FROM `noise_log` '
                      + 'WHERE `user_id` = ? AND YEAR(`start_time`) = ? AND MONTH(`start_time`) = ? '
                      + 'GROUP BY DATE(`start_time`) ORDER BY DATE(`start_time`)';
  const [results] = await db.execute(sql, [userId, year, month]);

  return results;
};

/* INSERT */
// query로 받은 noise_log를 디비에 추가
exports.insertNoiseLog = async (noiseLevel, logTime, startTime, endTime, location, maxDb, userId) => {
  console.log("noise-dao-insertNoiseLog:", userId);
  const sql = 'INSERT INTO `noise_log` (`noise_level`, `log_time`, `start_time`, `end_time`, `location`, `max_db`, `user_id`) '
                          + 'VALUES(?, ?, ?, ?, ?, ?, ?)';
  const [results] = await db.execute(sql, [noiseLevel, logTime, startTime, endTime, location, maxDb, userId]);

  return results;
};


/* DELETE */
// 저장 시점으로부터 30일이 지난 noise log 삭제
/* 
 * mysql event scheduler에 event(delete_expired_noise_log) 등록해놓음.
 * (mysql의 event는 꺼져있을 때 event 실행X)
 * 따라서, 아래는 서버 실행 중단 기간동안 삭제되지 않은 expired noise_logs 삭제용
 */
exports.deleteExpiredNoiseLogs = async () => {
  const sql = 'DELETE FROM `noise_log` WHERE `start_time` < DATE_ADD(NOW(), INTERVAL -30 DAY)';
  const [results, fields] = await db.execute(sql, []);
  return results;
}

// 특정 noiselog 삭제
exports.deleteNoiseLog = async (id) => {
  const sql = 'DELETE FROM `noise_log` WHERE `id`=?';
  const [results] = await db.execute(sql, [id]);
  return results;
}
