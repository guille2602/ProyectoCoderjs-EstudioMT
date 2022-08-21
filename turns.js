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
    let meetingTopics = "";
    let type = 0;

// Consulto tipo de contribuyente para saber la duración del turno (1hs para R.I o sociedad, 30min para monotributista)
    do {
        type = parseInt(prompt('Ingrese "1" si es responsable inscripto o sociedad, "2" si es monotributista'));
    } while (type != 1 || type != 2);

    if (type = 1) {
        alert('Su turno tendrá una duración máxima de una hora');
    } else {
        alert('Su turno tendrá una duración máxima de media hora');
    }
    
// Asigno en una cadena de texto los temas de la reunión para poder organizar los tiempos y el profesional
    for (i = 0; i < cantTopics; i++){
        meetingTopics = meetingtopics + "\n" + prompt(`Ingrese generalizando en pocas palabras el tema ${i} de la reunión`);
        }

    const persona = new Person (name, tel, cantTopics, meetingTopics, type);
    console.log (persona);
    alert('Su turno se ha generado correctamente, se coordinará telefónicamente el día de la reunión. ¡Muchas gracias!')

    //Devuelve un objeto persona
    return persona;
}