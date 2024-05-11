var express = require("express");
var app = express();
var sql = require("mssql");
require("dotenv").config();

let data=[];

const config = {
    user: "parks13",
    password: "Password123",
    server: "golem.csse.rose-hulman.edu",
    database: "CtaL-TrainTrackerDB",
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



app.use('/static', express.static("public"));
var bodyParser =require("body-parser");
app.use('/api/',bodyParser.urlencoded({extended:true}) );
app.use('/api/', bodyParser.json());


app.put("/api/addReport", function(req, res) {
    var connection = new sql.ConnectionPool(config);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("station", req.body.station)
                .input("platform", req.body.platform)
                .input("time", req.body.time)
                .input("description", req.body.desc)
                .execute("AddReport").then(function (result) {
                    res.json({
                        "err": 0
                    });
                    res.status(200);
                    conn.close();
                }).catch(function (err) {
                    res.json({
                        "err": err.message
                    });
                    res.status(200);
                    connection.close();
                });
    }).catch(function (err) {
        console.log("CONNECTION ERROR: " + err);
    });
})


// Inside your '/api/users' route handler


app.put("/api/addUser", function(req, res){
    
      
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    var connection = new sql.ConnectionPool(config);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("name", name)
                .input("email", email)
                .input("password", password)
                .execute("AddUser").then(function (result) {
                    res.status(200).json({
                        "err": 0
                    });
                    connection.close(); // Close connection after sending response
                }).catch(function (err) {
                    res.status(200).json({
                        "err": err.message
                    });
                    connection.close(); // Close connection after sending response
                });
    }).catch(function (err) {
        console.log("CONNECTION ERROR: " + err);
    });


});




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

app.put("/api/checkLogin", function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    console.log("email: ", email);

    var connection = new sql.ConnectionPool(config);
    connection.connect().then(function() {
        var request = new sql.Request(connection);
        request.input("email", email)
            .input("password", password)
            .output("outputName", sql.VarChar(50))
            .output("outputID", sql.Int)
            .execute("CheckLogin").then(function(result) {
                res.status(200).json({
                    "outputName": result.output.outputName,
                    "outputID": result.output.outputID
                });

                connection.close(); // Close connection after sending response
            }).catch(function(err) {
                console.error("SQL EXECUTION ERROR: " + err);
                res.status(200).json({
                    "err": err.message
                });
                connection.close(); // Close connection after sending response
            });
    }).catch(function(err) {
        console.log("CONNECTION ERROR: " + err);
    });
});



app.post("/api/", function(req, res){
    let station = req.body.station;
    let platform = req.body.platform;
    let time = req.body.time;
    let desc = req.body.desc;

    data.push({"station" : station, "platform": platform, "time": time, "desc": desc});
    saveToServer(data);
    res.send("post successful");
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