const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended : true}));
const { MongoClient } = require('mongodb');
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
//app.use(express.static(__dirname + '/public'))

let db;

const url = 'mongodb+srv://admin:qwer1234@cluster0.kwj0mwb.mongodb.net/?retryWrites=true&w=majority';
new MongoClient(url).connect().then((client) => {
   
    console.log('db연결성공')
    db = client.db('todoapp');
    
    app.listen(8080, function() {
      console.log('listening on 8080');
    })


    app.post('/add', async (요청, 응답) => {
        응답.send('전송완료');
        let add_result = await db.collection('counter').findOne({name: '게시물갯수'})
            console.log(add_result.totalPost);
            var 총게시물갯수 = add_result.totalPost;

            await db.collection('post').insertOne({
                _id: 총게시물갯수 + 1,
                제목: 요청.body.title,
                날짜: 요청.body.date
            });
            
            await db.collection('counter').updateOne(
                { name: '게시물갯수' },
                { $inc: { totalPost: 1 } }
            );
            //operator -> set, inc 등등 
            
    });

}).catch((err)=>{
    console.log(err)
})

app.delete('/delete', async (요청, 응답) => {
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id);
    let del_result = await db.collection('post').deleteOne(요청.body)
        console.log('삭제완료');
        응답.status(200).send({message : '성공했습니다.'});
})

app.get('/list', async (요청, 응답) => {

    let result = await db.collection('post').find().toArray() 
        console.log(result);
        응답.render('list.ejs',{posts : result});

})

app.get('/detail/:id', async (요청, 응답) => {
    let detail_result = await db.collection('post').findOne({ _id : parseInt(요청.params.id) })

      응답.render('detail.ejs', {data : detail_result} )

});
app.get('/write', function(요청, 응답){
    응답.render('write.ejs')
})

app.get('/edit/:id', async (요청, 응답) => {
    
    let edit_result = await db.collection('post').findOne({_id : parseInt(요청.params.id) })
        console.log(edit_result)
        응답.render('edit.ejs', { post : edit_result })
    
})

app.put('/edit', async (요청, 응답) => {
    let e_result = await db.collection('post').updateOne({_id : parseInt(요청.body.id) },{$set : 
        { 제목 : 요청.body.title, 날짜 : 요청.body.date}})
            console.log('수정완료')
            응답.redirect('/list')
     //폼에 담긴 제목 데이터, 날짜 데이터를 가지고 db.collection에 업데이트
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

