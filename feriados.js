function proximoFeriado (arrayDeFeriados) {
    const today = new Date();
    for (feriado of arrayDeFeriados) {
        let feriadoDate = new Date(2022, feriado.mes, feriado.dia);
        if (feriadoDate >= today ) {
            prox = feriado;
            break;  
        }  
    }
    return prox;
}

fetch("https://nolaborables.com.ar/api/v2/feriados/2022")
.then((response) => response.json())
.then((feriado) => {
    const proxFeriado = proximoFeriado(feriado);
    document.getElementById('proxferiadoFloat').innerHTML = 
    `<p>El día <b>${proxFeriado.dia}/${proxFeriado.mes}/2022</b> el estudio permanecerá cerrado por <b>${proxFeriado.motivo}</b></p>
    <button type="button" id="closeProxFeriado" onclick="document.getElementById('proxferiadoFloat').classList.add('displayNone')">x</button>`;
    document.getElementById('proxferiadoFloat').classList.remove('displayNone');
}
)

//Se va a agregar validación de fecha seleccionada para turnos con fechas de feriados para evitar sacar turno un feriado.