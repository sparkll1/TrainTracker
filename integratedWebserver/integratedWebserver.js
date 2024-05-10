var express = require("express");
var app = express();
var sql = require("mssql");
require("dotenv").config();

let data=[];

<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
const config = {
    user: process.env.serverUsername,
    password: process.env.serverPassword,
    server: process.env.serverName,
    database: process.env.databaseName,
    encrypt: true,
    trustedConnection: true,
    trustServerCertificate: true
}
<<<<<<< Updated upstream
=======




function executeAddUserStatement(name, email, password) {
    console.log("execute name", name);  
    var request = new Request("EXEC dbo.AddUser @nickname, @email, @password;", function(err) {  
        if (err) {  
            console.log(err);
        } else {
            console.log("User added successfully");
        }
        
    });  
    //dont delete this. without this line, you get request error:collation
    connection.databaseCollation ='SQL_Latin1_General_CP1_CI_AS';

    request.addParameter('nickname', TYPES.NVarChar, name);  
    request.addParameter('email', TYPES.NVarChar , email);  
    request.addParameter('password', TYPES.NVarChar, password);  

    var result = "";  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            result+= column.value + " ";  
          }  
        });  
        console.log(result);  
        result ="";  
    });  

    request.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });

    connection.execSql(request);  
}

function readfromUserTable() {  
    var request = new Request("SELECT Name, Email, Password FROM User;", function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var result = "";  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            result+= column.value + " ";  
          }  
        });  
        console.log(result);  
        result ="";  
    });  

    request.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(request);  
}  

>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes


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

function executeAddUserStatement(connection, name, email, password) {
    console.log("execute name", name);
    var request = new sql.Request(connection);
    request.input('nickname', sql.NVarChar, name);
    request.input('email', sql.NVarChar, email);
    request.input('password', sql.NVarChar, password);
    request.execute('dbo.AddUser', (err, result) => {
        if (err) {
            console.log(err);
            if(err == 'RequestError: The email already exists.'){
                res.send('<script>alert("The email already exists.");</script>');
            }
            return;
        }
        connection.close();
    });
}

// Inside your '/api/users' route handler


app.post("/api/users", function(req, res){
    
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    var connection = new sql.ConnectionPool(config);
    connection.connect().then(function () {
        executeAddUserStatement(connection, name, email, password);
    }).catch(function (err) {
        console.log("CONNECTION ERROR: " + err);
    });

    let users = readUsersFromFile();
    users.push({"Name" : name, "Email": email, "Password": password});
    saveToServer(users, usersStorage);
    res.send("User info added successfully");
    res.end();
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

<<<<<<< Updated upstream
    userdata.push({ "name": name, "email": email, "password": password });
    saveUsersToFile(userdata);
    res.send("User info added successfully");
    res.end();
=======
    executeAddUserStatement(name, email, password);  

    let users = readUsersFromFile();
    users.push({"Name" : name, "Email": email, "Password": password});
    saveToServer(users, usersStorage);
    res.send("User info added successfully");
    res.end();
    

>>>>>>> Stashed changes
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