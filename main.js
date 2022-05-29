const express = require("express"),
        app = express(),
        homeController = require("./controllers/homeController"),
        errorController = require("./controllers/errorController"),
        layouts = require("express-ejs-layouts"),
        bodyParser = require("body-parser"),
        memberController = require("./controllers/memberController"),
        db = require("./models/index"),
        models = require("./models")
        mysql = require("mysql");

db.sequelize.sync();

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");

app.use(layouts);

app.use(
express.urlencoded({
extended: true
})
);
app.use(express.static('public'));

const con = mysql.createConnection({
        host: '34.64.173.255',
        user: 'cc',
        password: 'password',
        database: 'SSPT'
});

con.connect(function(err) {
        if(err) throw err;
        console.log('DB Connected');
});

app.get("/", homeController.index);
app.get("/signUp", homeController.join);
app.get("/signUP", memberController.getAllMembers);
app.get("/job", homeController.job);
app.get("/friend", homeController.friend);

app.get("/test", homeController.testEnv);
app.get("/schedule1", homeController.schedule1);
app.get("/schedule2", homeController.schedule2);


/* 로그인 DB 연동*/
app.post("/", (req, res)=> {
        
        let mail = req.body.mail; 
        let pw = req.body.pw; 
        console.log(mail + " : " + pw); 
        const sql = 'SELECT * from members WHERE memberMail=? and password=?';

        con.query(sql, [mail,pw], function(err, results, fields) {
                if(err) throw err;
                if(results.length > 0) res.send('you are correct');
                else res.send('your input is wrong');
        })

        console.log("제출되었습니다");  
});  

/* 회원가입 DB 연동*/
// app.post("/join", homeController.joinCheck);
app.post("/signUp", (req, res) => {
    const sql = "INSERT INTO members SET ?"

    con.query(sql, req.body, function(err, result, fields) {
            if(err) throw err;
            console.log(result);
            res.render("signUpClear");
    });
});


// app.post('/signUp', (req, res) => {
//         console.log(req.body);
    
//         models.member.create({
//             email: req.body.memberMail,
//             name: req.body.memberName,
//             password: req.body.password
//         })
//             .then( result => {
//                 console.log("데이터 추가 완료");
//                 res.render("signUpClear");
//             })
//             .catch( err => {
//                 console.log(err)
//                 console.log("데이터 추가 실패");
//             })
//     });


/* 아르바이트 정보 DB 연동 */
app.post("/job", (req, res) => {
    const sql = "INSERT INTO parttime SET ?"

    con.query(sql, req.body, function(err, result, fields) {
            if(err) throw err;
           console.log(result);
            res.send("등록이 완료되었습니다.");
    });
});


app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
console.log(`Server running at http://localhost:${app.get("port")}`);
});