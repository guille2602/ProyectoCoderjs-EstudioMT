//INICIALIZACIÓN DE VARIABLES GLOBALES
const loginForm = document.querySelector('#loginInput');
let userForm = document.querySelector('#registerInput');
let userslist = []; 

//LEO SI ALGUIEN DEJÓ LA SESIÓN INICIADA PARA CARGAR LOS VENCIMIENTOS
let userData = JSON.parse(localStorage.getItem('userInformation'));
userData && hideloginButons();

//EVENTLISTENERS PARA CHEQUEO DE DATOS DEL FORMULARIO COMPLETOS
ri = registerInput
ri.addEventListener('change', () => {checkIfCompleted(); hideIfNotMono()});

function hideIfNotMono() {
  document.getElementById('regType').value != 1? document.getElementById('iva').classList.add('displayNone'): 
  document.getElementById('iva').classList.remove('displayNone');
}

//CONSTRUCTOR DE CLASE "CONTRIBUYENTE"
class Contribuyente {
  constructor (name, cuit, password, phone, type, autonom, sicoss, iva, iibb) {
    this.name = name,
    this.cuit = cuit,
    this.password = password,
    this.phone = phone,
    this.type = type,
    this.autonom = autonom,
    this.sicoss = sicoss,
    this.iva = iva,
    this.iibb = iibb
  }
}

//FETCH A REGUSER.JSON COMO EJEMPLO DE USUARIO CREADO ANTERIORMENTE

fetch('./userPassList.json')
.then((ulst) => ulst.json())
.then((ulst) => {userslist = ulst});

//CREACIÓN DE USUARIO TOMANDO DATOS DEL FORMULARIO DE REGISTRO
function createUserFromForm () {
  const newUser = new Contribuyente (
    userForm.regName.value,
    userForm.regCUIT.value,
    userForm.regPass.value,
    userForm.regCelNum.value,
    userForm.regType.value,
    userForm.regImp.checked,
    userForm.regSegSoc.checked,
    userForm.regIva.checked,
    userForm.regIngresosBrutos.value
  );
  return newUser;
}

function createUser(users){
  newUser = createUserFromForm();
  users.push(newUser);
}

//EDICIÓN DEL FORMULARIO DE REGISTRO
function preloadFormFromLS() {
  let userData = JSON.parse(localStorage.getItem('userInformation'));
  userForm.regName.value = userData.name;
  userForm.regCUIT.value = userData.cuit;
  userForm.regPass.value = userData.password;
  userForm.regCelNum.value = userData.phone;
  userForm.regType.value = userData.type;
  userForm.regImp.checked = userData.autonom;
  userForm.regSegSoc.checked = userData.sicoss;
  userForm.regIva.checked = userData.iva;
  userForm.regIngresosBrutos.value = userData.iibb;
}

//EVITAR ENVIAR FORMULARIO CON TECLA ENTER

let registerModal = document.querySelector('#registerModal');
registerModal.addEventListener('keypress', (event) => event.keyCode == 13? event.preventDefault(): null);

//CHEQUEO SI SE COMPLETARON LOS DATOS Y EL TAMAÑO DEL CUIT ANTES DE ENVIAR LOS DATOS
function checkIfCompleted(){
  let validation1 = userForm.regName.value !== "" && userForm.regType.value !== "" && userForm.regCUIT.value.length == 11 && userForm.regPass.value !== "";
  let validation2 = true;
  if (localStorage.getItem('userInformation') == null && userForm.regCUIT.value != "" && checkIfCUITExists(userForm.regCUIT.value)) {
    Swal.fire({
      icon: 'error',
      title: 'El CUIT ya se encuentra registrado'
    })
  }
  localStorage.getItem('userInformation') !== null? document.querySelector('#regCUIT').setAttribute('disabled',"") :document.querySelector('#regCUIT').removeAttribute('disabled');
  validation1 && validation2 && document.querySelector('#regSubmit').removeAttribute('disabled');
  let validation = validation1 && validation2? true : false;
  !validation &&  document.querySelector('#regSubmit').setAttribute('disabled',"")
  return validation
}

function checkIfCUITExists(cuit) {
  for (u of userslist) {
    if (u.cuit == cuit){
     return true;
     break;
  } else {return false}
  }}

//CREACIÓN DE NUEVO USUARIO
function signUp(event) {
  event.preventDefault();
  if (userData == null) {
    createUser(userslist);
    Swal.fire({
      icon: 'success',
      title: 'Usuario creado exitosamente',
    })
  } else {
    const i = userslist.findIndex(us => us.cuit == registerInput.regCUIT.value)
    userslist[i] = createUserFromForm ();
    createUserInLocalStorage(userslist, registerInput.regCUIT.value);
    showredBar();
    Swal.fire({
      icon: 'success',
      title: 'Datos actualizados correctamente',
    })
  }
}

//LOGUEO Y VALIDACIONES *** VER SI AGREGO AWAIT ***
function loginF(e){
  e.preventDefault();
  const user = loginForm.cuit.value;
  const password = loginForm.password.value;
  const validation = user !== "" && password !=="" ? true : false;
  if (validation) {
    if (findAndValidateUser(userslist, user, password)) {
      createUserInLocalStorage(userslist, user);
      hideloginButons();
      showredBar();
      document.querySelector('#regCUIT').setAttribute('disabled',"");
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Usuario o contraseña incorrectos',
    });
      resetLoginForm()
    }
  } 
  else {
    Swal.fire({
      icon: 'error',
      title: 'Por favor complete todos los datos',
  })
  }
}

//VALIDACIÓN DE LOGUEO DEL USUARIO - SI SOBRA TIEMPO AGREGAR FETCH
function findAndValidateUser(usersArray, cuit, password){
  const found = usersArray.find((u) => u.cuit == cuit);
  let validate = false;
  if (found) {
    validate = found.password == password? true : false;
  }
  return validate;
}

//ALMACENAMIENTO DE USUARIO EN LOCAL STORAGE
function createUserInLocalStorage(usersArray, cuit) {
  let found = usersArray.find((u) => u.cuit == cuit);
  const foundString = JSON.stringify(found);
  localStorage.setItem('userInformation',foundString);
}

//VACÍA EL FORMULARIO DE LOGIN
function resetLoginForm() {
  loginForm.cuit.value = "";
  loginForm.password.value = "";
}

let loggedUser = document.querySelector('#loggedUser');
loggedUser.addEventListener('click', () => setTimeout(() => {preloadFormFromLS(),1}))

//REEMPLAZO DEL NAVBAR AL LOGUEARSE
function hideloginButons() {
  let btn = document.querySelector('#loginButton');
  btn.classList.add('displayNone');
  let usr = document.querySelector('#loggedUser');
  userData = JSON.parse(localStorage.getItem('userInformation'));
  usr.innerHTML = userData.name;
  usr.classList.remove('displayNone');
  document.querySelector('#registerButton').classList.add('displayNone');
}

//SECCIÓN DE ***MIS VENCIMIENTOS***

//PERSONALIZACIÓN DE BARRA DE VENCIMIENTOS

function showredBar() {
  let userData = JSON.parse(localStorage.getItem('userInformation'))
  loadCalendar();
  document.getElementById('infobar').classList.remove('displayNone');
  userData.autonom? 
  document.querySelector('#autonomTable').classList.remove('displayNone'): 
  document.querySelector('#autonomTable').classList.add('displayNone');
  userData.iva? 
    document.querySelector('#ivaTable').classList.remove('displayNone'): 
    document.querySelector('#ivaTable').classList.add('displayNone');
  userData.iibb != 0? 
    document.querySelector('#iibbTable').classList.remove('displayNone'): 
    document.querySelector('#iibbTable').classList.add('displayNone');
  userData.sicoss? 
    document.querySelector('#sicossTable').classList.remove('displayNone'): 
    document.querySelector('#sicossTable').classList.add('displayNone');
  !userData.autonom && !userData.iva && userData.iibb == 0 && !userData.sicoss && document.getElementById('infobar').classList.add('displayNone'); 
}

function loadCalendar(){
    let userData = JSON.parse(localStorage.getItem('userInformation'));
    const lastDigit = userData.cuit % 10;
    const autonomTitle = document.getElementById('autonomTitle');
    const autonomDate = document.getElementById('autonomDate');
    userData.type == 1? autonomTitle.innerHTML = 'Autónomos' : autonomTitle.innerHTML = 'Monotributo';
    userData.type == 1? 
    autonomDate.innerHTML = `${vencimientosAutonomos[lastDigit]}/${month}/${year}` : 
    autonomDate.innerHTML = `${vencimientosMonotributo}/${month}/${year}`;
    
    const iibbDate = document.getElementById('iibbDate');
    iibbDate.innerHTML = 
    userData.iibb == 1 && `${vencimientosIIBBARBA[lastDigit]}/${month}/${year}` ||
    userData.iibb == 2 && `${vencimientosIIBBAGIP[lastDigit]}/${month}/${year}` ||
    userData.iibb == 3 && `${vencimientosCM[lastDigit]}/${month}/${year}`;

    const ivaDate = document.getElementById('ivaDate');
    ivaDate.innerHTML = `${vencimientosIVA[lastDigit]}/${month}/${year}`
    
    const sicossDate = document.getElementById('sicossDate');
    sicossDate.innerHTML = `${vencimientosSICOSS[lastDigit]}/${month}/${year}`

  };

//DESLOGUEO DE USUARIO
function logout(event) {
  event.preventDefault();
  localStorage.removeItem('userInformation')
  document.location.reload();
}

//CARGA DE VENCIMIENTOS POR FETCH A JSON LOCAL
fetch("./vencimientos.json")
.then((response) => response.json())
.then ( (vencimientos) => {
  const venc = vencimientos[new Date().getMonth()];
  vencimientosAutonomos = venc.autonomos;
  vencimientosMonotributo = venc.monotributo;
  vencimientosIVA = venc.IVA;
  vencimientosSICOSS = venc.SICOSS;
  vencimientosIIBBARBA = venc.ARBA;
  vencimientosIIBBAGIP = venc.AGIP;
  vencimientosCM = venc.CM;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  localStorage.getItem("userInformation") && showredBar() && hideloginButons();
});