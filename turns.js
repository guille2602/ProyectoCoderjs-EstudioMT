//CLASE PARA CREAR UN OBJETO PERSONA CON LOS DATOS DEL TURNO
class Person {
    constructor (name, phone, topics, info, type, active, turn, date) {
        this.name = name;
        this.phone = phone;
        this.topics = topics;
        this.info = info;
        this.type = type;
        this.active = active;
        this.turn = turn; 
        this.date = date;
    }
    assignTurnId(id) {
        this.turn = id;
    }
}

//IMPORTACIÓN DE TURNOS DE PRUEBA DESDE JSON

let turnos = [];
let DateTime = luxon.DateTime;
fetch('./regUsers.json')
.then((turns) => turns.json())
.then((turns) =>{
    for (t of turns) {t.date = DateTime.fromISO(t.date)}
    turnos = turns;
})

//IMPLEMENTACIÓN DE LIBRERÍA FLATPICKR PARA MANEJO DE FECHAS (PARA DELIMITAR HORARIOS Y DÍAS LABORALES)

config = {
    enableTime: true,
    altInput: true,
    altFormat: "d-m-Y (H:i)",
    minDate: 'today',
    minTime: "09:00",
    maxTime: "16:30",
    disable: [
        function(date) {
            // return true to disable
            return (date.getDay() === 0 || date.getDay() === 6);
        }
    ],
    locale: {"firstDayOfWeek": 0},
    onClose: (date) => checkIfLaborable(date[0]),
};

flatpickr("#turnDate", config);

// FUNCIÓN PARA PEDIR UN TURNO

function requestTurn() {
    document.querySelector('#turnForm').classList.remove('displayNone');
    let name = document.querySelector('#name').value;
    let tel = document.querySelector('#tel').value;
    let cantTopics = document.querySelector('#cantTopics').value;
    let meetingTopics = [];
    for (i = 1; i <= cantTopics; i++) {
        let topic = document.querySelector(`#tema${i}`).value;
        meetingTopics.push(topic);
    }
    let date = document.querySelector('#turnDate').value;
    date? date = luxon.DateTime.fromISO(flatpickr.parseDate(date, "Z").toISOString()) : null;
    let type = document.querySelector('#type').value;
    const persona = new Person (name, tel, cantTopics, meetingTopics, type, true, 0, date);
    return persona;
}

// BUSQUEDA DE TURNOS

function findTurn(turnNro, turnsList) {
    const found = turnsList.find((turno) => turno.turn == turnNro);
    if (found?.active == true) return found;
}

async function findTurnForUser(turnsList) {
    const {value: id} = await Swal.fire({
        title: 'Consultar turnos',
        text: 'Por favor ingrese el número de su turno',
        input: 'number',
    });
    const turn = findTurn(id, turnsList);
    if (turn) {
        tempVar = id - 1;
        let duration = turn.type == 2? "media hora": "una hora";
        Swal.fire({
            icon: 'info',
            title: 'Información del turno',
            html:`<br>Hola ${turn.name}!</br><br>Usted tiene turno agendado para el día:<br> 
            <b>${turn.date.toLocaleString()} a las ${turn.date.hour}:${turn.date.minute} hs.</b><br><br>
            Los temas de la reunión son: <br>${turn.info.toString().replace(",","<br>")}`,
            showCancelButton: true,
            cancelButtonText: 'Cerrar',
            confirmButtonText: 'Cancelar turno',
            confirmButtonColor: '#dc4c23',
            cancelButtonColor: '#0094BC',
            footer:`<p style="font-size: 8pt; margin: 0">La duración máxima de la reunión es de ${duration}</p>`
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '¿Está seguro que desea cancelar el turno?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#dc4c23',
                    cancelButtonColor: '#0094BC',
                    confirmButtonText: 'Si, confirmar',
                    cancelButtonText: 'Cancelar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        turnsList[id - 1].active = false;
                        Swal.fire({
                        confirmButtonColor: '#0094BC',
                        title:'Su turno ha sido cancelado correctamente',
                        confirmButtonText: 'Aceptar'
                    })
                    }
                  })
            }})
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Turno no encontrado',
        })
    }
}

function generateTopicCamps() {
    document.querySelector('#camp6').innerHTML = ""
    let cantCamps = document.getElementById('cantTopics').value;
    for (i = 1 ; i <= cantCamps; i++){
        const newLabel = document.createElement("label");
        newLabel.setAttribute("for",`tema${i}`);
        newLabel.innerHTML = `Ingrese tema ${i}`;
        document.querySelector('#camp6').append(newLabel);
        const newImput = document.createElement("input");
        newImput.setAttribute("type","text");
        newImput.setAttribute("id",`tema${i}`);
        newImput.setAttribute("name",`tema${i}`)
        document.querySelector('#camp6').append(newImput);
    }
}

let cantTemas = document.querySelector('#cantTopics');
cantTemas.addEventListener('input', () => generateTopicCamps());

//PREVENCIÓN DE ENVÍO DE FORMULARIO CON TECLA ENTER

let formIntroEvent = document.querySelector('#turnForm');
formIntroEvent.addEventListener('keypress', (event) => event.keyCode == 13? event.preventDefault(): null);

//EVENT LISTENERS DE PEDIR TURNO

let submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', () => submitTurnForm(event));

let requestTurnButton = document.getElementById('requestTurnButton');
requestTurnButton.addEventListener('click', () => {
    document.querySelector('#turnForm').classList.remove('displayNone');
    //TOMAR LOS DATOS DEL LOCAL STORAGE SI EL USUARIO YA ESTÁ LOGUEADO.
        isUserLogged = localStorage.getItem('userInformation');
        if (isUserLogged != null) {
            let userLogged = JSON.parse(isUserLogged);
            let form = document.querySelector('#turnForm');
            form.name.value = userLogged.name;
            form.type.value = userLogged.type;
            form.tel.value = userLogged.phone;
        } 
});

let cancelBTN = document.getElementById('cancel');
cancelBTN.addEventListener('click',(event) => {
    event.preventDefault();
    hideInfo('#turnForm');
    document.querySelector('#turnForm').reset();
    generateTopicCamps();
})

//INCORPORACIÓN DE TURNOS AL ARRAY DE TURNOS - (PARA PROBAR, EL TURNO 1 SE ENCUENTRA CANCELADO, DEBERÍA DE NO ENCONTRARLO)

function hideInfo(item) {
    document.querySelector(item).classList.add('displayNone');
}

function addTurn(turnsList) {
    turnsList.push(requestTurn());
    const turnID = turnsList.length;
    turnsList[turnsList.length - 1].assignTurnId(turnID);
    Swal.fire({
        icon: 'info',
        title: `Su número de turno es ${turnID}`,
        });
    hideInfo('#turnForm');
    return turnsList;
}

//VALIDACIÓN DE CAMPOS VACÍOS ANTES DE ENVIAR EL FORMULARIO

function turnformValidation() {
    const nm = document.querySelector('#name').value;
    const tdate = document.querySelector('#turnDate').value;
    const tel = document.querySelector('#tel').value;
    const canT = document.querySelector('#cantTopics').value;
    let validation1 = nm !== "" && tdate !== "" && tel !== ""  && canT !== 0
    let validation2 = true;
    if (canT) {
        for (i = 1; i <= canT; i++) {
            if (document.getElementById(`tema${i}`).value == "") {validation2 = false};
        }
    } 
    const validation = validation1 && validation2
    return validation;
}

function submitTurnForm(event){
    event.preventDefault();
    const val = turnformValidation();
    val? addTurn(turnos) : Swal.fire({
        icon: 'warning',
        title: `Complete todos los datos del formulario`,
    }); 
    val && document.querySelector('#turnForm').reset() && generateTopicCamps();
}

// HISTORIAL DE TURNOS (EL IDENTIFICADOR PARA LOS TURNOS ES EL NÚMERO DE TELÉFONO)

let turnsHistBTN = document.querySelector('#turnsHistBTN');
turnsHistBTN.addEventListener('click', () => {
    const logedUsr = JSON.parse(localStorage.getItem('userInformation'));
    completeTurnsRcrd(logedUsr.phone);
})

function completeTurnsRcrd(phNr){
    const turnsHist = turnos.filter((trn) => trn.phone == phNr);
    const turnsTable = document.querySelector('#turnsRecord');
    let status = "";
    let today = DateTime.now();
    if (turnsHist.length != 0) {
        for (tn of turnsHist) {
            //Estado del turno
            if (tn.active) {
                status = today > tn.date? "Válido": "Pendiente";
            } else {status = "Cancelado"};
            let temas = tn.info.toString().replace(",","<br>");
            const row = document.createElement('tr');
            row.classList.add('table-striped');
            row.innerHTML = ` 
                <td>${tn.turn}</td>
                <td>${tn.date.toLocaleString(DateTime.DATETIME_MED)}</td>
                <td>${status}</td>
                <td>${temas}</td>
                `;
            turnsTable.appendChild(row);
        }
    }
}

//RESETEAR HISTORIAL DE TURNOS AL CERRARLO

let closeTurnsRecordBTN = document.querySelector('#closeTurnsRecordBTN');
closeTurnsRecordBTN.addEventListener('click', () => resetTurnsRcrd());

function resetTurnsRcrd(){
    document.querySelector('#turnsRecord').innerHTML=`
    <tr>
    <th class="col-sm-1 col-md-1 col-lg-1 col-xl-1">Nº</th>
    <th class="col-sm-3 col-md-3 col-lg-3 col-xl-3">Fecha</th>
    <th class="col-sm-3 col-md-3 col-lg-3 col-xl-3">Estado</th>
    <th class="col-sm-5 col-md-5 col-lg-5 col-xl-5">Temas</th>
    </tr>`
}