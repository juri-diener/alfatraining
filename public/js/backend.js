'use strict';

const showMessage = info => alert(info);

const redirectUser = path => window.location = path;

const signin = (loginData) => {
  const loginReq = new Request('loginToBackend', {
    method: 'post',
    body: JSON.stringify(loginData),
    headers: { 'content-type': 'application/json' }
  });

  fetch(loginReq)
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        sessionStorage.setItem('admin', JSON.stringify(data));
        redirectUser('/admin');
      }
      else {
        showMessage(data.info)
      }
    }).catch(console.log);
}

document.querySelector('input#login-btn').addEventListener('click', event => {
  event.preventDefault();
  const form = document.querySelector('form#login-backend');
  const formDatas = new FormData(form);

  if (!formDatas.get('email').length || !formDatas.get('password').length) {
    alert('Eingabefelder müssen ausgefüllt sein');
    return false;
  }

  const loginData = {
    email: formDatas.get('email'),
    password: formDatas.get('password')
  }

  signin(loginData);


})