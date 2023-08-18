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

router.route('/process/addUser').post((req,res)=>{
    console.log('/process/addUser ---> ');

    let id=req.body.id || req.query.id;
    let password=req.body.password || req.query.password;
    let name=req.body.name || req.query.name;
    let age=req.body.age || req.query.age;

    console.log(`id:${id}, password:${password}, name:${name}, age:${age}`);
    //커넥션 풀 이용하여 디비에 저장
    age=Number(age); //디비에 숫자로 데이터타입이 설정
    //커넥션 풀을 이용하여 디비에 저장
    pool.getConnection((err,conn)=>{
        if(err){
            console.log('getConnection() 에러 발생-> '+err);
            if(conn){
                conn.release();
            return;
            }
        }
        let data=[id, password, name, age];
        let sql='insert into users (id, password, name, age)' + 'values (?,?,?,?)';

        conn.query(sql,data, (err, results)=>{
            if(err){
                console.log('query 실행 시 에러 발생 ->'+err);
                return;
            }
            if(results){
                res.send(`사용자 추가 성공! -> id: ${id}, name: ${name} `);
            }
            else{
                res.send('사용자 추가 실패!');
            }
        })
    })
})

router.route('/process/listUser').post((req, res)=>{
    console.log('/process/listUser --> ');

    pool.getConnection((error, conn)=>{
        if(error){
            console.log('getConnecton() 에러 발생 -> ' +err);
            if(conn)
                conn.release();
            return;
        }
        conn.query('select * from users',(error, results)=>{
            if(error){
                console.log("query() 실행 시 오류 발생" + err);
                return;
            }
            if(results.length > 0){
                res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
                res.write('<h2> 사용자 리스트 보기 </h2>');
                res.write('<div><ul>');
                for(let i=0; i<results.length; i++){
                    let id=results[i].id;
                    let name=results[i].name;

                    res.write(`<li> id: ${id}, name: ${name} </li>`)
                }
                res.write('</ul></div>');
                //end() 이용하여 데이터 전송
                res.end();
            }
            else{
                res.send('사용자 리스트 없음!')
            }
        } )
    })
})

