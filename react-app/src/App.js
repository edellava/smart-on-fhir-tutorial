/*jshint esversion: 6 */
import React, { Component } from 'react';
import './App.css';
import Meds from './components/Meds';
import PtInfo from './components/PtInfo';
import GenerateDocBtn from './components/GenerateDocBtn';
import update from 'immutability-helper';
import Client from 'fhir-kit-client';


const client = new Client({baseUrl: 'https://r3.smarthealthit.org'});

class App extends Component {
  constructor(props) {
    super(props)

    this.handler = this.handler.bind(this)
  }

state = {
    meds: [], 
    patient: {
      name: '',
      gender: '',
      birthdate: '',
    },
    doctor: {
      name: ''
    }
  }

  

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
        let timing;
        console.log("ok",item.resource.dosageInstruction)
        if(item.resource.dosageInstruction === undefined) {
          timing = "n/a"
        } else{
          if(item.resource.dosageInstruction[0].asNeededBoolean){
            timing = "as Needed"
          } else {
            timing = "Take " + item.resource.dosageInstruction[0].doseQuantity.value + " every " + item.resource.dosageInstruction[0].timing.repeat.period + item.resource.dosageInstruction[0].timing.repeat.periodUnit;
          }
        }
        
        if (schedule === undefined) {
            schedule = "--";
        }
        
        let thisMed = {
            name: medName,
            rxnorm: rxnorm,
            schedule: schedule,
            status: medStatus,
            reason: reason,
            selected: false,
            timing: timing
        }
        allAsyncResults.push(thisMed);
      }
    return allAsyncResults;
  }
  
  async componentDidMount(){
    let info = {
      patient: {
          name: '',
          gender: '',
          birthdate: '',
      }, doctor: {
          name: '',
      }, meds: []
    }

    let patientId = 'a1dd8789-fed8-4e23-884f-71a74d12a93b'; //Libby Mraz


    //set patient info
    let patient = await client.read({
      resourceType: 'Patient',
      id: patientId
    })
    info.patient = {
      name: patient.name[0].given + ' ' + patient.name[0].family,
      gender: patient.gender,
      birthdate: patient.birthDate
    }


    //set doctor info
    let practitioner = await client.search({
      resourceType: "Practitioner",
      searchParams: {
          _id: 'smart-Practitioner-71614502'
      }
    });
    practitioner = practitioner.entry[0];
    info.doctor.name = practitioner.resource.name[0].given[0] + ' ' + practitioner.resource.name[0].family + ', ' + practitioner.resource.name[0].suffix;
    
    //set medication info
    let meds = await client.search({
      resourceType: "MedicationRequest",
      searchParams: { patient: patientId},
    });
    console.log(meds)
    info.meds = await this.asyncGetMeds(meds.entry);
    console.log(info.meds)

    //update state with information that was pulled
    this.setState({
      patient: {
        name: info.patient.name,
        gender: info.patient.gender,
        birthdate: info.patient.birthdate
      }, doctor: {
        name: info.doctor.name
      }, meds: info.meds
        
    });
  }

  handler(rxnorm){
    console.log(this.state.meds)
    const getMed = this.state.meds.find(med => med.rxnorm === rxnorm);
    let index = this.state.meds.indexOf(getMed);
    let newVal = !this.state.meds[index].selected;
    let newMeds = update(this.state.meds,{[index]: {selected: {$set: newVal}}})
    this.setState({ meds: newMeds }, () => console.log("checkbox handled: ", this.state.meds))
  }

  render(){
    //this.testFunc();
    //console.log("smart:", smart);
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
