import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';


class App extends Component {

 
  componentDidMount () {
    document.getElementById("status").innerHTML= "Waiting";
  }

  async RegsendMFA() {

    console.log("Find User Id");
  
    let url=process.env.REACT_APP_TENANT_URL+"/api/v1/users?activate=true";

   

    let user= {
      "profile": {
        "email": document.getElementById("Regusername").value,
        "login": document.getElementById("Regusername").value
      },
      "credentials": {
        "password" : { "value": "7G23(32jsu&19^gaGss15d" }
      },
      "groupIds": [
        process.env.REACT_APP_GROUP
      ]
    }

    fetch('https://cors-anywhere.herokuapp.com/'+url,{
      method: 'POST',
      headers: {
        'Authorization':'SSWS '+process.env.REACT_APP_API_TOKEN,
        'Content-Type':'application/json',
        'Accept':'*/*',
        'Orgin':url
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(response => {

      console.log(response.id);
      document.getElementById("ReguserID").value = response.id;

      let url=process.env.REACT_APP_TENANT_URL+"/api/v1/users/"+response.id+"/factors";

    let sms= {
      "factorType": "sms",
      "provider": "OKTA",
      "profile": {
        "phoneNumber": document.getElementById("Regphone").value
      }
    }

      fetch('https://cors-anywhere.herokuapp.com/'+url,{
      method: 'POST',
      headers: {
        'Authorization':'SSWS '+process.env.REACT_APP_API_TOKEN,
        'Content-Type':'application/json',
        'Accept':'*/*',
        'Orgin':url
      },
      body: JSON.stringify(sms)
    })
    .then(response => response.json())
    .then(response => {

      console.log(response.id);
      document.getElementById("RegfactorID").value = response.id;

    })
    }
  )}




  async sendMFA() {

    console.log("Find User Id");
  
    let url=process.env.REACT_APP_TENANT_URL+"/api/v1/users/"+document.getElementById("username").value;

    fetch('https://cors-anywhere.herokuapp.com/'+url,{
      method: 'GET',
      headers: {
        'Authorization':'SSWS '+process.env.REACT_APP_API_TOKEN,
        'Content-Type':'application/json',
        'Accept':'*/*',
        'Orgin':url
      }
    })
    .then(response => response.json())
    .then(response => {

      console.log(response.id);
      document.getElementById("userID").value = response.id;

    console.log("Find Factor Id");
  
    let url=process.env.REACT_APP_TENANT_URL+"/api/v1/users/"+response.id+"/factors";

    fetch('https://cors-anywhere.herokuapp.com/'+url,{
      method: 'GET',
      headers: {
        'Authorization':'SSWS '+process.env.REACT_APP_API_TOKEN,
        'Content-Type':'application/json',
        'Accept':'*/*',
        'Orgin':url
      }
    })
    .then(response => response.json())
    .then(response => {

    console.log(response[0].id)


    console.log("Send MFA");

    url=process.env.REACT_APP_TENANT_URL+'/api/v1/users/'+document.getElementById("userID").value +'/factors/'+response[0].id +'/verify';
    fetch('https://cors-anywhere.herokuapp.com/'+url,{
        method: 'POST',
        headers: {
          'Authorization':'SSWS '+process.env.REACT_APP_API_TOKEN,
          'Content-Type':'application/json',
          'Accept':'*/*',
          'Orgin':url
        }
      })
      .then((response) => {

       if(response.status == 200)
       {
        document.getElementById("status").innerHTML= "MFA Sent";
        console.log("MFA sent")
       }
       else {
        document.getElementById("status").innerHTML= "Error";
         console.log("Error")
       }

      })

      document.getElementById("factorID").value = response[0].id;
    })
  })
  }

  async validateMFA() {
    console.log("Validate MFA");

    let token = {
      "passCode": document.getElementById("response").value
    }

    const url=process.env.REACT_APP_TENANT_URL+'/api/v1/users/'+document.getElementById("userID").value +'/factors/'+document.getElementById('factorID').value +'/verify';
    fetch('https://cors-anywhere.herokuapp.com/'+url,{
        method: 'POST',
        headers: {
          'Authorization':'SSWS '+process.env.REACT_APP_API_TOKEN,
          'Content-Type':'application/json',
          'Accept':'*/*',
          'Orgin':url
        },
        body: JSON.stringify(token)
      })
      .then((response) => {

       if(response.status == 200)
       {
        document.getElementById("status").innerHTML= "SUCCESS";
        //document.getElementById("status").value = "MFA Sent";
       }
       else {
        document.getElementById("status").innerHTML= "FAILED";
         console.log("Error")
       }

      })
  }

  async RegvalidateMFA() {
    console.log("Validate MFA");

    let token = {
      "passCode": document.getElementById("Regresponse").value
    }

    const url=process.env.REACT_APP_TENANT_URL+'/api/v1/users/'+document.getElementById("ReguserID").value +'/factors/'+document.getElementById('RegfactorID').value +'/lifecycle/activate';
    fetch('https://cors-anywhere.herokuapp.com/'+url,{
        method: 'POST',
        headers: {
          'Authorization':'SSWS '+process.env.REACT_APP_API_TOKEN,
          'Content-Type':'application/json',
          'Accept':'*/*',
          'Orgin':url
        },
        body: JSON.stringify(token)
      })
      .then((response) => {

       if(response.status == 200)
       {
        document.getElementById("status").innerHTML= "SUCCESS";
        //document.getElementById("status").value = "MFA Sent";
       }
       else {
        document.getElementById("status").innerHTML= "FAILED";
         console.log("Error")
       }

      })
  }

  render () {



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Dummy MFA test App</h1>
        <h2>Registration</h2>
        <div>
        <label>Username</label>
        <input type="text" id="Regusername"/>
        </div>
        <div>
        <label>SMS Number</label>
        <input type="text" id="Regphone"/>
        </div>
        <div>
        <label>UserID</label>
        <input type="text" id="ReguserID" readOnly className="grey"/>
        </div>
        <div>
        <label>FactorID</label>
        <input type="text" id="RegfactorID" readOnly className="grey"/>
        </div>
        <div>
        <label>PassCode</label>
        <input type="text" id="Regresponse"/>
        </div>
        <br/>
        <div>
        <button onClick={this.RegsendMFA}>Register</button>
        <button onClick={this.RegvalidateMFA}>Validate MFA</button>
        </div>

        <h2>MFA</h2>
        <div>
        <label>Username</label>
        <input type="text" id="username"/>
        </div>
        <div>
        <label>UserID</label>
        <input type="text" id="userID" readOnly className="grey"/>
        </div>
        <div>
        <label>FactorID</label>
        <input type="text" id="factorID" readOnly className="grey"/>
        </div>
        <div>
        <label>PassCode</label>
        <input type="text" id="response"/>
        </div>
        <br/>
        <div>
        <button onClick={this.sendMFA}>Send MFA</button>
        <button onClick={this.validateMFA}>Validate MFA</button>
        </div>
        <p id="status" />
      </header>
    </div>
  );
}


}

export default App;
