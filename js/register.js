    function showTerms(type) {
        const popup = document.getElementById('popup');
        const title = document.getElementById('popup-title');
        const terms = document.getElementById('popup-text-terms');
        const privacy = document.getElementById('popup-text-privacy');

        terms.classList.add('hidden');
        privacy.classList.add('hidden');

        if (type === 'terms') {
            title.innerText = "이용약관";
            terms.classList.remove('hidden');
        } else if (type === 'privacy') {
            title.innerText = '개인정보 취급방침';
            privacy.classList.remove('hidden');
        }

        popup.classList.remove("hidden");
    }

    function closePopup() {
        const popup = document.getElementById('popup');
        popup.classList.add("hidden");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('popup-close-button').addEventListener('click', closePopup);
});






document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.login-form');

    fetch('../resources/temp-db/user.json')
        .then(response => response.json())
        .then(data => {
            if (!localStorage.getItem('users')) {
                localStorage.setItem('users', JSON.stringify(data));
            }
        });

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        const nickname = document.getElementById('nickname').value;

        const emailOptOut = document.querySelector('input[name="subscribe"]:checked');
        const emailOptOutValue = emailOptOut ? (emailOptOut.value === 'true' ? 'Y' : 'N') : 'N';

        const acceptTerms = document.getElementById('accept').checked;

        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!acceptTerms) {
            alert('이용약관 및 개인정보 취급방침에 동의해야 합니다.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const existingUser = users.find(user => user.id === email);
        if (existingUser) {
            alert('이미 등록된 아이디입니다.');
            return;
        }

        const existingNickname = users.find(user => user.nickname === nickname);
        if (existingNickname) {
            alert('이미 사용 중인 닉네임입니다.');
            return;
        }

        const newUser = {
            id: email,
            password: password,
            nickname: nickname,
            emailOptOut: emailOptOutValue,
            date: new Date().toISOString().slice(0, 10)
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        window.location.href = 'login.html';
    });
});

// localStorage.clear();