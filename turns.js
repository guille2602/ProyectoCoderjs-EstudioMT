//Función para crear un objeto persona

function Person (name, phone, topics, info, type) {
    this.name = name;
    this.phone = phone;
    this.topics = topics;
    this.info = info;
    this.type = type;
}

//Función para asignar un turno a una persona

function requestTurn() {

    let name = prompt('Ingrese su nombre');
    let tel = prompt('Ingrese su número de teléfono o celular');
    let cantTopics = parseInt(prompt('¿Cuántos temas desea consultar?'));
    let meetingTopics = [];
    let type = 0;
    let trueOrFalse = true;

// Consulto tipo de contribuyente para saber la duración del turno 
// Duración: 1h para R.I o sociedad si tiene menos de 3 temas, 2hs si son más de 3 temas / 30 min. para monotributistas.
 
    do {

        type = parseInt(prompt('Ingrese "1" si es responsable inscripto o sociedad, "2" si es monotributista'));
        if (type == 1) {
            if (cantTopics <= 3) {
                alert('Su turno tendrá una duración máxima de una hora');
                } else {
                    alert('Su turno tendra una duración máxima de 2 horas');
                }
            trueOrFalse = false;
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

    const persona = new Person (name, tel, cantTopics, meetingTopics, type);
    console.log(persona);
    alert(name + ', tu turno se ha generado correctamente, se coordinará telefónicamente al número ' + tel + ' el día de la reunión \n¡Muchas gracias!')

    //Devuelve un objeto persona con la información del turno.
    return persona;
    }

//Función provisoria, hay que reemplazarlo por uno que reciba una lista de turnos y agregue otro.
function addTurn() {
    let turnsList = [];
    turnsList.push(requestTurn());
    console.log(turnsList);
    return turnsList;
}