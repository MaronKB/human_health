let isLoggedIn = false;
const includeHTML = () => {
    const docs = document.querySelectorAll("*");
    docs.forEach((e) => {
        const file = e.dataset.includeHtml;
        if (!file) return;
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) e.outerHTML = xhr.responseText;
            e.removeAttribute("include-html");
        }
        xhr.open("GET", file, true);
        xhr.send();
    });
}
const activateNav = () => {
    const navList = document.querySelectorAll(".nav-button");
    navList.forEach(e => {
        const href = e.getAttribute("href").split("/");
        const location = window.location.pathname.split(("/"));
        if (href[href.length -1] === location[location.length -1]) e.classList.add("active");
    });
    const topMenu = document.querySelector("#top");
    if (isLoggedIn) topMenu.innerHTML = `
        <a id="register-button" href="./user-info.html">회원정보</a>
        <a id="login-button" href="./logout.html">로그아웃</a>
    `;
}
window.addEventListener('DOMContentLoaded', () => {
    includeHTML();
    setTimeout(activateNav, 100);
});