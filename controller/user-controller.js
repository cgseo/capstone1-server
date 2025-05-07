// user 관련 client의 request 처리, Rest API 엔드포인트 정의
const userService = require('../service/user-service');

/* SELECT */
// 본인 정보 조회
exports.getUserById = async (req, res) => {
    try {
       const id = req.query.id;
       console.log("user_controller:", id);
       const result = await userService.getUserById(id);
       res.json(result);
       } catch (err) {
           console.error('user-controller-getUser: ', err.stack);
           res.status(500).json({error: 'failed to get user info'});
       }
};

/* INSERT */
// 계정 생성
exports.insertUser = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const deviceId = req.body.device_id;

    console.log("user-controller-insert: ", name, deviceId);
    try {
        const result = await userService.insertUser(name, deviceId);
        res.json(result.insertId); // db에서 auto_increment로 생성된 id 반환
    } catch (err) {
        console.error('user-controller-insert: ', err.stack);
        res.status(500).json({error: 'failed to insert user'});
    }
};

/* DELETE */
// 계정 삭제
exports.deleteUserById = async (req, res) => {
    const id = req.query.id;
    try {
        const result = await userService.deleteUserById(id);
        console.log(`user-controller-delete: ${result.affectedRows}개 삭제`);
        res.json(result.affectedRows);  // 삭제된 행의 수 반환
    } catch (err) {
        console.error('user-controller-delete: ', err.stack);
        res.status(500).json({error: `failed to delete user(id:${id})`});
    }
};


/* UPDATE */
// 본인 정보 수정
exports.updateUserById = async (req, res) => {
    try {
        console.log("body:", req.body);
        const name = req.body.name;
        const id = req.body.id;
        console.log("user_controller-update:", id, name);

        const columnsForUpdate = [];    // 수정할 칼럼들
        const valuesForUpdate = [];     // 수정할 칼럼들의 new values

        // 수정할 칼럼 리스트
        // todo: 만약 ""이나 null값 들어오면 status(400) 보낼건지 아님 걍 undefined랑 같은 취급할 건지
        if(name !== undefined) {
            columnsForUpdate.push("`name`=?");
            valuesForUpdate.push(name);
        }

        // update할 column X >>> update 하지 않음
        if(columnsForUpdate.length === 0) {
            return res.status(400).json({ message: "no need to update"});
        }

        // update
        const result = await userService.updateUserById(id, columnsForUpdate, valuesForUpdate);
        res.json(result.changedRows);   // 수정된 경우: 1 / 수정X: 0 반환
    } catch (err) {
        console.error('user-controller-update: ', err.stack);
        res.status(500).json({error: 'failed to update user info'});
    }
};