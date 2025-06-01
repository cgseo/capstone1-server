// user 관련 client의 request 처리, Rest API 엔드포인트 정의
const userService = require('../service/user-service');

/* SELECT */
// 본인 정보 조회
exports.getUserById = async (req, res) => {
    const id = req.query.id;

    try {
       const result = await userService.getUserById(id);
       console.log("user_controller-info:", id);
       res.json(result);
       } catch (err) {
           console.error('user-controller-getUser: ', err.message);
           res.status(err.status || 500).json({error: err.message || 'server error: failed to get user info'});
       }
};

// 로그인
exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const id = await userService.login(email, password);
        console.log("user-controller-login: ", id);
        res.json(id); // db에서 auto_increment로 생성된 id 반환
    } catch (err) {
        console.error('user-controller-signUp: ', err.stack);
        res.status(err.status || 500).json({error: err.message || 'server err: failed to login'});
    }
};

exports.checkEmail = async (req, res) => {
    const email = req.body.email;

    try {
        const isDuplicated = await userService.checkEmail(email);
        console.log("user-controller-checkEmail: ", isDuplicated);
        res.json(isDuplicated); // 중복O: true, X: false
    } catch (err) {
        console.error('user-controller-checkEmailDuplication: ', err.stack);
        res.status(500).json('server err: failed to check email duplication');
    }
}

/* INSERT */
// 회원가입
exports.signUp = async (req, res) => {
    // const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const id = await userService.signUp(email, password);
        console.log("user-controller-signUp: ", id, email, password);
        res.json(id); // db에서 auto_increment로 생성된 id 반환
    } catch (err) {
        console.error('user-controller-signUp: ', err.message);
        res.status(500).json({error: err.message || 'server err: failed to sign up'});
    }
};

/* DELETE */
// 계정 삭제
exports.deleteUserById = async (req, res) => {
    const id = req.query.id;

    try {
        const affectedRows = await userService.deleteUserById(id);
        console.log(`user-controller-delete: ${affectedRows}개 삭제`);
        res.json(affectedRows);  // 삭제된 행의 수 반환
    } catch (err) {
        console.error('user-controller-delete: ', err.stack);
        res.status(500).json({error: `failed to delete user(id:${id})`});
    }
};


/* UPDATE */
// 본인 정보 수정
exports.updateUserById = async (req, res) => {
    const name = req.body.name;
    const id = req.body.id;
    const isOnline = req.body.is_online;
    const password = req.body.password;
    
    try {
        const changedRows = await userService.updateUserById(id, name, isOnline, password);
        console.log("user-controller-updateinfo: ", `${changedRows}행 수정`);
        res.json(changedRows);   // 수정된 경우: 1 / 수정X: 0 반환
    } catch (err) {
        console.error('user-controller-update: ', err.message);
        res.status(500).json({error: 'failed to update user info'});
    }
};