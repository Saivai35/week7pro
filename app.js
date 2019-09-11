let express = require('express');
let ejs = require('ejs');
let bodyParser = require('body-parser');
const mongodb = require('mongodb');
var mongoose = require('mongoose');

const Developer = require('./models/devSchema');
const Task = require('./models/taskSchema');

const url = 'mongodb://localhost:27017/week7DB';

mongoose.connect(url, function(err){
    if (err){
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
});

let app = express();

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use(express.static('public'));
app.use(express.static('images'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(8080);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/addnewdev', function(req, res){
    res.sendFile(__dirname+'/views/addnewdev.html');
});

app.post('/addnewdevpost', function(req, res){
    let details = req.body;
    var dev = new Developer({
        _id: new mongoose.Types.ObjectId(),
        devId: Math.round(Math.random()*1000),
        name: {
            firstName: details.dName,
            lastName: details.dLast
        },
        level: details.dLevel,
        address: {
            state: details.dState,
            suburb: details.dSuburb,
            street: details.dStreet,
            unit: details.dUnit
        }
    })

    dev.save(function(err){
        if (err) {throw err};
        console.log('New developer added to DB')
    })
    res.redirect('/listalldevs');
});

app.get('/addnewtask', function(req, res){
    res.sendFile(__dirname+'/views/addnewtask.html');
});

app.post('/newtaskpost', function(req, res){
    let details = req.body;
    var newTask = new Task({
        _id: new mongoose.Types.ObjectId(),
        taskId: Math.round(Math.random()*1000),
        taskName: details.tName,
        taskDate: details.tDate,
        taskDesc: details.tDesc,
        taskAssgn: details.tAssign,
        taskStatus: details.tStatus
    })

    newTask.save(function(err){
        if (err) throw err;
        console.log('New task added to DB')
    })
    res.redirect('/listalltasks');
});


app.get('/listalltasks', function(req, res){
    Task.find({}, function (err, docs){
    res.render('tasklistpage.html', {taskDb:docs});
})
});

app.get('/listalldevs', function(req, res){
    Developer.find({}, function (err, docs){
    res.render('devlistpage.html', {devDb:docs});
})    
});      

app.get('/deletetask', function(req, res){
    res.sendFile(__dirname+'/views/deletetask.html');
});

app.post('/deletetaskpost', function(req, res){
    let del = req.body;
    let filter = parseInt(del.tDelId);
    Task.deleteOne({'taskId': filter}, function(err, doc){
        console.log(doc);
    });
    res.redirect('/listalltasks');
});

app.get('/deletecomplete', function(req, res){
    res.sendFile(__dirname+'/views/deletecomplete.html');
});

app.post('/deletecompletepost', function(req, res){
    Task.deleteMany({'taskStatus': 'Complete'}, function(err, doc){
        console.log(doc);
    });
    res.redirect('/listalltasks')
});

app.get('/updatestatus', function(req, res){
    res.sendFile(__dirname+'/views/updatestatus.html');
});

app.post('/updatestatuspost', function(req, res){
    let details = req.body;
    Task.updateOne({'taskId': parseInt(details.tUpId)}, {$set: {'taskStatus': details.tNewStatus}}, function(err, doc){
        console.log(doc);
    });
    res.redirect('/listalltasks');
});

