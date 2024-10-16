let isLoggedIn = false;

const includeHtml = () => {
    const docs = document.querySelectorAll("*[data-include-html]");
    docs.forEach((element) => {
        const file = element.dataset.includeHtml;
        fetchHtml(file, element);
    });
};

const fetchHtml = async (file, element) => {
    try {
        const response = await fetch(`./imports/${file}`);
        if (!response.ok) throw new Error('Failed to load HTML');
        const html = await response.text();
        element.outerHTML = html;
    } catch (error) {
        console.error('Error fetching HTML:', error);
    }
};

const activateNav = () => {
    const navList = document.querySelectorAll(".nav-button");
    const currentPage = window.location.pathname.split("/").pop();

    navList.forEach((navItem) => {
        if (navItem.getAttribute("href").split("/").pop() === currentPage) {
            navItem.classList.add("active");
        }
    });

    const register = document.createElement("a");
    register.id = "register-button";

    const login = document.createElement("a");
    login.id = "login-button";

    if (isLoggedIn) {
        register.href = "user-info.html";
        register.innerHTML = "회원정보";

        login.innerHTML = "로그아웃"
        login.onclick = (ev) => {
            ev.preventDefault();
            localStorage.removeItem('loggedInUser');
            isLoggedIn = false;
            window.location.replace('main.html');

        }
    } else {
        register.href = "register.html";
        register.innerHTML = "회원가입";

        login.href = "login.html";
        login.innerHTML = "로그인";
    }

    const topMenu = document.querySelector("#top");
    topMenu.replaceChildren(register, login);

    const register2 = register.cloneNode(true);
    register2.id = "";
    const login2 = login.cloneNode(true);
    login2.id = "";

    const navTop = document.querySelector("#nav-top");
    navTop.replaceChildren(register2, login2);
};

window.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        isLoggedIn = true;
    }
    includeHtml();

    setTimeout(() => {
        activateNav();
        const toTop = document.querySelector('#to-top');
        if (toTop) {
            toTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            });
        }
    }, 300);
});