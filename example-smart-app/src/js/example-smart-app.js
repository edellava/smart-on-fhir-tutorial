

'use strict';
var medName;

var contract = {}
contract.medications = [];


(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    async function onReady(smart)  {
      console.log(smart);
      if (smart.hasOwnProperty('patient')) {
        let patient = smart.patient;
        let practitionerId =  smart.userId;
        practitionerId = practitionerId.slice(13);
        
       
        console.log(smart)
        var pt = patient.read();
        let patientID = smart.patient.id;

        let practitioner = smart.patient.api.search({type: "Practitioner", query: {_id: practitionerId}});
        let meds =  smart.patient.api.search({type: "MedicationRequest", query: {patient: patientID}});
        let consent = smart.patient.api.search({type: "Consent"});

        

        $.when(pt, meds, practitioner).fail(onError);

        $.when(pt, meds, practitioner, consent).done(function(patient, meds, practitioner, consent) {
          console.log("CONSENT: ", consent.data.entry[0].resource);
          let p = defaultPatient();

          practitioner = practitioner.data.entry[0];
          let practitionerName = practitioner.resource.name[0].given[0] + ' ' + practitioner.resource.name[0].family + ', ' + practitioner.resource.name[0].suffix;
          p.practitionerName = practitionerName;
          contract.practicioner = practitionerName;
          $('#pracName').html(p.practitionerName);
          
          let gender = patient.gender;
          p.gender = gender;
          $('#gender').html(p.gender);

          let birthdate = patient.birthDate;
          p.birthdate = birthdate;
          $('#birthdate').html(p.birthdate);
          
          if (typeof patient.name !== 'undefined') {
            let name = patient.name[0].given + ' ' + patient.name[0].family;
            p.name = name;
            contract.name = name;
            $('#name').html(p.name);
          }

          //still need: list of symptoms, pt pharmacy list, pharmacy hours
          
          var medsList = asyncGetMeds(meds.data.entry);
          Promise.all([medsList]).then(function(values){
            p.meds = values[0];
            $('#meds').html(p.meds);
            generatePDF();
          })

          
          
          

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


  async function getMedNameAsync(ref){
    let response = await fetch('https://r3.smarthealthit.org/' + ref);
    let data = await response.json();
    return data.code.text; //return name
  }

  async function getRxnormAsync(ref){ //this function works, but not asynchronously
    let response = await fetch('https://r3.smarthealthit.org/' + ref)
    
    let data = await response.json();
    console.log(data);
    return data.code.coding[0].code; // return rxnorm 
  }


  
  async function rxnormToSchedule(rxnorm){
    let response = await fetch('https://api.fda.gov/drug/ndc.json?search=openfda.rxcui:' + rxnorm);
    let data = await response.json();
    //console.log("DATA HERE: ", data)
    
    if (data.error != undefined){   //an error is defined, so there was an error
      response = await fetch('https://rxnav.nlm.nih.gov/REST/rxcui/' + rxnorm + '/allrelated.json'/*, {mode: 'no-cors'}*/);
      data = await response.json();
      let newRxnorm;
      try { newRxnorm = data.allRelatedGroup.conceptGroup[7].conceptProperties[0].rxcui; //sbd code
      } catch {
        newRxnorm = data.allRelatedGroup.conceptGroup[10].conceptProperties[1].rxcui; //scd code
      }
      console.log("New RxNorm: ", newRxnorm);
      let newResponse = await fetch('https://api.fda.gov/drug/ndc.json?search=openfda.rxcui:' + newRxnorm);
      let newData = await newResponse.json();
      console.log("DATA HERE: ", newData);
      try{ return newData.results[0].dea_schedule;
      } catch { return "--";}
    } else {
      try {
        return data.results[0].dea_schedule;
      } catch {
        return "-/-";
      }
    } 
  }


/**
 * 
 * @param {*} array 
 * This function 
 */
async function asyncGetMeds(array) {
  const allAsyncResults = [];
  let i = 0;
  for (const item of array) {    
    let medStatus = item.resource.status;
    let medRef = item.resource.medicationReference.reference;
    let encounter = item.resource.context.reference;
    let reason = await fetch('https://r3.smarthealthit.org/' + encounter);
    reason = await reason.json();
    try {reason = reason.reason[0].coding[0].display}
    catch {
      reason = reason.type[0].text;
    }
    let medName = await getMedNameAsync(medRef);
    let rxnorm = await getRxnormAsync(medRef);
    let schedule = await rxnormToSchedule(rxnorm);
    if (schedule == undefined){ schedule = "--";}
    console.log("contract:", contract);

    contract.medications[i] = {
      "name" : medName,
      "status" : medStatus,
      "schedule" : schedule,
      "reason" : reason
    }
    i++;

    allAsyncResults.push([medName, medStatus, rxnorm, schedule, reason]);  
  }
  
 
  return formatMeds(allAsyncResults);
}

/**
 * 
 * @param {*} Meds 
 * This function formats the array of medication information into a table for viewers convenience.
 */
function formatMeds(Meds) { 
  var formatTable = '<table class="table">' + '<tr><th>Medication Name</th><th>Status</th><th>RxNorm</th><th>DEA Schedule</th><th>Reason</th></tr>';
  for (const med of Meds) {
    formatTable = formatTable + '<tr><td>' + med[0] + '</td><td>' + med[1] + '</td><td>' + med[2] + '</td><td>' + med[3] + '</td><td>' + med[4] + '</td></tr>';
  }
  return formatTable + '</table>';
}



/*
This funciton generates the medical consent contract as a PDF. It pulls the relevant 
information from the contract object.
*/
async function generatePDF(){
  // create a document and pipe to a blob
  var doc = new jsPDF();
  doc.setProperties({title : contract.name + ' Medical COnsent Form'});
  let imgData = 'data:image/jpeg;base64,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'
  doc.addImage(imgData, 'JPEG', 70, 5, 50, 40);

  let title = "<h3>  <class='text_center'>  Getting the Best Result from Controlled Substance Medications: A Partnership Agreement </h3>";
  
  let p1 = "<p>This agreement is a basis for communication between my health care provider and myself. The goal of treatment is to help me or my dependent function better. My provider and I will be partners in creating the best treatment plan for me. As patient and health care provider, we respect each other&#39;s rights and accept our individual responsibilities.</p>"
  let p2 = "<p>I understand that <b>" + await contract.practicioner + "</b> (hereafter referred to in this agreement as the health care provider) is prescribing a controlled substance.</p>"
  let p3 = "<p>I am being prescribed a medication(s) that is a controlled substance; this means the use of this group of medications is regulated by Federal and State laws. The prescribing and dispensing of these medications are recorded in the Colorado Prescription Drug Monitoring Program website. This can be accessed by health care providers and pharmacists. It is my health care provider's responsibility to continually reevaluate my response to the medication, assess for side effects, and monitor adherence to treatment.</p>"
  let p4 = "<p>The following medications are covered under this controlled substance agreement:</p>"
  
  let medList = "<ul>";
  for (var med of await contract.medications){
    if (await med.schedule != '--') {
      let medx = "<li>" + med.name + " for " + med.reason + " which is an FDA Schedule " + med.schedule +  " drug. </li>";
      medList += medx;
    }
  }
  medList += "</ul>";

  let p5 = "<p>I, <b>" + await contract.name + "</b>, understand that adherence with this treatment agreement is necessary for continuation of treatment. My medications are only part of the overall treatment plan which may include psychotherapy, psychological assessments, counseling, physical therapy, vocational rehabilitation, other medications, or other recommended treatments as determined by my health care provider. Therefore, I agree to the following:</p>"
  let beforeList = "<span>The patient understands that it is equally important for providers that their patients on controlled substance medications will:  "
  let list = "<ul> <li>Take medication only at the dose and time/frequency prescribed.</li> <li> Fill prescriptions at one pharmacy of choice:</li> <li> Make no changes to the dose or how the medication is taken without first talking to the provider.</li> <li>Not ask for pain medications or controlled substances from other providers.  The patients will also tell every provider all medications they are taking and notify their provider if controlled medications are prescribed by any other physicians. </li> <li>Arrange for refills only through the provider&#39s clinic during regular office hours</li><li>  Ask for refills three business days in advance and not ask for refills earlier than agreed upon. </li> <li>Protect prescriptions and medications from loss, theft or damage.  A police report may be requested in cases of theft but does not guarantee prescription replacement.  It is very important to keep medications away from children because of the risk of overdose.  </li> <li>Keep medications only for their own use and not share them with others.  </li> <li>Be willing to be involved in programs that can help improve social, physical, or psychological functioning as well as daily or work activities.  </li> <li>Be willing to learn new ways to manage their symptoms by attempting step-by-step behavior and lifestyle changes in their daily life.  </li> <li>Understand that medications may be decreased or stopped if there is worrisome alcohol or illegal/street drug use.  </li> <li>Understand that under Colorado Law, it is a misdemeanor to drive under the influence of, or impaired by the use of controlled substances.  </li> <li>Be willing to bring medicine bottles to the clinic when asked.    </li> <li>Be willing to have random drug testing when asked.  Testing may be done to ensure that medications are being used safely and results will be considered protected health information. </li> <li>Be willing to schedule and keep follow-up appointments at requested intervals. </li> </ul></span>"
  let p6 = "<p> We agree that the provider may stop prescribing the medication or the patient may decide to stop taking the medication if there is no improvement in symptoms or function, there is loss of improvement from the medication, or there are significant side effects from the medication.  Talk to your provider prior to making any changes.</p>"
  let p7 = "<p>For patients taking opiate or sedative/sleep medications: Side effects of may include, but are not limited to, rash, nausea, constipation, itching, drowsiness, confusion, increased feeling of pain, breathing problems, heart problems, hormone problems and even death.  Dependence and addiction may occur with the use of these medications.  Overdose of narcotic pain medication or sedative medications can be very dangerous and even fatal.  We both realize and have discussed that there can be limitations to opioid therapy. It may not be helpful or only partially helpful and is only one part of the treatment.  </p>";
  let p8 = "<p>For patients taking stimulant medications: Side effects of stimulant medications may include, but are not limited to tics, psychosis, sleeping difficulty, heart problems, elevated blood pressure, priapism, rash, nausea, emotional lability and even death. Overdose of stimulant medications can be very dangerous and even fatal.  We both realize and have discussed that there can be limitations to medication therapy. It may not be helpful or only partially helpful and is only one part of the treatment.</p>";
  let p9 = "<p>We understand that if this agreement is not followed, the patient may not be able to obtain controlled medications from UCHealth primary care providers.  </p>";
  let p10 = "<p>We agree to work together in an active partnership, learning from both successes and failures, to find the most effective ways to control and improve symptoms and improve functioning.  </p>";
  let sig1 = '<p>  Patient Signature:_____________________________      Date:_________ </p>';
  let sig2 = '<p>  Provider Signature:____________________________      Date:_________  </p>';
  
  let html1 = title + p1 + p2 + p3 + p4 + medList;
  doc.fromHTML(html1, 10, 45, {'width' : 160});
  doc.addPage();
  let html2 = p5 + beforeList + list;
  doc.fromHTML(html2, 10, 10, {'width' : 160});
  doc.addPage();
  let html3 = p6 + p7+ p8+ p9+ p10 + sig1 +sig2;
  doc.fromHTML(html3, 10, 10, {'width' : 160});
 
  var string = doc.output('datauristring');
  var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
  //var x = window.open();
  //x.document.open();
  window.document.write(embed);
  //x.document.close();

}



window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#pracName').html(p.practitionerName);
    $('#name').html(p.name);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#meds').html(p.meds);
  };

})(window);
