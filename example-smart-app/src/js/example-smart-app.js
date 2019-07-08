'use strict';
var medName;

(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        
        //var meds = smart.patient.api.search({type: 'MedicationOrder'});
        var meds = smart.patient.api.search({type: 'MedicationRequest'});


        $.when(pt, meds).fail(onError);

        $.when(pt, meds).done(function(patient, meds) {
          var gender = patient.gender;
          if (typeof patient.name !== 'undefined') {
            var name = patient.name[0].given + ' ' + patient.name[0].family;
          }
          

          var medsList = getMeds(meds);
          //console.log(typeof medsList);
          //console.log(medsList.length);
          //console.log("med list: ", medsList);
          var newList = Object.values(medsList);
          //console.log("new List: ", newList);
          


          var p = defaultPatient();
          p.birthdate = patient.birthDate;
          p.gender = gender;
          p.name = name;

          

          if (typeof medsList != 'undefined') {
            p.meds = medsList;
          }


          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      name: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      meds: {value: ''}
    };
  }

  /*
  function getMedName(ref){ //this function works, but not asynchronously
    var request = new XMLHttpRequest();
    var requestURL = 'https://r3.smarthealthit.org/' + ref; //https://r3.smarthealthit.org/Medication/2f925ae9-0d1e-4568-8b0c-0fe1b2a9ff12
    request.open('GET', requestURL, true);
    request.responseType = 'json';
    request.onload = function(){
      let medName = request.response.code.text;
      console.log(medName);
      return medName;
    };
    request.send();
  }*/

  async function getMedNameAsync(ref){
    let response = await fetch('https://r3.smarthealthit.org/' + ref);
    let data = await response.json();
    let name = data.code.text;
    return name;
  }

  // function getRxnorm(ref){ //this function works, but not asynchronously
  //   var request = new XMLHttpRequest();
  //   var requestURL = 'https://r3.smarthealthit.org/' + ref; //https://r3.smarthealthit.org/Medication/2f925ae9-0d1e-4568-8b0c-0fe1b2a9ff12
  //   request.open('GET', requestURL, true);
  //   request.responseType = 'json';
  //   request.onload = function(){
  //     let rxnorm = request.response.code.coding[0].code;
  //     return rxnorm;
  //   };
  //   request.send();
  // }

  async function getRxnormAsync(ref){ //this function works, but not asynchronously
    let response = await fetch('https://r3.smarthealthit.org/' + ref)
    let data = await response.json();
    let rxnorm = data.code.coding[0].code;
    return rxnorm
  }


function getMeds(Meds) {
  var formattedMeds = [];
  Meds.data.entry.forEach(function (entries) {
    var medStatus = entries.resource.status;
    var medRef = entries.resource.medicationReference.reference;

    var medName = new Promise(function(resolve, reject){
      resolve(getMedNameAsync(medRef));
    })
    //getMedNameAsync(medRef).then(function (value) {medName = value; console.log("Value: ", value);} );
    //console.log("My New Name: ", medName);

    //getRxnormAsync(medRef).then(rxnorm => console.log("Rxnorm: ", rxnorm));

    //var code = 1049221;
    //rxnormToNdcAsync(code).then(ndc => console.log("NDC: ", ndc));

    //var tempNdc = '0054-0551';
    //ndcToScheduleAsync(tempNdc).then(schedule => console.log("Schedule: ", schedule));



    
    //console.log(medName);
    /*getMedName(medRef).then(data => medName )
    var medName = getMedName(medRef).then(function(response){
      console.log("success", response);
      console.log(response);
    }, function(error) {
      console.log("error", error);
    })*/
    
    //var rxnorm = getRxnorm(medRef);
    //var dea_schedule = ndcToSchedule(rxnormToNdc(rxnorm));

    
    
    Promise.all([medStatus, medRef, medName]).then(function(values){
      formattedMeds.push([values[2], values[0]]);
      

    })
    //formattedMeds.push([medName, medStatus/*, rxnorm, dea_schedule*/]);
    
  });

  
  //console.log(formattedMeds);
  formattedMeds.sort(function (a, b) {
    return b[1] - a[1]
  });
  //console.log(formattedMeds);
  


 

  return formattedMeds;
}


function formatMeds(Meds) {

  console.log(Meds.length);
  var formatTable = '<table class="table">' + '<tr><th>Medication</th><th>Status</th><th>rxnorm code</th><th>dea_schedule</th></tr>';
  for (var i = 0; i < Meds.length; i++) {
    var med = Meds[i];
    //console.log(med);

    formatTable = formatTable + '<tr><td>' + med[0] + '</td><td>' + med[1] + '</td></tr>';
  }
  formatTable = formatTable + '</table>';
  return formatTable;
}






// function rxnormToNdc(rxnorm){ //input rxnorm, output ndc
//   //var ndc;
//   var request = new XMLHttpRequest();
//   var requestURL = 'https://rxnav.nlm.nih.gov/REST/rxcui/' + rxnorm + '/ndcs.json'; //https://rxnav.nlm.nih.gov/REST/rxcui/213269/ndcs.json
//   request.open('GET', requestURL, true);
//   request.responseType = 'json';
//   request.onload = function(){
//     return request.response; 
//   };
//   request.send();
// }

async function rxnormToNdcAsync(rxnorm){ //input rxnorm, output ndc
  let response = await fetch('https://rxnav.nlm.nih.gov/REST/rxcui/' + rxnorm + '/ndcs.json');
  let data = await response.json();
  let ndc = data.ndcGroup.ndcList.ndc[0];
  return ndc
}



function ndcToSchedule(ndc) { //input ndc, output dea schedule
  var schedule;
  var request = new XMLHttpRequest();
  ndc = '00069420030';
  var requestURL = 'https://api.fda.gov/drug/ndc.json?search=product_ndc:' + ndc; //https://api.fda.gov/drug/ndc.json?search=product_ndc:ndc //input: ndc, output: dea_schedule
  request.open('GET', requestURL, true);
  request.responseType = 'json';
  request.onload = function(){
    return request.response; 
  };
  request.send();
}

async function ndcToScheduleAsync(ndc){
  let response = await fetch('https://api.fda.gov/drug/ndc.json?search=product_ndc:' + ndc);
  let data = await response.json();
  let schedule = data.results[0].dea_schedule;
  return schedule;
}


  // function getMeds(meds){
  //   var formattedMeds = [];
  //   meds.data.entry.forEach(function(entries){
  //     var medStatus = entries.resource.status;
  //     var medID = entries.resource.identifier;
  //     var medRef = entreis.resource.medication.medicationReference;
  //     formattedMeds.push([medRef, medID, medStatus]);
  //   })
  //   return formattedMeds;
  // }

  

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#name').html(p.name);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#meds').html(formatMeds(p.meds));
    $('#activemeds').html(p.meds.length);
  };

})(window);
