// DAO를 이용해 user-log 데이터 받아옴
// && 데이터 처리

const userDao = require('../dao/user-dao');
const bcryptjs = require('bcryptjs');   // 비밀번호 암호화

// 비밀번호 암호화 함수
async function hashPassword(plain) {
    const salt = 10;
    const hashedPW = await bcryptjs.hash(plain, salt);
    return hashedPW;
}

// 비밀번호 해시값 비교
async function comparePassword(plain, hashed) {
    const isMatch = await bcryptjs.compare(plain, hashed);
    return isMatch;
}

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
    // 가입되어있는 이메일인지 확인
    const isRegistered = await checkEmail(email);
    if(!isRegistered) {
        const err = new Error("failed to login: email is not registerd");
        err.status = 401;
        throw err;
    }

    // email로 db에서 사용자의 hashed password 가져오기
    const hasedPWInDB = (await userDao.getPasswordByEmail(email))[0].password;
    
    // 비밀번호 일치하는지 확인
    const isMatchWithDB = await comparePassword(password, hasedPWInDB);
    // 이메일과 비번이 일치하지 않음
    if (!isMatchWithDB) {   
        const err = new Error("failed to login: unauthorized");
        err.status = 401;
        throw err;
    }

    const result = await userDao.getIdByEmail(email);

    return result[0]; // id 반환
};

// 이메일 중복 검사 
async function checkEmail(email) {
    const result = await userDao.checkEmail(email);
    return (result.length > 0); // 입력한 이메일과 일치하는 레코드 존재 시 true 반환
}
exports.checkEmail = checkEmail;


/* INSERT */
// 회원가입:
//  이메일 유효성 검사 > 이메일 중복 검사
//     > 비밀번호 유효성 검사 > 비밀번호 암호화 > DB에 생성
exports.signUp = async (email, password) => {
    
    // 이메일 유효성 검사 
    if(!validateEmailFormat(email)) {
        const err = new Error("failed to sign up: invalid email format");
        err.status = 400;
        throw err;
    }

    // 이메일 중복 검사
    const isDuplicateEmail = await checkEmail(email); // 중복O > true 반환
    if(isDuplicateEmail) {
        const err = new Error("failed to sign up: duplicated email");
        err.status = 400;
        throw err;
    }

    // 비밀번호 유효성 검사
    if(!validatePWFormat(password)) {
        const err = new Error("failed to sign up: invalid password format");
        err.status = 400;
        throw err;
    }

    // 비밀번호 암호화
    const hasedPassword = await hashPassword(password);

    // db에 user 레코드 추가
    const result = await userDao.signUp(email, hasedPassword);
    return result.insertId; // 생성된 레코드의 id 반환
};

// 이메일 유효성 검사 함수
function validateEmailFormat(email) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return regexEmail.test(email);  // 유효한 이메일 형식 > true 반환
}

// 비밀번호 유효성 검사 함수
function validatePWFormat(password) {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,}$/;
    return regexPassword.test(password);
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
        if(!validatePWFormat(password)) {   // 비밀번호 유효성 검사
            const err = new Error("failed to update user info: invalid password format");
            err.status = 400;
            throw err;
        }
        columnsForUpdate.push("`password`=?");
        const hashedPassword = await hashPassword(password);    // 비밀번호 암호화
        valuesForUpdate.push(hashedPassword);
    }

    // update할 column X >>> update 하지 않음
    if(columnsForUpdate.length === 0) {
        return 0;   // 수정된 행의 수(0개) 반환
    }

    const result = await userDao.updateUserById(id, columnsForUpdate, valuesForUpdate);
    return result.changedRows;  // 수정된 행의 수 반환
};