var password = document.getElementById('password');
var confirmPassword = document.getElementById('confirm_password');
var email = document.getElementById('email');
function checkPassword() {
    if (password.value == confirmPassword.value) {
        password.style.borderBottom = '1.5px solid #77cbb9';
        confirmPassword.style.borderBottom = '1.5px solid #77cbb9';
    }
    else {
        password.style.borderBottom = '1.5px solid #ff5e5b';
        confirmPassword.style.borderBottom = '1.5px solid #ff5e5b';
    }
}

function validEmail() {
    if (email.value.indexOf('@') >= 0) {
        email.style.borderBottom = '1.5px solid #77cbb9';
    }
    else {
        email.style.borderBottom = '1.5px solid #ff5e5b';
    }
}