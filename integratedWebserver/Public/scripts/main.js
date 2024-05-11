const apiURL = "http://localhost:3000/api/";
const apiUsersURL = "http://localhost:3000/api/users";
var selectedId = "";
var editEntryMode = false;

var station = "";
var platform = "";
var time = "";
var desc = "";

var usernickname ="";
var userID;
var tempnick;
var tempID;
MainPageController = class {
    constructor(){


        
    document.querySelector("#addReport").onclick = (event) => {
        window.location.href = "http://localhost:3000/static/addReport.html";
        console.log("clicked");
        };
    
    document.querySelector("#viewReport").onclick = (event) => {
        window.location.href = "http://localhost:3000/static/viewReport.html";
        loadEntries();
        };
    
    document.querySelector("#goSignUp").onclick = (event) => {
        window.location.href = "http://localhost:3000/static/Signup.html";
    };   
    document.querySelector("#goLogIn").onclick = (event) => {
        window.location.href = "http://localhost:3000/static/LogIn.html";
    };   

    document.querySelector("#nicknameGreeting").innerHTML = localStorage.getItem("userNickname");
    console.log('usernickname in static is ', localStorage.getItem("userNickname"));
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
        
        checkUser()
        .then(() => {
            if(data.error){

            }else{
             //   window.location.href = "http://localhost:3000/static/";
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




AddReportPageController = class {
    constructor(){
        document.querySelector("#submitReport").onclick = (event) => {
            createReport();
            window.location.href = "http://localhost:3000/static/viewReport.html";
            };   
    
        document.querySelector("#gomainButton").onclick = (event) => {
            window.location.href = "http://localhost:3000/static/";
            console.log("clicked");
        };   

    }
}



function main(){
    console.log("Ready");
  //  updateView();
  
  loadEntries();

if(document.querySelector("#MainPage")){
    new MainPageController();
}
if(document.querySelector("#AddReportPage")){
    new AddReportPageController();
}
if(document.querySelector("#SignUpPage")){
    new SignUpPageController();
}
if(document.querySelector("#LogInPage")){
    new LogInPageController();
}
        
}


function loadEntries(){
    //document.querySelector("#displayReports").innerHTML = null;
    let allEntries = fetch(apiURL)

    .then(response => response.json())
    .then(data =>{ 
        for(let i=0; i< data.length; i++){

            const displayReportsElement = document.querySelector("#displayReports");
            if (displayReportsElement) {
                displayReportsElement.innerHTML +=

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
            } else {
            // to prevent null error console.error("Element with ID 'displayReports' not found");
            }
            

        }
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


async function createReport(){
    let station = document.querySelector("#inputStation").value;
    let platform = document.querySelector("#inputPlatform").value;
    let time = document.querySelector("#inputTime").value;
    let desc = document.querySelector("#inputDescription").value;

    let errorCheck = true;

    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "station": station,
            "platform": platform,
            "time":time,
            "desc":desc
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
            usernickname = data.outputName;
            userID = data.outputID;

            localStorage.setItem('userNickname', data.outputName);
            localStorage.setItem('userID', data.outputID);


            window.location.href = "http://localhost:3000/static/";
        }
    } catch (error) {
        throw error;
    }
}


main();