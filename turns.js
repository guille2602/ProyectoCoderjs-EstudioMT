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

let julio = new Person ('Julio' , '1133969444' , 2 , ['Impuestos', 'Sueldos'], 2, true, 1, new Date(2022,08,31,14,30))
let turnos = [];
turnos.push(julio);

//Función para asignar un turno a una persona (06/09/2022 - Reemplazado prompt por formulario)

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
    let type = document.querySelector('#type').value;
    let day = document.querySelector('#day').value;
    let month = document.querySelector('#month').value;
    let year = document.querySelector('#year').value;
    let schedule = document.querySelector('#schedule').value;
    let date = new Date(year, month, day, schedule, 00);
    const persona = new Person (name, tel, cantTopics, meetingTopics, type, true, 0, date);
    console.log(persona); 
    return persona;
}

//Función que agrega el turno al array de turnos.

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

// Consultar un turno

function findTurnForUser(turnsList) {
    let blackBackground = document.getElementById("blackBackground");
    blackBackground.classList.remove("displayNone");
    const id = parseInt(prompt('Ingrese el número de turno a buscar'));
    const turn = findTurn(id, turnsList);
    if (turn) {

        let duration = "";
        if (turn.type = 2) {
            duration = "media hora";}
        else {
            duration = "una hora"}

        let text = `<br>Hola ${turn.name}!</br><br>Usted tiene turno el día <b>${turn.date.toLocaleString()}</b> <br>
        Los temas de la reunión son: ${turn.info.toString()} <br>
        La duración máxima de la reunión es de ${duration}`;
        document.querySelector("#turnDetails").innerHTML = text;
    } else {
        document.querySelector("#turnDetails").innerHTML = "<br>Turno no encontrado";
        if (!document.querySelector("#addedButton")) {
            let newTurnButton = document.createElement("button");
            newTurnButton.innerHTML = "Consultar nuevamente";
            newTurnButton.setAttribute("onclick","findTurnForUser(turnos)");
            newTurnButton.setAttribute("id","addedButton")
            document.querySelector("#turnButtons").append(newTurnButton);
        }
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
formIntroEvent.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
});

function isEmptyForm () {
    let name = document.querySelector('#name').value;
    let tel = document.querySelector('#tel').value;
    let cantTopics = document.querySelector('#cantTopics').value;
    let day = document.querySelector('#day').value;
    let month = document.querySelector('#month').value;
    let year = document.querySelector('#year').value;
    if (name == "" || tel == ""  || cantTopics == "0" || day == "" || month == "" || year == "") {
        return true}
        else {return false}
}