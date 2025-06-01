// DAO를 이용해 user-log 데이터 받아옴
// && 데이터 처리

const e = require('express');
const userDao = require('../dao/user-dao');

/* SELECT */
// 본인 정보 조회
exports.getUserById = async (id) => {
    const result = await userDao.getUserById(id);
    return result;
};

// 이메일 중복 검사 
exports.checkEmail = async (email) => {
    const result = await userDao.checkEmail(email);
    return result;
}

/* INSERT */
// 회원가입:
//  이메일 형식 유효성 검사 > 이메일 중복 검사
//     > 비밀번호 유효성 검사 > 비밀번호 암호화 > DB에 생성
exports.signUp = async (email, password) => {
    
    // 이메일 형식 유효성 검사 
    if(!validateEmailFormat(email)) {
        throw new Error("invalid email format");
    }

    // 이메일 중복 검사
    const isDuplicateEmail = await userDao.checkEmail(email); // 중복O > true 반환
    if(isDuplicateEmail) {
        throw new Error("duplicated email");
    }

    // 비밀번호 형식 유효성 검사
    if(!validatePWFormat(password)) {
        throw new Error("invalid password format");
    }

    // 비밀번호 암호화  // 로그인 기능 완성 후 추가


    const result = await userDao.signUp(email, password);
    return result;
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
    return result;
};

/* UPDATE */
// 본인 정보 수정
exports.updateUserById = async (id, name, isOnline) => {
    const columnsForUpdate = [];    // 수정할 칼럼들
    const valuesForUpdate = [];     // 수정할 칼럼들의 new values

    // 수정할 칼럼 리스트
    if(name !== undefined && name !== null && name !== "") { // name에 빈값 아니면 수정
        columnsForUpdate.push("`name`=?");
        valuesForUpdate.push(name);
    }
    if(isOnline !== undefined && isOnline !== null && isOnline !== "") { // name에 빈값 아니면 수정
        columnsForUpdate.push("`is_online`=?");
        valuesForUpdate.push(isOnline);
    }

    // update할 column X >>> update 하지 않음
    if(columnsForUpdate.length === 0) {
        const err = new Error("수정할 사용자정보 없음");
        err.status = 400;   
        throw err;
    }

    const result = await userDao.updateUserById(id, columnsForUpdate, valuesForUpdate);
    return result;
};