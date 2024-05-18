const apiURL = "http://localhost:3000/api/";
const apiUsersURL = "http://localhost:3000/api/users";
var selectedId = "";
var logInMode = false;

var USER_NAME;
var USER_ID;


var station = "";
var platform = "";
var time = "";
var desc = "";


MainPageController = class {
    
    constructor(){


        document.querySelector("#main-addReport").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/addReport.html";
            console.log("clicked");
        };
    
        document.querySelector("#main-viewReports").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/viewReport.html";
            loadReports();
        };

        document.querySelector("#main-searchTrains").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/findTrains.html";
        };

        document.querySelector("#main-import").onclick = (event) => {
            importData();
        };

        document.querySelector("#goSignUp").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/Signup.html";
        };   
        document.querySelector("#goLogIn").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/LogIn.html";
        };
        document.querySelector("#goDelete").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/DeleteAccount.html";
        };   
        document.querySelector("#main-userInfo").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/myProfile.html";
        };   
        document.querySelector("#nicknameGreeting").innerHTML = localStorage.getItem("userNickname");
        updateView();
    
        
    }
}

SignUpPageController = class {
    constructor(){

    document.querySelector("#SignUpButton").onclick = (event) => {
        createUser();
        window.location.href = "http://localhost:3000/static/";
        };
    
    document.querySelector("#goMainButton1").onclick = (event) => {
        window.location.href = "http://localhost:3000/static/";
        console.log("go main");
    };   
    }
}

LogInPageController = class {
    constructor(){
    document.querySelector("#LogInButton").onclick = (event) => {
        
        data = checkUser()
        .then(() => {
            console.log('data is: ', data);
            if(data.error){

            }else{

               window.location.href = "http://localhost:3000/static/";
            }
        })
        .catch(error => {

        });
    };
    
    document.querySelector("#goMainButton1").onclick = (event) => {
        window.location.href = "http://localhost:3000/static/";
        console.log("go main");
    };   
    }
}

DeleteAccountPageController = class {
    constructor(){
        
    console.log("your id is : ", localStorage.getItem('userID'));
    console.log("your nickname is : ", localStorage.getItem('userNickname'));
    document.querySelector("#DeleteAccountButton").onclick = (event) => {
        deleteUser();
        };

    document.querySelector("#goMainButton1").onclick = (event) => {
        window.location.href = "http://localhost:3000/static/";
        console.log("go main");
    };   
    }
}

MyProfilePageController = class {
    constructor(){
    
        document.querySelector('#staticEmail').value = localStorage.getItem("userEmail");;    
        document.querySelector('#staticNickname').value = localStorage.getItem("userNickname");;

    document.querySelector("#ModifyUserInfoButton").onclick = (event) => {
        modifyUser();
        };

    document.querySelector("#goMainButton1").onclick = (event) => {
        window.location.href = "http://localhost:3000/static/";
    };   
    }
}


AddReportPageController = class {
    constructor(){
        document.querySelector("#submitReport").onclick = (event) => {
            createReport();
            window.location.href = "http://localhost:3000/static/viewReport.html";
        };

        document.querySelector("#cancelReport").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/";
        };   

        document.querySelector("#menuButton").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/";
        };  
    
        // document.querySelector("#gomainButton").onclick = (event) => {
        //     window.location.href = "http://localhost:3000/static/";
        //     console.log("clicked");
        // };   

    }
}

ViewReportPageController = class {
    constructor(){

        document.querySelector("#menuButton").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/";
        };   

    }
}

FindTrainsPageController = class {
    constructor(){

        document.querySelector("#menuButton").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/";
        };   

    }


    async searchTrains(){
        let line = document.querySelector("#searchLineName").value;
        let station = document.querySelector("#searchStationName").value;
        let destination = document.querySelector("#searchDestinationName").value;
        let direction = document.querySelector("#searchDirection").value;
    
        console.log(line, station, destination, direction);
    
        let errorCheck = true;
    
        const options = {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "line": line,
                "station": station,
                "destination": destination,
                "direction": direction
            }),
        };
    
        console.log(apiURL);
    
        await fetch(apiURL + "searchTrains", options)
            .then(response => response.json())
            .then(data => {
                if (data.err == 0) {} 
                else {
                    errorCheck = false;
                    alert(data.err);
                }
            })
            .catch(error => console.error(error));
    
        return errorCheck;
    }
}

function main(){
    console.log("Ready");
    updateView();

    loadReports();
    USER_NAME = localStorage.getItem('userNickname') || 'Guest';
    USER_ID = localStorage.getItem('userID') || '0';
    console.log("your id is : ", localStorage.getItem('userID'));
    console.log("your nickname is : ", localStorage.getItem('userNickname'));

    if(document.querySelector("#MainPage")){
        new MainPageController();
    }
    if(document.querySelector("#SignUpPage")){
        new SignUpPageController();
    }
    if(document.querySelector("#LogInPage")){
        new LogInPageController();
    }
    if(document.querySelector("#AddReportPage")){
        new AddReportPageController();
    }

    if(document.querySelector("#ViewReportPage")){
        new ViewReportPageController();
    } 

    if(document.querySelector("#FindTrainsPage")){
        new FindTrainsPageController();
    } 
    if(document.querySelector("#DeleteAccountPage")){
        new DeleteAccountPageController();
    }
    if(document.querySelector("#MyProfilePage")){
        new MyProfilePageController();
    }


    

}



// //from full stack app followalong
function updateView(){
    //logged in, you cant see login
    // console.log(localStorage.getItem('logInMode'));
    //  if(document.querySelector("#MainPage")){
    //     if(localStorage.getItem('logInMode') == true){
    //         document.querySelector("#goLogIn").disabled = true;
    //         document.querySelector("#main-addReport").disabled = false;
    //     //not logged in, you can see login
    //     }if(!localStorage.getItem('logInMode') == false){
    //         document.querySelector("#goLogIn").disabled = false;
    //         document.querySelector("#main-addReport").disabled = true;
    //     }
    // }
}

function loadEntries(){
    //document.querySelector("#displayReports").innerHTML = null;
    let allEntries = fetch(apiURL)

    .then(response => response.json())
    .then(data =>{ 
        for(let i=0; i< data.length; i++){
            
            document.querySelector("#displayReports").innerHTML +=

            // `<button id="id${i}"onclick = loadEntry(${i}); >Select Entry</button>
            // <label>${data[i].name}</label>&nbsp;
            // <label>${data[i].count}</label><br>`;

                `<li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${data[i].station}</div>
                    ${data[i].time} ${data[i].desc}
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>

                &nbsp;
                &nbsp;

                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg>
                &nbsp;

                </li>`;

        }
    });
}

async function loadReports(){

    let errorCheck = true;

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        }
    };
    
    await fetch("/getReports", options)
        .then(response => response.json())
        .then(data => {
            if (data.err == 0) {
                displayReports(data.records);
                console.log("got reports to main");
            } 
            else {
                errorCheck = false;
                alert(data.err);
            }
        })
        .catch(error => console.error(error));

    return errorCheck;

}

async function displayReports(records) {
    const container = document.querySelector("#reportCards");
    container.innerHTML = "";

    records.forEach(record => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.margin = '20px';
        card.innerHTML = `
            <div class="card-body">
            <div class="form-row">
                <h5 class="card-title">Station: ${record.StationName}</h5>
                <p class="card-text">Train Number: ${record.TrainNo}</p>
                <p class="card-text">Details: ${record.Details}</p>
                <p class="card-text"><small class="text-muted">Reported at ${record.DateTime}</small></p>
            </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function loadEntry(id){
    selectedId = id;
    let entry = fetch (apiURL + "id/" + id)
    .then (response => response.json())
    .then (data => {
        station = data.station;
        platform = data.platform;
        time = data.time;
        desc = data.desc;

     //   editEntryMode = true;
     //   updateView();
    })
}

// function deleteEntry(){
//     fetch (apiURL + "id/" + selectedId,
//     {method : "DELETE"})
//     .then (data => {
//         editEntryMode = false;
//         document.querySelector("#inputName").value = "";
//         counter = 0;
//         updateView();
//         loadEntries();
//     }).catch(err => {
//         console.log(err);
//     });
// }

// function updateEntry(){
//     let name = document.querySelector("#inputName").value;
//     let data = { "name": name, "count": counter};
//     fetch (apiURL + "id/" + selectedId,
//         {method : "PUT",
//         headers: {"Content-Type": 'application/json'},
//         body: JSON.stringify(data)
//         },
//     )
//     .then (data => {
//         editEntryMode = false;
//         document.querySelector("#inputName").value = "";
//         counter = 0;
//         updateView();
//         loadEntries();
//     }).catch(err => {
//         console.log(err);
//     });
// }

async function createReport(){
    let uid = document.querySelector("#inputTrainNumber").value;
    let line = document.querySelector("#inputLine").value;
    let station = document.querySelector("#inputStation").value;
    let platform = document.querySelector("#inputPlatform").value;
    let trainNumber = document.querySelector("#inputTrainNumber").value;
    let trainOffset = document.querySelector("#inputTrainOffset").value;
    let det = document.querySelector("#inputDetails").value;

    console.log(line, station, platform, trainNumber, trainOffset, det);

    let errorCheck = true;

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "uid": uid,
            "line": line,
            "station": station,
            "platform": platform,
            "number": trainNumber,
            "offset": trainOffset,
            "details": det
        }),
    };

    console.log(apiURL);

    await fetch(apiURL + "addReport", options)
        .then(response => response.json())
        .then(data => {
            if (data.err == 0) {} 
            else {
                errorCheck = false;
                alert(data.err);
            }
        })
        .catch(error => console.error(error));

    return errorCheck;
}

async function createUser(){
    console.log("creating user");
    
    let name = document.querySelector("#exampleNickname1").value;
    let email = document.querySelector("#exampleInputEmail1").value;
    let password = document.querySelector("#exampleInputPassword1").value;


    let errorCheck = true;

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "name": name,
            "email": email,
            "password":password
        }),
    };

    await fetch(apiURL + "addUser", options)
    .then(response => response.json())
    .then(data => {
        if (data.err == 0) {} 
        else {
            errorCheck = false;
            alert(data.err);
        }
    })
    .catch(error => console.error(error));

return errorCheck;
}

async function checkUser() {
    console.log("checking user");

    let email = document.querySelector("#LoginInputEmail").value;
    let password = document.querySelector("#LoginInputPassword").value;

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
    };

    try {
        let response = await fetch(apiURL + "checkLogin", options);
        if (!response.ok) {
            // Handle non-200 status codes
            throw new Error('Server response was not ok');
        }

        let data = await response.json();
        
        if (data.err) {
            console.log('Error: ', data.err);
            document.getElementById('errorAlert').innerText = data.err;
            document.getElementById('errorAlert').style.display = 'block';

            localStorage.setItem('userNickname', 'Guest');
            localStorage.setItem('userID', '0');
        } else {
            console.log('Here is your nickname:', data.outputName);
            console.log('Here is your ID:', data.outputID);
            // usernickname = data.outputName;
            // userID = data.outputID;

            localStorage.setItem('userNickname', data.outputName);
            localStorage.setItem('userID', data.outputID);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('logInMode', true);
          
        

            window.location.href = "http://localhost:3000/static/";
            updateView();
        }
    } catch (error) {
        throw error;
    }
}
async function deleteUser() {
    console.log("deleting user");

    let ID = localStorage.getItem("userID");
    let Email = localStorage.getItem("userEmail");

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "userId": ID,
            "userEmail": Email
        }),
    };

    try {
        console.log("before fetch request");
        let response = await fetch(apiURL + "deleteAccount", options);
        console.log("After fetch request");
        if (!response.ok) {
            // Handle non-200 status codes
            throw new Error('Server response was not ok');
        }

        let data = await response.json();
        console.log("data from mainjs : ", data)
        
        if (data.err) {
            console.log('Error: ', data.err);
            document.getElementById('errorAlert').innerText = data.err;
            document.getElementById('errorAlert').style.display = 'block';
        } else {
        //the account is deleted
            localStorage.setItem('userNickname', 'Guest');
            localStorage.setItem('userID', '0');
            localStorage.setItem('userEmail', '@');
            console.log("now your nickname is : ", localStorage.getItem('userNickname'));
            localStorage.setItem('logInMode', false);
            logInMode = false;
            //updateView();
            window.location.href = "http://localhost:3000/static/";
            updateView()
        }
    } catch (error) {
        throw error;
    }
}

async function modifyUser() {

    let id = localStorage.getItem("userID");
    let email = localStorage.getItem("userEmail");
    let newname = document.querySelector("#NewNameInput").value;
    let oldpassword = document.querySelector("#OldPasswordInput").value;
    let newpassword = document.querySelector("#NewPasswordInput").value;

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "id": id,
            "email": email,
            "newname": newname,
            "oldpassword": oldpassword,
            "newpassword": newpassword
        }),
    };

    try {
        let response = await fetch(apiURL + "modifyAccount", options);
        if (!response.ok) {
            // Handle non-200 status codes
            throw new Error('Server response was not ok');
        }

        let data = await response.json();
        
        if (data.err) {
            console.log('Error: ', data.err);
            document.getElementById('errorAlert').innerText = data.err;
            document.getElementById('errorAlert').style.display = 'block';

        } else {
            if(newname != ""){
                localStorage.setItem('userNickname', newname);
            }   

            window.location.href = "http://localhost:3000/static/";
        }
    } catch (error) {
        throw error;
    }
}


// Start of Import Functions
async function importData() {
    //importLines();
    importStations();
}

async function importLines() {
    let errorCheck = true;

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        }
    };
    
    await fetch("/importLines", options)
        .then(response => response.json())
        .then(data => {
            if (data.err == 0) {
                console.log("imported lines");
            } 
            else {
                errorCheck = false;
                alert(data.err);
            }
        })
        .catch(error => console.error(error));

    return errorCheck;
}

async function importStations() {
    let errorCheck = true;

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        }
    };
    
    await fetch("/importStations", options)
        .then(response => response.json())
        .then(data => {
            if (data.err == 0) {
                console.log("imported stations");
            } 
            else {
                errorCheck = false;
                alert(data.err);
            }
        })
        .catch(error => console.error(error));

    return errorCheck;
}

main();