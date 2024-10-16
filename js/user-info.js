const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
let isNicknameConfirmed = true;

const onSubmit = (ev) => {
    ev.preventDefault();

    if (!isNicknameConfirmed) {
        window.alert("닉네임 중복 확인을 해주세요.");
        return;
    }

    const nickname = document.querySelector("#nickname");

    const password = loggedInUser.password;
    const passwordInput = document.querySelector("#current-password");

    if (password !== passwordInput.value) {
        window.alert("비밀번호가 틀렸습니다.");
        return;
    }

    const newPassword = document.querySelector("#password");
    const newPasswordConfirm = document.querySelector("#password-confirm");

    if (newPassword.value && newPassword.value !== newPasswordConfirm.value) {
        window.alert("비밀번호가 서로 다릅니다.");
        return;
    }

    const email = document.querySelector("input[name='subscribe']:checked");

    loggedInUser.nickname = nickname.value;
    loggedInUser.password = (newPassword.value.length === 0) ? loggedInUser.password : newPassword.value;
    loggedInUser.emailOptOut = email.value;

    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    const users = JSON.parse(localStorage.getItem("users"));
    const newUsers = users.filter(u => u.id !== loggedInUser.id);
    newUsers.push(loggedInUser);

    localStorage.setItem("users", JSON.stringify(newUsers));

    window.alert("저장되었습니다.");
}

const init = () => {
    if (!loggedInUser || loggedInUser.length === 0) {
        window.alert("로그인하십시오.");
        window.location.replace("login.html");
    }

    const form = document.querySelector(".login-form");
    form.onsubmit = onSubmit;

    const nickname = document.querySelector("#nickname");
    nickname.value = loggedInUser.nickname;
    nickname.oninput = (ev) => {
        isNicknameConfirmed = (ev.target.value === loggedInUser.nickname);
    }

    const nicknameButton = document.querySelector("#change-nickname");
    nicknameButton.addEventListener("click", (e) => {
        isNicknameConfirmed = false;
        if (!nickname.value) {
            window.alert("닉네임은 비워둘 수 없습니다.");
            return;
        }
        const users = JSON.parse(localStorage.getItem("users"));
        if (users.find(user => user.nickname === nickname.value) && loggedInUser.nickname !== nickname.value) {
            window.alert("닉네임이 중복됩니다.");
        }
        else {
            window.alert("사용 가능합니다.");
            isNicknameConfirmed = true;
        }
    });

    const subscribe = document.querySelector(`input[name='subscribe'][value='${loggedInUser.emailOptOut}']`);
    subscribe.checked = true;
}

window.addEventListener('DOMContentLoaded', init);