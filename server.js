var id  = 1;

// call the packages we need
var express                             = require('express')      // call express
var bodyParser = require('body-parser')
var app        = express()     // define our app using express

const MongoClient = require('mongodb').MongoClient


app.use(express.static(__dirname + "/public"));
// configure app to use bodyParser() and ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');

// get an instance of the express Router
var router = express.Router();

// a “get” at the root of our web app: http://localhost:3000/api
router.get('/', function(req, res) {
  console.log("get");  //logs to terminal

  db.collection('example').find({}).toArray((err, result2) => {
    id = (result2.length) + 1;
    console.log(id)
    res.render('index.ejs',{example:result2});
  })  //renders index page in browser
});

router.get('/edit', function(req, res) {
  console.log("get");  //logs to terminal
  var editId = parseInt(req.query.id);
  console.log(editId)
  db.collection('example').find({id:editId}).toArray((err, result2) => {
    console.log(result2)
    res.render('edit.ejs',{lunch:result2});
  })  //renders index page in browser
});

//req.query.id

router.post('/editSubmit' ,  function(req, res) {
  var editId = parseInt(req.body.id);
  var name = req.body.editName;
  console.log("the edit ID is " + editId)
  var myquery = { id: editId };
  var newvalues = { $set: {myLunch: name, id: editId } };
  db.collection("example").updateOne(myquery, newvalues, function(err, result) {
  if (err) throw err;
  console.log("1 document updated");
  db.collection('example').find({}).toArray((err, result2) => {
    res.render('index.ejs',{example:result2});
  })
});
});

router.post('/addDays', function(req, res) {
  console.log("post");  //logs to terminal
  var lunch = req.body.favFood;


  db.collection("example").insertOne({myLunch: lunch, id:id}, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted");
    });

    db.collection('example').find({}).toArray((err, result2) => {
      id = (result2.length) + 1;
      console.log(result2)
      console.log("it been good")
      res.render('index.ejs', {example:result2});
    })


});


router.post('/deleteBut', function(req, res){
  //var name = req.body.deleteName
  var pageId = parseInt(req.body.id)
  console.log("the idea is " + pageId)
  db.collection("example").deleteOne({id: pageId}, function(err,result) {
    if (err) throw err;
    console.log("deleted " + pageId);

  })

  db.collection('example').find({}).toArray((err, result2) => {
    console.log(result2)
    console.log("it been good")
    res.render('index.ejs', {example:result2});
  })

});




// all of our routes will be prefixed with /api
app.use('/api', router);



var db
MongoClient.connect("mongodb://alex:denny123@ds227243.mlab.com:27243/crud",{useNewUrlParser:true}, function(err, client) {
    if(err) { console.log(err) }
    console.log("Connected successfully to server");
    db = client.db("crud");
    app.listen(3000, () => {
        console.log('meow')
    })
})




/*

db.collection('example').find().toArray((err, result) => {
    res.render('diffPage.ejs', {users: result});
  })
*/
