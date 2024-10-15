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

    const topMenu = document.querySelector("#top");
    topMenu.innerHTML = isLoggedIn ? `
        <a id="register-button" href="./user-info.html">회원정보</a>
        <a id="logout-button" href="#">로그아웃</a>
    ` : `
        <a id="register-button" href="./register.html">회원가입</a>
        <a id="login-button" href="./login.html">로그인</a>
    `;

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('loggedInUser');
            isLoggedIn = false;
            window.location.href = 'main.html';
        });
    }
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
    }, 100);
});