'use strict';

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
        
        var meds = smart.patient.api.search({type: 'MedicationRequest'});

        $.when(pt, obv, meds).fail(onError);

        $.when(pt, obv, meds).done(function(patient, obv, meds) {
          var byCodes = smart.byCodes(obv, 'code');
          var gender = patient.gender;

          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given.join(' ');
            lname = patient.name[0].family.join(' ');
          }

          var medsList = getMeds(meds);
          


          var p = defaultPatient();
          p.birthdate = patient.birthDate;
          p.gender = gender;
          p.fname = fname;
          p.lname = lname;

          

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
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      meds: {value: ''}
    };
  }

function getMeds(Meds) {
  var formattedMeds = [];
  Meds.data.entry.forEach(function (entries) {
    var medStatus = entries.resource.status;
    var medDisplay = entries.resource.code.coding[0].display;

    if (medDisplay) {
      formattedMeds.push([medDisplay, medStatus]);
    }
  });

  

  formattedMeds.sort(function (a, b) {
    return b[1] - a[1]
  });

  return formattedMeds;
}


function formatMeds(Meds) {
  var formatTable = '<table class="table">' + '<tr><th>Condition</th><th>Onset Date</th></tr>';
  for (var i = 0; i < Meds.length; i++) {
    var Meds = Meds[i];
    formatTable = formatTable + '<tr><td>' + Med[0] + '</td><td>' + Med[1] + '</td></tr>';
  }
  formatTable = formatTable + '</table>';
  return formatTable;
}

function rxnormToNdc(rxnorm){ //input rxnorm, output ndc
  //var ndc;
  var request = new XMLHttpRequest();
  var requestURL = 'https://rxnav.nlm.nih.gov/REST/rxcui/' + rxnorm + '/ndcs.json'; //https://rxnav.nlm.nih.gov/REST/rxcui/213269/ndcs.json
  request.open('GET', requestURL, true);
  request.responseType = 'json';
  request.onload = function(){
    return request.response; 
  };
  request.send();
}

function ndcToSchedule(ndc) { //input ndc, output dea schedule
  var schedule;
  var request = new XMLHttpRequest();
  var requestURL = 'https://api.fda.gov/drug/ndc.json?search=product_ndc:' + ndc; //https://api.fda.gov/drug/ndc.json?search=product_ndc:ndc //input: ndc, output: dea_schedule
  request.open('GET', requestURL, true);
  request.responseType = 'json';
  request.onload = function(){
    return request.response; 
  };
  request.send();
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
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#meds').html(formatMeds(p.meds));
    $('#activemeds').html(p.meds.length);
  };

})(window);
