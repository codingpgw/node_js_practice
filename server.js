const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
//app.use(express.static(__dirname + '/public'))

var db;

MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.kwj0mwb.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    if (에러)return console.log(에러)
    
    db = client.db('todoapp');
    
    app.listen(8080, function() {
      console.log('listening on 8080');
    })


    app.post('/add', function(요청, 응답){
        응답.send('전송완료');
        db.collection('counter').findOne({name: '게시물갯수'}, function(에러, 결과){
            console.log(결과.totalPost);
            var 총게시물갯수 = 결과.totalPost;

            db.collection('post').insertOne( {_id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date } , function(){
              console.log('저장완료');

              db.collection('counter').updateOne({name : '게시물갯수'},{ $inc : {totalPost : 1}},function(에러,결과){
                if(에러){return console.log(에러)}
              })
            //operator -> set, inc 등등 
            
            });
        });
    });

    
   
})

app.delete('/delete', function(요청, 응답){
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id);
    db.collection('post').deleteOne(요청.body,function(에러, 결과){
        console.log('삭제완료');
        응답.status(200).send({message : '성공했습니다.'});
    })
})

app.get('/list', function(요청, 응답){

    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs',{posts : 결과});
    });

})
app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({ _id : parseInt(요청.params.id) }, function(에러, 결과){
      응답.render('detail.ejs', {data : 결과} )
    })
});
app.get('/write', function(요청, 응답){
    응답.render('write.ejs')
})

app.get('/edit/:id', function(요청, 응답){
    
    db.collection('post').findOne({_id : parseInt(요청.params.id)},function(에러, 결과){
        console.log(결과)
        응답.render('edit.ejs', { post : 결과 })
    })
})

app.put('/edit',function(요청, 응답){
    db.collection('post').updateOne({_id : parseInt(요청.body.id) },{$set : 
        { 제목 : 요청.body.title, 날짜 : 요청.body.date}}, function(에러, 결과){
            console.log('수정완료')
            응답.redirect('/list')
    }) //폼에 담긴 제목 데이터, 날짜 데이터를 가지고 db.collection에 업데이트
})

app.get('/pet', function(요청, 응답) { 
    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
})

app.get('/beauty', function(요청, 응답){
    응답.send('뷰티 용품을 쇼핑할 수 있는 페이지입니다.');
})

app.get('/', function(요청, 응답){
    응답.sendFile(__dirname + '/index.html'); //이게  API (REST원칙에 맞춰 작성하자!)
});

// app.get('/write', function(요청, 응답){
//     응답.sendFile(__dirname + '/write.html');
// });

//app.get('/write', (요청, 응답 )*콜백함수 =>*function 대용 {
//     응답.sendFile(__dirname + '/write.html');
// })


// app.post('/add', function(요청, 응답){
//     응답.send('전송완료');
// })
// app.get('/add', function(요청, 응답){
//     응답.send('전송완료');
//     console.log(요청.body);
// })

