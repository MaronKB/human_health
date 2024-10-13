document.addEventListener("DOMContentLoaded", () => {
    const passwordForms = document.querySelectorAll('.login-form');

    async function loadUserData() {
        try {
            const response = await fetch('../resources/temp-db/user.json');
            return await response.json();
        } catch (error) {
            console.error('사용자 데이터 로드 실패:', error);
            return [];
        }
    }

    async function handleIdForm(form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const nicknameInput = form.querySelector('input[type="text"]');
            const nickname = nicknameInput.value;

            const users = await loadUserData();

            const user = users.find(user => user.nickname === nickname);

            if (user) {
                alert(`아이디는: ${user.id} 입니다.`);
            } else {
                alert("입력하신 닉네임과 일치하는 사용자가 없습니다.");
            }
        });
    }

    async function handlePasswordForm(form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;

            const users = await loadUserData();

            const user = users.find(user => user.id === email);

            if (user) {
                alert(`비밀번호는: ${user.password} 입니다.`);
            } else {
                alert("입력하신 아이디와 일치하는 사용자가 없습니다.");
            }
        });
    }

    passwordForms.forEach(form => {
        const title = form.querySelector('h2').innerText;
        if (title.includes('아이디')) {
            handleIdForm(form);
        } else if (title.includes('비밀번호')) {
            handlePasswordForm(form);
        }
    });
});