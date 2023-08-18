let http = require('http');
let express = require('express');
let app = express();

//포트설정
// 3000 --> 리액트에서 사용
app.set('port',process.env.PORT||5000);

//express 객체 이용 http 서버 생성
http.createServer(app).listen(app.get('port'), ()=>{
    console.log('express 이용 웹서버 생성(listening)');
})

// 사용자의 요청 처리 ('/' 에 대한 처리)
// app.get('/', (req, res)=>{
//     res.send('Welcome Nodejs express server @!!');
// });

//첫번째 미들웨어 설정
//get 방식으로 전달되는 데이터를 가져와 보기 
// app.use((req, res, next)=>{
//     console.log('첫번째 미들웨어!!');
//     let userAgent = req.header('User-Agent');
//     //get 방식 전송에 대한 데이터 처리(query)
//     //localhost:5000/?name=hong --> 처리
//     let userInfo = req.query.name;
//     //res.send('browser info : ' + userAgent + '<br>' +
//     //         'name : ' + userInfo);

//     //다음 미들웨어 처리하도록 next() 명령어 추가
//     next();

// })

// 특정 폴더를 url 접근할 수 있도록 설정
// localhost:5000/public/login.html

let static = require('serve-static');
let path = require('path');

let pathName = path.join(__dirname, 'public');
console.log('path : ' + pathName);
//localhost:5000/public/ -->  public 폴더 접근 가능
app.use('/public', static(pathName)); 
//localhost:5000/ -->  public 폴더 접근 가능
app.use(static(pathName)); 


//두번째 미들웨어
//post 방식으로 서버에 전달되는 데이터를 가져오는 연습
//name=hong&age=20 --> x-www-form-urlencoded
app.use(express.urlencoded());
//{"name":"hong", "age":20} : json  형식 처리 
app.use(express.json());

// app.use((req, res)=>{
//     console.log("두번째 미들웨어 처리(post 방식 처리) ");
//     let id = req.body.id || req.query.id;
//     let password = req.body.password || req.query.password;
//     res.send('id : ' + id + ' , ' + 'password : ' + password);
// })

//라우터 처리
let router = express.Router();
// 중요 !! --> localhost:5000/ --> 
// '/' url로 입력되면, 라우터로 연결시키기 위한 코드
app.use('/', router);

// 코드
router.route('/process/login/').post((req, res)=>{
    console.log('/process/login(post) --> ');
    let id = req.body.id || req.query.id;
    let password = req.body.password || req.query.password;
    res.send(`'(router) id : ${id}, password : ${password}`);
});

router.route('/process/login/:name').post((req, res)=>{
    console.log('/process/login(post with name) --> ');
    let id = req.body.id || req.query.id;
    let password = req.body.password || req.query.password;
    let name=req.params.name;
    res.send(`'(router with param) id : ${id}, password : ${password}, name : ${name}`);
});

router.route('/process/login').get((req, res)=>{
    console.log('/process/login(get) --> ');
    let id = req.body.id || req.query.id;
    let password = req.body.password || req.query.password;
    res.send(`'(router) id : ${id}, password : ${password}`);
});

app.all('*',(req, res)=>{
    console.log('라우터 패스에 해당되는 내용이 없음');
    res.status(404).send('요청한 페이지는 찾을 수 없습니다. 체크하세요.');
})