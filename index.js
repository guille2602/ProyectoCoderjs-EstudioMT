let loginForm = document.querySelector('#loginInput');

function loginF(e){
  e.preventDefault();
  const user = loginForm.user.value;
  const password = loginForm.password.value;
  const userId = {
    username: user,
    password: password,
  };
  const contribJSON = JSON.stringify(userId);
  localStorage.setItem("contribuyente",contribJSON);
  let btn = document.querySelector('#loginButton');
  btn.classList.add('displayNone');
  let usr = document.querySelector('#loggedUser');
  usr.innerHTML = user;
  usr.classList.remove('displayNone')
};


