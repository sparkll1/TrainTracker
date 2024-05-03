var express = require("express");
var app = express();
var sql = require("mssql");
require("dotenv").config();
let data=[];
let userdata=[];

const config = {
    user: process.env.serverUsername,
    password: process.env.serverPassword,
    server: process.env.serverName,
    database: process.env.databaseName,
    encrypt: true,
    trustedConnection: true,
    trustServerCertificate: true
}


const logger = require("morgan");
app.use(logger('dev')); // giver helpful information serverside request
const fs = require("fs");
const serverSideStorage = "../data/db.json";

const usersStorage = "../data/userdb.json";

fs.readFile(serverSideStorage, function(err, buf){
    if(err){
        console.log("error: ", err);
    }else{
        data = JSON.parse(buf.toString() );
    }
    console.log("data read from file.");
});

function saveToServer(data){
    fs.writeFile(serverSideStorage, JSON.stringify(data), function(err, buf){
        if(err){
            console.log("error: ", err);
        }else{
            console.log("Data saved succesfully");
        }
    })
}

//read user info
function readUsersFromFile() {
    try {
        const data = fs.readFileSync(usersStorage, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading users file:', err);
        return [];
    }
}

function saveUsersToFile(users) {
    fs.writeFile(usersStorage, JSON.stringify(users, null, 4), (err) => {
        if (err) {
            console.error('Error saving users to file:', err);
        } else {
            console.log('Users saved to file');
        }
    });
}




app.use('/static', express.static("public"));
var bodyParser =require("body-parser");
app.use('/api/',bodyParser.urlencoded({extended:true}) );
app.use('/api/', bodyParser.json());


// app.put("/api/addReport", function(req, res) {
//     var connection = new sql.ConnectionPool(config);
//     connection.connect().then(function () {
//         var request = new sql.Request(connection);
//         request.input("station", req.body.station)
//                 .input("platform", req.body.platform)
//                 .input("time", req.body.time)
//                 .input("description", req.body.desc)
//                 .execute("AddReport").then(function (result) {
//                     res.json({
//                         "err": 0
//                     });
//                     res.status(200);
//                     conn.close();
//                 }).catch(function (err) {
//                     res.json({
//                         "err": err.message
//                     });
//                     res.status(200);
//                     connection.close();
//                 });
//     }).catch(function (err) {
//         console.log("CONNECTION ERROR: " + err);
//     });
// })


//read all
//if client do something we get data
app.get("/api/", function(req, res){
    res.send(data);
    res.end();
} );

app.get("/api/users", function(req, res){
    let users = readUsersFromFile();
    res.send(users);
    res.end();
} );


//create
//put the client data to our db json
app.post("/api/", function(req, res){
    let station = req.body.station;
    let platform = req.body.platform;
    let time = req.body.time;
    let desc = req.body.desc;

    data.push({"station" : station, "platform": platform, "time": time, "desc": desc});
    saveToServer(data);
    res.send("post successful");
    res.end();
} );

app.post("/api/users", function(req, res){
  
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    userdata.push({ "name": name, "email": email, "password": password });
    saveUsersToFile(userdata);
    res.send("User info added successfully");
    res.end();
});


//read one
app.get("/api/id/:id", function(req, res){
    let id = parseInt(req.params.id);
    let result = data[id];
    res.send(result);
    res.end();
}).put("/api/id/:id", function(req, res){
    let id = parseInt(req.params.id);
    let station = req.body.station;
    let platform = req.body.platform;
    let time = req.body.time;
    let desc = req.body.desc;

    data[id] = ({"station" : station, "platform": platform, "time": time, "desc": desc});
    saveToServer(data);
    res.send("put successful");
    res.end();
}).delete("/api/id/:id", function(req, res){
    let id = parseInt(req.params.id);
    data.splice(id,1);
    saveToServer(data);
    res.send("Delete successful");
    res.end();
});

//read user info

app.get("/api/users/:id", function(req, res){
    let id = parseInt(req.params.id);
    let result = userdata[id];
    res.send(result);
    res.end();
});


app.get("/api/users/:id", function(req, res){
    let id = parseInt(req.params.id);
    let users = readUsersFromFile();
    let result = users[id];
    res.send(result);
    res.end();
});

// app.put("/api/users/:id", function(req, res){
//     let id = parseInt(req.params.id);
//     let name = req.body.name;
//     let email = req.body.email;
//     let password = req.body.password;

//     userdata[id] = ({"name" : name, "email": email, "password": password});
//     saveUsersToFile(userdata);
//     res.send("put successful");
//     res.end();
    
// });
app.put("/api/users/:id", function(req, res){
    let id = parseInt(req.params.id);
    let users = readUsersFromFile();
    let { username, email } = req.body;

    users[id] = { "username": username, "email": email };
    saveUsersToFile(users);

    res.send("User info updated successfully");
    res.end();
});


app.listen(3000);