//Vencimientos mensuales
const vencimientosAutonomos = [05,05,05,05,06,06,06,07,07,07];
const vencimientosMonotributo = 20;
const vencimientosIVA = [19,19,20,20,21,21,22,22,23,23];
const vencimientosSICOSS = [09,09,09,09,12,12,12,13,13,13];
const vencimientosIIBBARBA = [19,20,21,22,23,26,27,28,29,30];
const vencimientosIIBBAGIP = [12,12,13,13,14,14,15,15,16,16];
const vencimientosCM = [15,15,15,16,16,16,19,19,20,20];
const month = "09";
const year = 2022;

//Inicialización de variables globales
const loginForm = document.querySelector('#loginInput');
let userForm = document.querySelector('#registerInput');
let userslist = []; 
let userData = JSON.parse(localStorage.getItem('userInformation'));

//Chequeo que los datos de registro se hayan completado
userReg = userForm.regName;
userReg.addEventListener('change', () => checkIfCompleted());
userCUIT = userForm.regCUIT;
userCUIT.addEventListener('change', () => {checkIfCompleted()});
userType = userForm.regType;
userType.addEventListener('change', () => {checkIfCompleted(); hideIfNotMono()});

function hideIfNotMono () {
  document.getElementById('regType').value != 1? document.getElementById('iva').classList.add('displayNone'): 
  document.getElementById('iva').classList.remove('displayNone');
}

//Constructor de contribuyente
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

//Creación de usuario desde los datos del formulario de registro
function createUser(users){
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
  )
  users.push(newUser);
}

//Chequeo que los datos de registro nombre y tipo de usuario sean completados y el tamaño del cuit para poder crear usuario nuevo.
function checkIfCompleted(){
  let validation = userForm.regName.value !== "" && userForm.regType.value !== "" && userForm.regCUIT.value.length == 11? true : false;
  validation? document.querySelector('#regSubmit').classList.remove('displayNone') : false;
  return validation
}

//Función de creación de un nuevo usuario. 
function signUp(event) {
  event.preventDefault();
  createUser(userslist);
  Swal.fire({
    icon: 'success',
    title: 'Usuario creado exitosamente',
  })
}

//Función de logueo de usuario con sus respectivas validaciones
function loginF(e){
  e.preventDefault();
  const user = loginForm.cuit.value;
  const password = loginForm.password.value;
  const validation = user !== "" && password !=="" ? true : false;
  if (validation) {
    if (findAndValidateUser(userslist, user, password)) {
      createUserInLocalStorage(userslist, user);
      // let userData = JSON.parse(localStorage.getItem('userInformation'))
      hideloginButons();
      showredBar();
    } else {
      alert('Usuario o contraseña incorrectos');
      resetLoginForm()
    }
  } 
  else {alert('Complete todos los datos')}
}

//Guarda en el local storage los datos del usuario
function createUserInLocalStorage(usersArray, cuit) {
  const found = usersArray.find((u) => u.cuit == cuit);
  const foundString = JSON.stringify(found);
  localStorage.setItem('userInformation',foundString);
}

//Vacía el formulario de login
function resetLoginForm() {
  loginForm.cuit.value = "";
  loginForm.password.value = "";
}

//Encontrar usuario en el array de usuarios y verificar que la contraseña coincida
function findAndValidateUser(usersArray, cuit, password){
  const found = usersArray.find((u) => u.cuit == cuit);
  let validate = false;
  if (found) {
    validate = found.password == password? true : false;
  }
  return validate;
}

//Función para reemplazar los botones del header al loguearse
function hideloginButons() {
  let btn = document.querySelector('#loginButton');
  btn.classList.add('displayNone');
  let usr = document.querySelector('#loggedUser');
  usr.innerHTML = 'Salir';
  // usr.innerHTML = userData.name;
  usr.classList.remove('displayNone')
  document.querySelector('#registerButton').classList.add('displayNone')
}

//**************A partir de acá comienzan las funciones de "MIS VENCIMIENTOS"*****************

//Función para mostrar la barra de vencimientos (redbar)

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
}

//Adaptar tabla de vencimientos al contribuyente

function loadCalendar(){
    let userData = JSON.parse(localStorage.getItem('userInformation'))
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
    userData.iibb == 3 &&  `${vencimientosCM[lastDigit]}/${month}/${year}`;

    const ivaDate = document.getElementById('ivaDate');
    ivaDate.innerHTML = `${vencimientosIVA[lastDigit]}/${month}/${year}`
    
    const sicossDate = document.getElementById('sicossDate');
    sicossDate.innerHTML = `${vencimientosSICOSS[lastDigit]}/${month}/${year}`

  };

//Función para desloguearse

function logout(event) {
  event.preventDefault();
  localStorage.removeItem('userInformation')
  document.location.reload();
}

localStorage.getItem("userInformation")? showredBar(): null;
localStorage.getItem("userInformation")? hideloginButons(): null;