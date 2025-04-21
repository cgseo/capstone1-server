
const express = require('express');
const noiseRouter = require('./router/noise-router');
const noiseService = require('./service/noise-service');

const app = express();

// port 번호 설정
app.set('port', process.env.PORT || 3000);

// middleware
app.use(express.json());

// router 연결 제대로 됐는지 확인용 // 나중에 삭제
app.use((req, res, next) => {
  console.log('요청:', req.method, req.url);
  next();
});


// 서버 실행 시 
// mysql 실행 중이 아닐 때, 삭제되지 않은 expired-noise-logs 삭제
(async () => {
  try {
    const result = await noiseService.deleteExpiredNoiseLogs();
    console.log(`delete-expired-logs: ${result.affectedRows}개 삭제`);
  } catch (err) {
    console.log('err:delete-expired-noise-logs: ', err);
  }
})();

// routers 연결
app.use('/api/noise', noiseRouter);

// 서버 실행
app.listen(app.get('port'), () => {
  console.log('익스프레스 서버 실행');
});