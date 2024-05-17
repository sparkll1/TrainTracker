var express = require("express");
var app = express();
var sql = require("mssql");
require("dotenv").config();
let data=[];

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

//import info
const routesFile = "../importData/routes.txt";
const stopsFile = "../importData/stops.txt";

function importLines(callback) {
    const lineNameIndex = 2;
    const routeTypeIndex = 3;
    const lTrainRouteType = 1;

    let lines=[];

    fs.readFile(routesFile, 'utf8', (err, data) => {
        if(err) {
            console.log("error: ", err);
            return;
        }
    
        const routes = data.trim().split('\n');
    
        routes.slice(1).forEach(route => {
            const vals = route.split(',');
            if (vals[routeTypeIndex] == lTrainRouteType) {
                let lineName = vals[lineNameIndex];
                lineName = lineName.replace(/"/g, '').replace(' Line', '');
                lines.push(lineName);
            }
        });

        callback(null, lines);
    });
}

function importStations(callback) {
    const stationNameIndex = 2;
    const stopTypeIndex = 6;
    const stationStopType = 1;
    const latIndex = 4;
    const lonIndex = 5;

    let stations=[];

    fs.readFile(stopsFile, 'utf8', (err, data) => {
        if(err) {
            console.log("error: ", err);
            return;
        }
    
        const stops = data.trim().split('\n');
    
        stops.slice(1).forEach(stop => {
            const vals = stop.split(',');
            if (vals[stopTypeIndex] == stationStopType) {
                let station = [];
                station.push(vals[stationNameIndex].replace(/"/g, ''));
                station.push(vals[latIndex]);
                station.push(vals[lonIndex]);
                stations.push(station);
            }
        });

        callback(null, stations);
    });

    return stations;
}

app.put("/importLines", function (req,res) {
    importLines((err, lines) => {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log(lines);
            var connection = new sql.ConnectionPool(config);
            connection.connect().then(function () {
                let promises = lines.map(line => {
                    var request = new sql.Request(connection);
                    return request.input("LineName", line).execute("AddLine");
                });

                Promise.all(promises).then(results => {
                    res.json({
                        "err": 0
                    });
                    res.status(200);
                    connection.close();
                }).catch(err => {
                    res.json({
                        "err": err.message
                    });
                    connection.close();
                });
            }).catch(function (err) {
                console.log("CONNECTION ERROR: " + err);
            });
        }
    });
});

app.put("/importStations", function (req,res) {
    importStations((err, stations) => {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log(stations);
            var connection = new sql.ConnectionPool(config);
            connection.connect().then(function () {
                let promises = stations.map(station => {
                    var request = new sql.Request(connection);
                    return request.input("StationName", station[0])
                                    .input("Latitude", station[1])
                                    .input("Longitude", station[2])
                                    .execute("addStation");
                });

                Promise.all(promises).then(results => {
                    res.json({
                        "err": 0
                    });
                    res.status(200);
                    connection.close();
                }).catch(err => {
                    res.json({
                        "err": err.message
                    });
                    connection.close();
                });
            }).catch(function (err) {
                console.log("CONNECTION ERROR: " + err);
            });
        }
    });
});

// fs.readFile(serverSideStorage, function(err, buf){
//     if(err){
//         console.log("error: ", err);
//     }else{
//         data = JSON.parse(buf.toString() );
//     }
//     console.log("data read from file.");
// });

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
        request.input("UserID", req.body.uid)
                .input("LineName", req.body.line)
                .input("StationName", req.body.station)
                .input("PlatformName", req.body.platform)
                .input("TrainNumber", req.body.number)
                .input("Offset", req.body.offset)
                .input("Details", req.body.details)
                .execute("AddReport").then(function (result) {
                    res.json({
                        "err": 0
                    });
                    res.status(200);
                    connection.close();
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

app.put("/getReports", function(req, res) {
    var connection = new sql.ConnectionPool(config);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.execute("GetReports").then(function (result) {
                    res.json({
                        "err": 0,
                        "records": result.recordset
                    });
                    res.status(200);
                    connection.close();
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

app.put("/api/deleteAccount", function(req, res) {
    console.log( 'user id in put: ', req.body.userId)
    console.log( 'user id in email;' ,req.body.userEmail)
    var connection = new sql.ConnectionPool(config);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("userID", req.body.userId)
            .input("userEmail", req.body.userEmail)
            .execute("DeleteUser").then(function(result) {
                res.status(200).json({});
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
        res.status(500).json({
            "err": "Server error"
        });
    });
});
app.put("/api/modifyAccount", function(req, res) {

    var connection = new sql.ConnectionPool(config);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("id", req.body.id)
            .input("email", req.body.email)
            .input("newname", req.body.newname)
            .input("oldpassword", req.body.oldpassword)
            .input("newpassword", req.body.newpassword)

            .execute("ModifyUserInfo").then(function(result) {
                res.status(200).json({});
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
        res.status(500).json({
            "err": "Server error"
        });
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



app.listen(3000);