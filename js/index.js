let isLoggedIn = false;

const includeHtml = () => {
    const docs = document.querySelectorAll("*");
    docs.forEach((e) => {
        const file = e.dataset.includeHtml;
        if (!file) return;
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) e.outerHTML = xhr.responseText;
            e.removeAttribute("include-html");
        }
        xhr.open("GET", "./imports/" + file, true);
        xhr.send();
    });
}

const activateNav = () => {
    const navList = document.querySelectorAll(".nav-button");
    navList.forEach(e => {
        const href = e.getAttribute("href").split("/");
        const location = window.location.pathname.split("/");
        if (href[href.length - 1] === location[location.length - 1]) e.classList.add("active");
    });
    const topMenu = document.querySelector("#top");

    if (isLoggedIn) {
        topMenu.innerHTML = `
            <a id="register-button" href="./user-info.html">회원정보</a>
            <a id="logout-button" href="#">로그아웃</a>
        `;
    } else {
        topMenu.innerHTML = `
            <a id="register-button" href="./register.html">회원가입</a>
            <a id="login-button" href="./login.html">로그인</a>
        `;
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('loggedInUser');
            isLoggedIn = false;
            window.location.href = 'main.html';
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        isLoggedIn = true;
    }
    includeHtml();
    setTimeout(() => {
        activateNav();
        const toTop = document.querySelector('#to-top');
        toTop.addEventListener("click", () => {
            window.scrollTo({top : 0, left : 0, behavior: "smooth"});
            document.body.scrollTo({top : 0, left : 0, behavior: "smooth"});
            document.querySelector("main").scrollTo({top : 0, left : 0, behavior: "smooth"});
        });
    }, 100);
});