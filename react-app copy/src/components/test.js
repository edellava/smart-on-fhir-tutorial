'use strict';
import React, { Component } from 'react'

export default class test extends Component {
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
        
    
        if (data.error != undefined) { //an error is defined, so there was an error
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
    
            let medName = await getMedNameAsync(medRef);
            let rxnorm = await getRxnormAsync(medRef);
            let schedule = await rxnormToSchedule(rxnorm);
            if (schedule == undefined) {
                schedule = "--";
            }
            let thisMed = new med;
            thisMed = {
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

    getInfo = async(smart) => {
        let info = {
            patient: {
                name: '',
                gender: '',
                birthdate: '',
            }, doctor: {
                name: '',
            }, meds: [],
        }
        if (smart.hasOwnProperty('patient')) {
            let patient = smart.patient;
            let practitionerId = smart.userId;
            practitionerId = practitionerId.slice(13);
    
    
            console.log(smart)
            var pt = patient.read();
            let patientID = smart.patient.id;

            //pull necessary resources
            let practitioner = await smart.patient.api.search({
                type: "Practitioner",
                query: {
                    _id: practitionerId
                }
            });
            let meds = await smart.patient.api.search({
                type: "MedicationRequest",
                query: {
                    patient: patientID
                }
            });
            let consent = await smart.patient.api.search({
                type: "Consent"
            });
    
            // set doctor info
            practitioner = practitioner.data.entry[0];
            info.doctor.name = practitioner.resource.name[0].given[0] + ' ' + practitioner.resource.name[0].family + ', ' + practitioner.resource.name[0].suffix;
            
            //set patient info
            info.patient.gender = patinet.gender;
            info.patient.birthdate = patient.birthDate;
            if (typeof patient.name !== 'undefined') {
                info.patient.name = patient.name[0].given + ' ' + patient.name[0].family;
            }

            //set meds info
            info.meds = await asyncGetMeds(meds.data.entry);
        }
        return info
    }
    
    render() {
        let info = this.getInfo(smart);
        console.log(info);
        return (  
            info
        )
    }   
}

const med = {
    name: '',
    rxnorm: '',
    schedule: '',
    status: '',
    reason: '',
    selected: false
}











