let http=require('http');
let express=require('express');
let app=express();

app.set('port', process.env.PORT || 5000);

let server=http.createServer(app).listen(app.get('port'),()=>{
    console.log('express 이용하여 서버 생성 후 리스닝!');
});

//mysql 설정(커넥션 풀 이용하여 디비 접근)
let mysql=require('mysql');
let pool=mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'111111',
    database:'reactdb',
    debug:false
});

//특정 폴더에 url로 접근위한 설정
let static=require('serve-static');
let path=require('path');
const { error } = require('console');

let pathName=path.join(__dirname,'public');
console.log('pathName: '+pathName);
app.use('/public', static(pathName)); //pathname을 '/public'으로 접근
app.use(static(pathName)); // '/public' 폴더를 '/' 접근 가능

//post 방식으로 전달되는 데이터를 가져오기 위한 설정
//application/x-www-form-urlencoded(name=hong)
app.use(express.urlencoded());
//application/json({"name":"hong"})
app.use(express.json());

//라우터 이용 사용자 요청 처리
let router=express.Router();
app.use('/', router);
//전체 데이터 읽어서 클라이언트에 전달하는 요청에 대한 처리
router.route('/api/customerList').all((req,res)=>{
    console.log('/api/customerList-> ');
    pool.getConnection((error, conn)=>{
        if(error){
            console.log('getConnection() 에러 발생 -> '+error);
            if(conn){
                conn.release();
            }
            return;
        }

        //let sql='select * from customerInfo';
        let sql='select * from customerinfo where isDeleted=0';
        conn.query(sql, (error, results)=>{
            if(error){
                console.log('query() 에러 발생 -> ' + error);
                return;
            }
            //결과는 리액트 클라이언트로 전송
            res.send(results);
        })
    })
})

//데이터 저장에 요청 처리
const multer = require('multer');
const upload=multer({dest:'./upload'}); //클라이언트로부터 전달되는 파일 데이터를 upload 파일에 저장하기 위해 설정

router.route('/api/customerUpload').all(upload.single('file'), (req,res)=>{
    console.log('/api/customerUpload -> ');
    let image='/img/'+req.file.originalname;
    console.log(req.file);
    let name=req.body.username || req.query.username;
    let birthday=req.body.birthday || req.query.birthday;
    let job=req.body.job || req.query.job;
    console.log(`image: ${image}, name: ${name}, birthday: ${birthday}, job: ${job}`);

    pool.getConnection((error,conn)=>{
        if(error){
            console.log('getConnection() 에러 발생 -> '+error);
            if(conn){
                conn.release();
            }
            return;
        }
        // let params=[null, image, name, birthday, job];
        // let sql='insert into customerinfo value(?,?,?,?,?)';
        let params=[null, image, name, birthday, job,0];
        let sql='insert into customerinfo value(?,?,?,?,?,?)';
        conn.query(sql, params, (error, results)=>{
            if(error){
                console.log('query() 에러 발생 -> '+error);
                return;
            }
            res.send(results);
        })
    })
})

router.route('/api/customerDelete').all((req, res)=>{
    console.log('/api/customerDelete-> ');
    let id=req.body.id || req.query.id;
    console.log(`id:${id}`);

    pool.getConnection((error, conn)=>{
        if(error){
            console.log('getConnection() 에러' +error);
            if(conn)
                conn.release();
            return;
        }
        let sql='update customerinfo set isDeleted=1 where id=?';
        let params=[id];
        conn.query(sql, params,(error, results)=>{
            if(error){
                console.log('query() 에러 발생'+error);
                return;
            }
            res.send(results);
        })
    })
})

router.route('/api/customerModify').all(upload.single('file'),(req,res)=>{
    console.log('/api/customerModify->');
    let image='/img/'+req.file.originalname;
    let name=req.body.username || req.query.username;
    let job=req.body.job || req.query.job;
    let birthday=req.body.birthday || req.query.birthday;
    let id=req.body.id || req.query.id;

    console.log(`image: ${image}, name: ${name}, job:${job}, birthday: ${birthday}, id: ${id}`);

    pool.getConnection((error,conn)=>{
        if(error){
            console.log('getConnection() 에러 발생 -> '+error);
            if(conn){
                conn.release();
            }
            return;
        }
        let params=[ image, name, birthday, job, id];
        let sql='update customerinfo set image=?, name=?, birthday=?, job=? where id=?';
        conn.query(sql, params, (error, results)=>{
            if(error){
                console.log('query() 에러 발생 -> '+error);
                return;
            }
            res.send(results);
        })
    })

})