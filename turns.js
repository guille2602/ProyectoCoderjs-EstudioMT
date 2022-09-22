//Clase para crear un objeto persona con los datos del turno.

function hideInfo(item, event) {
    event.preventDefault();
    document.querySelector(item).classList.add('displayNone');
}

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
    
    cancelTurn () {
        this.active = false;
    }

    assignTurnId (id) {
        this.turn = id;
    }

    modifyTurn (date) {
        this.date = date;
    }
}

//Creo un turno de prueba y una lista de turnos
let DateTime = luxon.DateTime;
let dt = DateTime.local(2022,8,31,14,30);
let julio = new Person ('Julio' , '1133969444' , 2 , ['Impuestos', 'Sueldos'], 2, true, 1, dt);
let turnos = [];
turnos.push(julio);

//Función para asignar un turno a una persona

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
    locale: {
        "firstDayOfWeek": 0,
    }
};

flatpickr("#turnDate", config);

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
    let luxonDate = luxon.DateTime.fromISO(flatpickr.parseDate(date, "Z").toISOString());

    console.log(date);
    //Manejo de fechas del turno - REEMPLAZAR POR LIBRERÍA LUXON
    let type = document.querySelector('#type').value; // Para saber duración del turno

    //Creación de objeto persona con los datos del formulario
    const persona = new Person (name, tel, cantTopics, meetingTopics, type, true, 0, luxonDate);
    console.log(persona); 
    return persona;
}

//Evento de click en "Pedir turno"

let requestTurnButton = document.getElementById('requestTurnButton');
requestTurnButton.addEventListener('click', () => {
document.querySelector('#turnForm').classList.remove('displayNone');

    //Tomar datos del usuario logueado.
    isUserLogged = localStorage.getItem('userInformation');
    if (isUserLogged != null) {
        let userLogged = JSON.parse(isUserLogged);
        let form = document.querySelector('#turnForm');
        form.name.value = userLogged.name;
        form.type.value = userLogged.type;
        form.tel.value = userLogged.phone;
    } 
    });

//Función que agrega el turno al array de turnos // *** Mejorar para que verifique que no se repitan turnos *** 

function addTurn(turnsList, e) {
    if (!isEmptyForm()) {
        turnsList.push(requestTurn());
        const turnID = turnsList.length;
        turnsList[turnsList.length - 1].assignTurnId(turnID);
        console.log(turnsList);
        alert(`Su número de turno es ${turnID}`);
        hideInfo('#turnForm', e);
        return turnsList;
    } else {alert('Por favor completa todos los datos del formulario')}
}

// //Busca un turno por número de turno.

function findTurn(turnNro, turnsList) {
    const found = turnsList.find((turno) => turno.turn == turnNro);
    return found;
}

// Consultar un turno *** HAY QUE AGREGAR SWEETALERT CON ASYNC PARA QUE LEA EL VALOR INGRESADO***

function findTurnForUser(turnsList) {
    const id = parseInt(prompt('Ingrese el número de turno a buscar'));
    const turn = findTurn(id, turnsList);
    if (turn) {
        turn.type = 2? duration = "media hora": duration = "una hora";

        Swal.fire({
            icon: 'info',
            title: 'Información del turno',
            html:`<br>Hola ${turn.name}!</br><br>Usted tiene turno el día <b>${turn.date.toLocaleString()}</b> <br> 
            a las ${turn.date.hour}:${turn.date.minute}<br> 
            Los temas de la reunión son: ${turn.info.toString()} <br>
            La duración máxima de la reunión es de ${duration}`
        })
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

//Para evitar que Enter envie el formulario
let formIntroEvent = document.querySelector('#turnForm');
formIntroEvent.addEventListener('keypress', (event) => event.keyCode == 13? event.preventDefault(): null);

function isEmptyForm () {
    let name = document.querySelector('#name').value;
    let tel = document.querySelector('#tel').value;
    let cantTopics = document.querySelector('#cantTopics').value;
    if (name == "" || tel == ""  || cantTopics == 0) {
        return true}
        else {return false}
}

