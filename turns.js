//Clase para crear un objeto persona con los datos del turno.

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

// Creo una función para solicitar una fecha para el turno

    function askForDate(){
        let day = parseInt(prompt('Ingrese un día para el turno'));
        let month = parseInt(prompt('Ingrese el mes en formato numérico'));
        let year = new Date();
        year = year.getFullYear();
        return new Date(year, month, day);
    }

//Creo un turno de prueba y una lista de turnos

let julio = new Person ('Julio' , '1133969444' , 2 , ['Impuestos', 'Sueldos'], 2, true, 1, new Date( 2022,08,31,14,30))
let turnos = [];
turnos.push(julio);

//Función para asignar un turno a una persona

function requestTurn() {

    let name = prompt('Ingrese su nombre');
    let tel = prompt('Ingrese su número de teléfono o celular');
    let cantTopics = parseInt(prompt('¿Cuántos temas desea consultar?'));
    let meetingTopics = [];
    let type = 0;
    let trueOrFalse = true;

    // Consulto tipo de contribuyente para saber la duración del turno 
 
    do {
        type = parseInt(prompt('Ingrese "1" si es responsable inscripto o sociedad, "2" si es monotributista'));
        if (type == 1) {
        // Duración de turnos para responsables insriptos o sociedades.
            if (cantTopics <= 3) {
                alert('Su turno tendrá una duración máxima de una hora');
                } else {
                    alert('Su turno tendra una duración máxima de 2 horas');
                }
            trueOrFalse = false;
        //Duración de turnos para monotributistas.
        } else if (type == 2) {
            alert('Su turno tendrá una duración máxima de media hora');
            trueOrFalse = false;
        } else {
            trueOrFalse = true;
            alert('Por favor ingrese una opción válida');
            }
    } while (trueOrFalse);
    
    // Asigno en un vector los temas de la reunión.

    for (i = 1; i <= cantTopics; i++){
        meetingTopics.push(prompt(`Ingrese en pocas palabras el tema ${i} de la reunión`));
    }  
    console.log(meetingTopics);

    // Solicito un día para la reunión

    let dateImput = askForDate();

    // Creo el objeto persona con los datos obtenidos.

    let persona = new Person (name, tel, cantTopics, meetingTopics, type, true, 1, dateImput);
    console.log(persona);
    alert(name + ', tu turno se ha generado correctamente, se coordinará telefónicamente al número ' + tel + 
    ' el horario de la reunión \n¡Muchas gracias!')
    return persona;
}

//Función que agrega el turno al array de turnos.

function addTurn(turnsList) {
    turnsList.push(requestTurn());
    const turnID = turnsList.length;
    turnsList[turnsList.length - 1].assignTurnId(turnID);
    console.log(turnsList);
    alert(`Su número de turno es ${turnID}`);
    return turnsList;
}

//Busca un turno por número de turno.

function findTurn(turnNro, turnsList) {
    const found = turnsList.find((turno) => turno.turn == turnNro);
    return found;
}

// Consultar un turno

function findTurnForUser(turnsList) {
    const id = parseInt(prompt('Ingrese el número de turno a buscar'));
    const turn = findTurn(id, turnsList);
    alert(`Usted tiene turno para el día ${turn.date.getDate()}/${turn.date.getMonth()}/${turn.date.getFullYear()} por los siguientes temas: ${turn.info.toString()}`)
}