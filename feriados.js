let proxFeriados = [];

function proximosFeriados (arrayDeFeriados) {
    const today = new Date();
    let prox = [];
    for (feriado of arrayDeFeriados) {
        let feriadoDate = new Date(today.getFullYear(), feriado.mes - 1, feriado.dia);
        feriadoDate > today && prox.push(feriado);
    }
    return prox;
}

fetch("https://nolaborables.com.ar/api/v2/feriados/2022")
.then((response) => response.json())
.then((feriado) => {
    proxFeriados = proximosFeriados(feriado);
    const proxFeriado = proxFeriados[0];
    document.getElementById('proxferiadoFloat').innerHTML = 
    `<p>El día <b>${proxFeriado.dia}/${proxFeriado.mes}/2022</b> el estudio permanecerá cerrado por <b>${proxFeriado.motivo}</b></p>
    <button type="button" id="closeProxFeriado" onclick="document.getElementById('proxferiadoFloat').classList.add('displayNone')">x</button>`;
    document.getElementById('proxferiadoFloat').classList.remove('displayNone');
})

function checkIfLaborable (date){
    for (feriado of proxFeriados) {
        feriado.dia == date.getDate() && feriado.mes == date.getMonth() + 1 && 
        Swal.fire({
            icon: 'error',
            title: 'El día seleccionado el estudio permanecerá cerrado',
          })
}};