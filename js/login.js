document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    const savedEmail = localStorage.getItem('savedEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }
    document.getElementById('remember-me').checked = rememberMe;

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMeChecked = document.getElementById('remember-me').checked;

        const localUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = localUsers.find(user => user.id === email && user.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            if (rememberMeChecked) {
                localStorage.setItem('savedEmail', email);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('savedEmail');
                localStorage.setItem('rememberMe', 'false');
            }

            window.isLoggedIn = true;
            window.location.replace("user.html");
        } else {
            alert('아이디 또는 비밀번호가 잘못되었습니다.');
            document.getElementById('password').value = '';
        }
    });
});

// localStorage.clear();