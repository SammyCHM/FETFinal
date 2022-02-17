




//Building the classes that will hold the patient data

class Patient{
    constructor(name){
        this.name = name;
        this.problems= [];
    }
     addProblem(name, age){
         this.problems.push(new Problem(name,age));
     }
}

class Problem{
    constructor(name, age){
        this.name= name;
        this.age = age;
    }
}

  //Creating the CRUD - Create, Read, Update & Delete functions

class PatientService{
    static url = 'https://crudcrud.com/api/1780b76b0f784542867fb2aad8e9fa6c/patient';



    static getAllPatients(){
        return $.get(this.url);
    }

    static getPatient(id){
        return $.get(this.url + `/${id}`);
    }

    static createPatient(patient) {
        console.log("Patient create" + patient );
        return $.ajax({
            url: this.url, 
            dataType: 'json',
            data: JSON.stringify(patient),
            contentType: 'application/json',
            type: "POST"
        });
    }

    

    static updatePatient(patient){
        return $.ajax({
          url: this.url + `/${patient._id}`,
          dataType: 'json',
          data: JSON.stringify({
            // "patient" : patient.name,
            // "problems" : patient.problems}),
            "name" : patient.name,
            "problems" : patient.problems}),
        
          contentType: 'application/json',
        //   crossDomain: true,
          type: 'PUT'
       });

    }
  
    static deletePatient(id){
        return $.ajax({
            url: this.url+ `/${id}`,
            type: 'Delete'
        });
    }

}

class DOMManager{
  static patients;

  static getAllPatients(){
      PatientService.getAllPatients().then(patients => this.render(patients));
  }
    
  static createPatient(name){
    PatientService.createPatient(new Patient(name))
        .then(() => {
            return PatientService.getAllPatients();
        })
        .then((patients) => this.render(patients));
        console.log('at the bottom of create patient')
  }
      //Works! :)
  static deletePatient(id){
      PatientService.deletePatient(id)
      .then(() =>{
          return PatientService.getAllPatients();
      })
      .then((patients) => this.render(patients));
  }


    

         
    static addProblem(id){
        for (let patient of this.patients){
            if(patient._id == id){
              patient.problems.push(new Problem($(`#${patient._id}-problem-name`).val(), $(`#${patient._id}-problem-age`).val()));
                PatientService.updatePatient(patient)
                .then(() =>{
                    return PatientService.getAllPatients();
                })
                .then((patients) => this.render(patients));
            }
        }
    }

    static deleteProblem(patientId, problemName){
        for(let patient of this.patients){
            if(patient._id ==patientId){
                for(let problem of patient.problems){
                    if(problem.name == problemName){
                        patient.problems.splice(patient.problems.indexOf(problem),1);
                        PatientService.updatePatient(patient)
                        .then(() => {
                            return PatientService.getAllPatients();
                        })
                        .then((patients) => this.render(patients));
                    }
                }
            }
        }
    }

   
  static render(patients){
    this.patients = patients;
    $('#patientApp').empty();
    for(let patient of patients){
        $('#patientApp').prepend(
            `<div id="${patient._id}" class="card">
                <div class="card-header">
                <h2>${patient.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deletePatient('${patient._id}')">Delete</button>
                </div> 
                    <div class="card-body">
                    <div class="card">
                    <div class= "row">
                    <div class= "col-sm">
                           <input type="text" id="${patient._id}-problem-name" class="form-control" placeholder="Patient Health Issue">
                    </div>
                    <div class="col-sm">
                    <input type="text" id="${patient._id}-problem-age" class="form-control" placeholder="Patient Age">
                    </div>
                    </div>
                    <button id="${patient._id}-new-problem" onclick="DOMManager.addProblem('${patient._id}')" class="btn btn-primary form-control">Add</button>
                    
                   </div>
                    </div> 
                    </div>
                    </div><br> `

        );
                   for(let problem of patient.problems){
                        $(`#${patient._id}`).find('.card-body').append(
                            `<p>
                            <span id="name-${problem.name}"><strong>Name: </strong> ${problem.name}</span>
                           <span id="age-${problem.age}"><strong>Age: </strong> ${problem.age}</span>
                           <button class="btn btn-danger" onclick="DOMManager.deleteProblem('${patient._id}', '${problem.name}')">Delete Problem</button>`
                       );
                    }
    }
}
}

  
        
 
    
$('#create-new-patient').click(() => {
    DOMManager.createPatient($('#new-patient-name').val());
    $('#new-patient-name').val(" "); 
    
       });

DOMManager.getAllPatients();   