const loginForm = document.querySelector('#loginInput');
let userForm = document.querySelector('#registerInput');
let userslist = []; 

//Chequeo que los datos de registro se hayan completado
userReg = userForm.regName;
userReg.addEventListener('change', () => checkIfCompleted());
userCUIT = userForm.regCUIT;
userCUIT.addEventListener('change', () => {checkIfCompleted()});
userType = userForm.regType;
userType.addEventListener('change', () => checkIfCompleted());

//Constructor de contribuyente
class Contribuyente {
  constructor (name, cuit, password, type, autonom, sicoss, iva, iibb) {
    this.name = name,
    this.cuit = cuit,
    this.password = password,
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
    userForm.regType.value,
    userForm.regImp.value,
    userForm.regSegSoc.value,
    userForm.regIva.value,
    userForm.regIngresosBrutos.value
  )
  users.push(newUser);
}

//Agregar borrar datos del formulario tras el registro exitoso ***FALTA TERMINAR*** 

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
  document.querySelector('#registerButton').classList.add('displayNone');
  alert('Usuario creado con éxito, por favor ingrese con su usuario');
}

//Función de logueo de usuario con sus respectivas validaciones
function loginF(e){
  e.preventDefault();
  const user = loginForm.cuit.value;
  const password = loginForm.password.value;
  const validation = user !== "" && password !=="" ? true : false;
  if (validation) {
    if (findAndValidateUser(userslist, user, password)) {
      const userId = {
        cuit: user,
        password: password,
      };
      const contribJSON = JSON.stringify(userId);
      localStorage.setItem("contribuyente",contribJSON);
      hidelogginButons(user)
    } else {
      alert('Usuario o contraseña incorrectos');
      loginForm.cuit.value = "";
      loginForm.password.value = "";
    }
  } 
  else {alert('Complete todos los datos')}
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
function hidelogginButons(user) {
  let btn = document.querySelector('#loginButton');
  btn.classList.add('displayNone');
  let usr = document.querySelector('#loggedUser');
  usr.innerHTML = user;
  usr.classList.remove('displayNone')
  document.querySelector('#registerButton').classList.add('displayNone')
}