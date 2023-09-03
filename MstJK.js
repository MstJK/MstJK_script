const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// 비밀번호
const storedPassword = '803950';

// JSON 파싱을 위한 미들웨어 설정
app.use(bodyParser.json());

// POST 요청 처리
app.post('/check-password', (req, res) => {
  const clientPassword = req.body.password;

  if (clientPassword === storedPassword) {
    res.json({ success: true, message: '비밀번호가 일치합니다.' });
  } else {
    res.json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
  }
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
