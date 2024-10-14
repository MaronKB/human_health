document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }
    if (savedPassword) {
        document.getElementById('password').value = savedPassword;
    }
    document.getElementById('remember-me').checked = rememberMe;

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        const localUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userFromLocalStorage = localUsers.find(user => user.id === email && user.password === password);

        fetch('../resources/temp-db/user.json')
            .then(response => response.json())
            .then(users => {
                const userFromJson = users.find(user => user.id === email && user.password === password);

                if (userFromLocalStorage || userFromJson) {
                    const user = userFromLocalStorage || userFromJson;

                    localStorage.setItem('loggedInUser', JSON.stringify(user));

                    if (rememberMe) {
                        localStorage.setItem('savedEmail', email);
                        localStorage.setItem('savedPassword', password);
                        localStorage.setItem('rememberMe', 'true');
                    } else {
                        localStorage.removeItem('savedEmail');
                        localStorage.removeItem('savedPassword');
                        localStorage.setItem('rememberMe', 'false');
                    }

                    window.isLoggedIn = true;

                    window.location.href = 'main.html';
                } else {
                    alert('아이디 또는 비밀번호가 잘못되었습니다.');
                }
            })
    });
});

// localStorage.clear();