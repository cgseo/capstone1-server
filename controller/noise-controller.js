// noise-log 관련 client의 request 처리, Rest API 엔드포인트 정의
const noiseService = require('../service/noise-service');
const dayjs = require('dayjs');

/* SELECT */
exports.getNoiseLogByUserId = async (req, res) => {
    try {
    const userId = req.query.userId;
    console.log("noise_controller:", userId);

    const result = await noiseService.getNoiseByUserId(userId);
    res.json(result);
    } catch (err) {
        console.error('controller-getNoiseLogByUserId: ', err.stack);
        res.status(500).json({error: 'failed to get noises'});
    }
};

exports.getNoiseLogsByDate = async (req, res) => {
    try {
        const date = req.query.date;
        console.log('controller-selectedDate: ', date);
        const result = await noiseService.getNoiseLogsByDate(date);
        res.json(result);
    } catch (err) {
        console.error('controller-selectedDate: ', err.stack);
        res.status(500).json({err: 'failed to get noises'});
    }
}

exports.getMaxDecibelsForMonth = async (req, res) => {
    const userId = req.query.userId;
    const year = req.query.year;
    const month = req.query.month;
    try {
        const result = await noiseService.getMaxDecibelsForMonth(userId, year, month);
        res.json(result); 
    } catch (err) {
        console.error('controller-getMax_err: ', err.stack);
        res.status(500).json({error: 'failed to get max_db list'});
    }
}

/* INSERT */
exports.insertNoiseLog = async (req, res) => {
    const noiseLevel = req.body.noise_level;
    const logTime = req.body.log_time;
    console.log("logTime: ",logTime);
    const startTime = dayjs(req.body.start_time, 'MMM DD, YYYY hh:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
    const endTime = dayjs(req.body.end_time, 'MMM DD, YYYY hh:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
    const location = req.body.location;
    const maxDb = req.body.max_db;
    const userId = req.body.user_id;
    console.log(noiseLevel, logTime, startTime, endTime, location, maxDb, userId);
    try {
        const result = await noiseService.insertNoiseLog(noiseLevel, logTime, startTime, endTime, location, maxDb, userId);
        res.json(result.insertId); 
    } catch (err) {
        console.error('controller-insertNoise: ', err.stack);
        res.status(500).json({error: 'failed to get max_db list'});
    }
}

/* DELETE */
exports.deleteNoiseLog = async (req, res) => {
    const id = req.query.id;
    try {
        const result = await noiseService.deleteNoiseLog(id);
        console.log(`controller-delete-log: ${result.affectedRows}개 삭제`);
        res.json(result.affectedRows);  // 삭제된 행의 수 반환
    } catch (err) {
        console.error('controller-deleteNoiseLog: ', err.stack);
        res.status(500).json({error: `failed to delete noise log(id:${id})`});
    }
}