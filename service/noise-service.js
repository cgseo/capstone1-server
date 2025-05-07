// DAO를 이용해 noise-log 데이터 받아옴
// && 데이터 처리

const noiseDao = require('../dao/noise-dao');

/* SELECT */
exports.getNoiseByUserId = async (userId) => {
    // 데이터 처리
    const result = await noiseDao.getNoiseLogByUserId(userId);
    return result;
};

exports.getNoiseLogsByDate = async (date) => {
    const result = await noiseDao.getNoiseLogsByDate(date);
    return result;
};

exports.getMaxDecibelsForMonth = async (userId, year, month) => {
    const result = await noiseDao.getMaxDecibelsForMonth(userId, year, month);
    return result;
};

/* INSERT */
exports.insertNoiseLog = async (noiseLevel, logTime, startTime, endTime, location, maxDb, userId) => {
    const result = await noiseDao.insertNoiseLog(noiseLevel, logTime, startTime, endTime, location, maxDb, userId);
    return result;
};

/* DELETE */
exports.deleteExpiredNoiseLogs = async () => {
    // 데이터 처리 
    const result = await noiseDao.deleteExpiredNoiseLogs();
    return result;
};

exports.deleteNoiseLog = async (id) => {
    const result = await noiseDao.deleteNoiseLog(id);
    return result;
};