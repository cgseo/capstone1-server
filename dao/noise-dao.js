// noise-log 관련 데이터 접근 객체
const db = require('../config/db');

/* SELECT */
// query로 받은 user_id를 가진 유저의 noiselog list 전달
exports.getNoiseLogByUserId = async (userId) => {
    const sql = 'SELECT * FROM `noise_log` WHERE `user_id` = ?';
    const [results] = await db.execute(sql, [userId]);

    return results;
};

// 특정 날짜의 noise_log list 전달
exports.getNoiseLogsByDate = async (userId, date) => {
  const sql = 'SELECT * FROM `noise_log` WHERE `user_id` = ? AND DATE(`start_time`) = ?';
  const [results] = await db.execute(sql, [userId, date]);

  return results;
};

// query로 받은 년월(year, month)의 일별 max_db list 전달
exports.getMaxDecibelsForMonth = async (userId, year, month) => {
  const sql = 'SELECT ANY_VALUE(`start_time`) as start_time, max(`max_db`) as max_db FROM `noise_log` '
                      + 'WHERE `user_id` = ? AND YEAR(`start_time`) = ? AND MONTH(`start_time`) = ? '
                      + 'GROUP BY DATE(`start_time`) ORDER BY DATE(`start_time`)';
  const [results] = await db.execute(sql, [userId, year, month]);

  return results;
};

// 특정 그룹에 속한 그룹원들이 해당 그룹원으로서 최근 30분 이내 기록된 noise_log(noise_level, max_db) list
// +members 정보(user_id, nickname, is_online) 조회
exports.getNoiseLogsByGroupId = async (groupId) => {
  // a == 특정 그룹에 속한 member들의 정보(user_id, nickname, is_online)
  const sql = 'WITH `a` AS (' 
	  +'SELECT `user_id`, `nickname`, `is_online` FROM `group_members` '
	  +'INNER JOIN `users` ON `group_members`.`user_id` = `users`.`id` '
	  +'WHERE `group_members`.`group_id` = ?)'
    +', `ranked` as (SELECT `noise_level`, `max_db`, `user_id`, ' 
    // ranked == 멤버별 최근 30분 이내에 해당 그룹원으로서 기록된 noise_log들을 최신순으로 나열
	  +'ROW_NUMBER() OVER (PARTITION BY `user_id` ORDER BY `end_time` DESC) AS `row_n` '
	  +'FROM `noise_log` WHERE `group_id`=? AND `end_time` >= NOW() - INTERVAL 30 MINUTE)'
    // b == 멤버별 최근 30분 이내에 기론된 noise_log들 중 가장 최신 noise_log
    +', `b` as (SELECT * FROM `ranked` WHERE `row_n` = 1 )'
    // member 정보 + noise_log 정보 left join해서 list 조회
 +'SELECT `a`.*, `b`.`noise_level`, `b`.`max_db` FROM `a` LEFT JOIN `b` ON `a`.`user_id`=`b`.`user_id`';
  const [results] = await db.execute(sql, [groupId, groupId]);
  return results;
};

//device_id 받아오기
exports.getUserByDeviceId = async (deviceId) => {
  try {
      const query = 'SELECT * FROM users WHERE device_id = ?';  
      const [rows] = await db.query(query, [deviceId]);
      return rows[0];  // 첫 번째 사용자만 반환
  } catch (err) {
      console.error('dao-getUserByDeviceId: ', err.stack);
      throw err;
  }
};

// 
exports.getGroupByInviteCode = async (inviteCode) => {
  try {
      console.log(`Querying for invite code: ${inviteCode}`);
      const query = 'SELECT * FROM grouptb WHERE invite_code = ?';
      const [rows] = await db.query(query, [inviteCode]);

      // 데이터가 없을 경우
      if (rows.length === 0) {
          console.log(`No group found for invite code: ${inviteCode}`);
          return null; 
      }

      console.log(`Found group: ${JSON.stringify(rows[0])}`);
      return rows[0];
  } catch (err) {
      console.error('dao-getGroupByInviteCode: ', err.stack);
      throw err;
  }
};

//name 조회
exports.fetchUserName = async (name) => {
  const sql = 'SELECT id, name FROM users WHERE name = ?';
  const [rows] = await db.query(sql, [name]);
  return rows[0]; 
};


//nickname 조회
exports.findByNickname = async (nickname) => {
  const [rows] = await db.query(
    `SELECT * FROM group_members WHERE nickname = ?`,
    [nickname] // 
  );
  return rows[0] || null; // 해당 nickname이 존재하면 반환
};


//그룹에 가입했는지 확인(중복확인)
exports.checkGroupMembership = async (group_id, user_id) => {
  const [rows] = await db.query(
      "SELECT * FROM group_members WHERE group_id = ? AND user_id = ?",
      [group_id, user_id]
  );
  return rows.length > 0;
};

/* INSERT */
// query로 받은 noise_log를 디비에 추가
exports.insertNoiseLog = async (noiseLevel, logTime, startTime, endTime, location, maxDb, userId, groupId) => {
  const sql = 'INSERT INTO `noise_log` (`noise_level`, `log_time`, `start_time`, `end_time`, `location`, `max_db`, `user_id`, `group_id`) '
                          + 'VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
  const [results] = await db.execute(sql, [noiseLevel, logTime, startTime, endTime, location, maxDb, userId, groupId]);

  return results;
};

//그룹에 추가
exports.addUserToGroup = async (group_id, user_id) => {
  const now = new Date();
  await db.query(
      "INSERT INTO group_members (group_id, user_id, joined_at, is_owner) VALUES (?, ?, ?, ?)",
      [group_id, user_id, now, false]
  );
};

// 그룹에 사용자 추가(nickname 추가)
exports.addMemberToGroup = async (invite_code, nickname,user_id) => {
 // console.log('addMemberToGroup 함수가 호출되었습니다.', { invite_code, nickname });
    try {
        // 그룹 ID를 초대 코드로 찾기
        const [rows] = await db.query('SELECT id FROM grouptb WHERE invite_code = ?', [invite_code]);
        
        if (!rows || rows.length === 0) {
            throw new Error('No group found for this invite code');
        }
        
        // 그룹 ID 가져오기
        const groupId = rows[0].id;
        
        // group_members 테이블에 사용자 추가
        const query = 'INSERT INTO group_members (group_id, nickname,user_id) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [groupId, nickname, user_id]);
        
        return result;  // 추가된 결과 반환
    } catch (err) {
        console.error('DAO addMemberToGroup error: ', err.stack);
        throw err;
    }
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
};

// 특정 noiselog 삭제
exports.deleteNoiseLog = async (id) => {
  const sql = 'DELETE FROM `noise_log` WHERE `id`=?';
  const [results] = await db.execute(sql, [id]);
  return results;
};

//퇴실
exports.removeMemberFromGroup = async (userId, groupId) => {
    try {
        const query = 'DELETE FROM group_members WHERE user_id = ? AND group_id = ?';
        const [result] = await db.query(query, [userId, groupId]);
        return result;
    } catch (error) {
        console.error('DAO removeMemberFromGroup error: ', error.stack);
        throw error;
    }
};


/* ALTER */

//isonline
exports.updateIsOnline = async (userId) => {
    try {
        // 1. SQL 쿼리 작성: is_online 값을 반전시키는 쿼리
        const query = `
            UPDATE users
            SET is_online = CASE
                WHEN is_online = 0 THEN 1
                ELSE 0
            END
            WHERE id = ?
        `;

        // 2. 쿼리 실행
        const [result] = await db.query(query, [userId]);

        // 3. 업데이트된 사용자 정보 조회
        if (result.affectedRows > 0) {
            const selectQuery = 'SELECT id, is_online FROM users WHERE id = ?';
            const [users] = await db.query(selectQuery, [userId]);
            return users[0]; // 업데이트된 사용자 정보 반환
        } else {
            return null; // 해당 ID의 사용자가 없는 경우 null 반환
        }
    } catch (error) {
        // 4. 오류 처리
        console.error('DAO updateIsOnline error: ', error.stack);
        throw error;
    }
};
