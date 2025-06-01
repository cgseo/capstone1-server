// DAO를 이용해 user-log 데이터 받아옴
// && 데이터 처리

const userDao = require('../dao/user-dao');

/* SELECT */
// 본인 정보 조회
exports.getUserById = async (id) => {
    const result = await userDao.getUserById(id);

    // db에 일치하는 id를 가진 레코드가 없음
    if(result.length === 0) {
        const err = new Error("user not found");
        err.status = 404;
        throw err;
    }

    return result[0];
};

// 로그인 
exports.login = async (email, password) => {
    const result = await userDao.login(email, password);
    
    // 이메일과 비번이 일치하지 않음
    if (result.length === 0) {   
        const err = new Error("failed to login: unauthorized");
        err.status = 401;
        throw err;
    }

    return result[0]; // id 반환
};

// 이메일 중복 검사 
async function checkEmail(email) {
    const result = await userDao.checkEmail(email);
    return (result.length > 0); // 입력한 이메일과 일치하는 레코드 존재 시 true 반환
}
exports.checkEmail = checkEmail;

// 비밀번호 일치 검사
exports.checkPassword = async function (id, password) {
    const result = await userDao.checkPassword(id, password);
    return (result.length > 0); // 입력한 id와 password가 일치하는 레코드 존재 시 true 반환
};

/* INSERT */
// 회원가입:
//  이메일 형식 유효성 검사 > 이메일 중복 검사
//     > 비밀번호 유효성 검사 > 비밀번호 암호화 > DB에 생성
exports.signUp = async (email, password) => {
    
    // 이메일 형식 유효성 검사 
    if(!validateEmailFormat(email)) {
        throw new Error("failed to sign up: invalid email format");
    }

    // 이메일 중복 검사
    const isDuplicateEmail = await checkEmail(email); // 중복O > true 반환
    if(isDuplicateEmail) {
        throw new Error("failed to sign up: duplicated email");
    }

    // 비밀번호 형식 유효성 검사
    if(!validatePWFormat(password)) {
        throw new Error("failed to sign up: invalid password format");
    }

    // 비밀번호 암호화  // 로그인 기능 완성 후 추가


    const result = await userDao.signUp(email, password);
    return result.insertId; // 생성된 레코드의 id 반환환
};

// 이메일 형식 유효성 검사
function validateEmailFormat(email) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return regexEmail.test(email);  // 유효한 이메일 형식 > true 반환
}

// 비밀번호 형식 유효성 검사
function validatePWFormat(password) {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,}$/;
    return regexPassword.test(password);
}

// 비밀번호 암호화
function encryptPassword(password) {
    const encryptedPassword = "";
    return encryptedPassword;
}

/* DELETE */
// 계정 삭제
exports.deleteUserById = async (id) => {
    const result = await userDao.deleteUserById(id);
    return result.affectedRows; // 삭제한 행의 수 반환
};

/* UPDATE */
// 본인 정보 수정
exports.updateUserById = async (id, name, isOnline, password) => {
    const columnsForUpdate = [];    // 수정할 칼럼들
    const valuesForUpdate = [];     // 수정할 칼럼들의 new values

    // 수정할 칼럼 리스트
    if(name !== undefined) { // name에 빈값 아니면 수정
        columnsForUpdate.push("`name`=?");
        valuesForUpdate.push(name);
    }
    if(isOnline !== undefined) { 
        columnsForUpdate.push("`is_online`=?");
        valuesForUpdate.push(isOnline);
    }
    if(password !== undefined) {
        if(!validatePWFormat(password)) {
            throw new Error("failed to update user info: invalid password format");
        }
        columnsForUpdate.push("`password`=?");
        valuesForUpdate.push(password);
    }

    // update할 column X >>> update 하지 않음
    if(columnsForUpdate.length === 0) {
        return 0;
    }

    const result = await userDao.updateUserById(id, columnsForUpdate, valuesForUpdate);
    return result.changedRows;  // 수정된 행의 수 반환
};