/*jshint esversion: 6 */
import React, { Component } from 'react';
import './App.css';
import Meds from './components/Meds';
import PtInfo from './components/PtInfo';
import GenerateDocBtn from './components/GenerateDocBtn';
//import FHIR from 'fhirclient';
import update from 'immutability-helper';



//const Client = require('fhir-kit-client');
const smart = require('fhirclient');
//const app = require('express');

// const smart = new Client({
//   baseUrl: "https://r3.smarthealthit.org/",
// });

// const smart = new cli({
//   baseUrl: "https://launch.smarthealthit.org/v/r3/fhir",
//   patientId: 'smart-1137192'
// })

////baseUrl: 'https://r3.smarthealthit.org',




class App extends Component {
  constructor(props) {
    super(props)

    this.handler = this.handler.bind(this)
  }


  

state = {

    meds: [
        {
            id : '1',
            name: ' Med One',
            status: 'active',
            schedule: 'CII',
            reason: 'pain',
            selected: false
        },
        {
            id : '2',
            name: ' Med Two',
            status: 'stopped',
            schedule: 'CI',
            reason: 'anxiety',
            selected: false
        }
    ],
    
    patient: {
      name: '',
      gender: '',
      birthdate: '',
    },
    
    doctor: {
      name: 'Jane Doc, MD'
    }
  }

  // testFunc = () => {
  //   app.get("/launch", (req, res, next) => {
  //     smart(req,res).authorize(FHIR.smartSettings).catch(next);
  //   })
  // }

  getMedNameAsync = async(ref) => {
    let response = await fetch('https://r3.smarthealthit.org/' + ref);
    let data = await response.json();
    return data.code.text; //return name
  }

  getRxnormAsync = async(ref) => { //this function works, but not asynchronously
      let response = await fetch('https://r3.smarthealthit.org/' + ref)
      let data = await response.json();
      return data.code.coding[0].code; // return rxnorm 
  }

  rxnormToSchedule = async(rxnorm) => {
      let response = await fetch('https://api.fda.gov/drug/ndc.json?search=openfda.rxcui:' + rxnorm);
      let data = await response.json();
      

      if (data.error !== undefined) { //an error is defined, so there was an error
          response = await fetch('https://rxnav.nlm.nih.gov/REST/rxcui/' + rxnorm + '/allrelated.json' /*, {mode: 'no-cors'}*/ );
          data = await response.json();
          let newRxnorm;
          try {
              newRxnorm = data.allRelatedGroup.conceptGroup[7].conceptProperties[0].rxcui; //sbd code
          } catch {
              newRxnorm = data.allRelatedGroup.conceptGroup[10].conceptProperties[1].rxcui; //scd code
          }
          let newResponse = await fetch('https://api.fda.gov/drug/ndc.json?search=openfda.rxcui:' + newRxnorm);
          let newData = await newResponse.json();
        
          try {
              return newData.results[0].dea_schedule;
          } catch {
              return "--";
          }
      } else {
          try {
              return data.results[0].dea_schedule;
          } catch {
              return "-/-";
          }
      }
  }
  
  asyncGetMeds = async(array) => {
    const allAsyncResults = [];
    
    
    for (const item of array) {
        let medStatus = item.resource.status;
        let medRef = item.resource.medicationReference.reference;
        
        let encounter = item.resource.context.reference;
        let reason = await fetch('https://r3.smarthealthit.org/' + encounter);
        reason = await reason.json();
        try {
            reason = reason.reason[0].coding[0].display
        } catch {
            reason = reason.type[0].text;
        }

        let medName = await this.getMedNameAsync(medRef);
        let rxnorm = await this.getRxnormAsync(medRef);
        let schedule = await this.rxnormToSchedule(rxnorm);
        if (schedule === undefined) {
            schedule = "--";
        }
        
        let thisMed = {
            name: medName,
            rxnorm: rxnorm,
            schedule: schedule,
            status: medStatus,
            reason: reason,
            selected: false
        }
        allAsyncResults.push(thisMed);
      }
    return allAsyncResults;
  }
  
  // async componentDidMount(){
  //   let info = {
  //     patient: {
  //         name: '',
  //         gender: '',
  //         birthdate: '',
  //     }, doctor: {
  //         name: '',
  //     }, meds: [],
  //   }


  //   if (smart.hasOwnProperty('patient')) {
  //       console.log("smart", smart.patient)
  //       let patient = smart.patient;
  //       let practitionerId = smart.userId;
  //       practitionerId = practitionerId.slice(13);
  //       patient = patient.read();
  //       let patientID = smart.patient.id;

  //       //set patient info
  //       info.patient.gender = patient.gender;
  //       info.patient.birthdate = patient.birthDate;
  //       if (typeof patient.name !== 'undefined') {
  //           info.patient.name = patient.name[0].given + ' ' + patient.name[0].family;
  //       }

  //       //set doctor info
  //       //let practitioner = await smart.patient.api.search({
  //       let practitioner = await smart.search({
  //           type: "Practitioner",
  //           query: {
  //               _id: practitionerId
  //           }
  //       });
  //       practitioner = practitioner.data.entry[0];
  //       info.doctor.name = practitioner.resource.name[0].given[0] + ' ' + practitioner.resource.name[0].family + ', ' + practitioner.resource.name[0].suffix;
        


  //       //set meds info
  //       //let meds = await smart.patient.api.search({
  //       let meds = await smart.search({
  //           type: "MedicationRequest",
  //           query: {
  //               patient: patientID
  //           }
  //       });
  //       info.meds = await this.asyncGetMeds(meds.data.entry);
  //       console.log("meds", info.meds);
  //   }

    
   
  //   console.log("state gets set", info.meds)
  //   this.setState({
  //     patient: {
  //       name: info.patient.name,
  //       gender: info.patient.gender,
  //       birthdate: info.patient.birthdate
  //     }, doctor: {
  //       name: info.doctor.name
  //     }, meds: info.meds     
  //   });
  // }

  handler(id){
    const getMed = this.state.meds.find(med => med.id === id);
    let index = this.state.meds.indexOf(getMed);
    let newVal = !this.state.meds[index].selected;
    let newMeds = update(this.state.meds,{[index]: {selected: {$set: newVal}}})
    this.setState({ meds: newMeds }, () => console.log("checkbox handled: ", this.state.meds))
  }

  render(){
    //this.testFunc();
    console.log("smart:", smart);
    return (
      <div>
        <h1>  
          <div style={styles.patient}>
            <div className="row justify-content-start" style={styles.patient2}>
              <PtInfo patient={this.state.patient}/>
            </div>
          </div>
            <Meds meds={this.state.meds} patient={this.state.patient} doctor={this.state.doctor} handler={this.handler}/>
            <GenerateDocBtn className="text-right" patient={this.state.patient} meds={this.state.meds} doctor={this.state.doctor}/>
            {/* <Contract/> */}
            
        </h1>
      </div>
    );
    
    
  }
  
}

 

const styles = {
  patient: {
    textAlign:'center'
  }, 
  patient2 : {
    display: 'inline-block'
  }
  
}

export default App;
