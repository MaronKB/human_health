let isScrolling = false;

const onScroll = (ev) => {
    if (isScrolling) return;

    let current = ev.target;

    if (!current.classList.contains('main-section')) {
        while (true) {
            current = current.parentNode;
            if (!current) return;
            if (current.classList.contains('main-section')) break;
        }
    }

    const direction = (ev.deltaY > 0);
    const target = (direction) ? current.nextElementSibling : current.previousElementSibling;

    if (!target) return;

    scroll(target);
}

const scroll = (target) => {
    target.scrollIntoView({ behavior: "smooth" });

    isScrolling = true;
    setTimeout(() => {
        isScrolling = false;
    }, 500);
}

const getJsonData = (type) => {
    const injectHtml = (type, data) => {
        const str = type.substring(0, 3);
        const postData = data.sort((a, b) => {
            return b[str + "_post_number"] - a[str + "_post_number"];
        }).slice(0, 6);


        const _html = postData.map(e => {
            const index = document.createElement("span");
            index.className = "main-community-index";
            index.innerHTML = e[str + "_post_number"];

            const title = document.createElement("span");
            title.className = "main-community-title";
            title.innerHTML = e[str + "_title"];

            const nickname = document.createElement("span");
            nickname.className = "main-community-nickname";
            nickname.innerHTML = e.usr_nickname;

            const date = document.createElement("span");
            date.className = "main-community-date";
            date.innerHTML = e[str + "_post_date"].slice(5);

            const a = document.createElement("a");
            a.append(index, title, nickname, date);

            const list = document.createElement("li");
            list.className = "main-community-entry main-communication-entry";
            list.append(a);

            return list;
        });
        const target = document.querySelector(`#main-${type}-list`);
        target.replaceChildren(..._html);
    }

    fetch(`resources/temp-db/${type}.json`).then(res => res.json()).then(data => {
        injectHtml(type, data);
    });
}



const changeCommunity = (ev) => {
    if (!ev.target.classList.contains("main-communication")) return;

    const communityContainer = document.querySelector("#main-communications");
    communityContainer.style.transform = (ev.target.id === "main-qna") ? "translateX(calc(-100% + 30px))" : "";

    const communities = document.querySelectorAll(".main-communication");
    communities.forEach(c => {
        c.classList.remove("active");
    });
    ev.target.classList.add("active");
}

window.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loginList = document.querySelector("#login-list");

    if (loggedInUser) {
        loginList.innerHTML = `
            <a class="main-button" href="user-info.html">회원정보</a>
            <a class="main-button" id="logout-button" href="#">로그아웃</a>
        `;

        const logoutButton = document.getElementById('logout-button');
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'main.html';
        });
    } else {
        loginList.innerHTML = `
            <a class="main-button" href="register.html">회원가입</a>
            <a class="main-button" href="login.html">로그인</a>
        `;
    }

    getJsonData("community");
    getJsonData("qna");

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        section.addEventListener("wheel", (ev) => onScroll(ev));
    });

    const next = document.querySelector("#next");
    next.addEventListener("click", () => scroll(sections[1]));

    const guide = document.querySelector("#scroll-guide");
    guide.classList.remove("hidden");
    setTimeout(() => {
        guide.classList.add("hidden");
    }, 2000);

    const communities = document.querySelectorAll(".main-communication");
    communities.forEach((community) => {
        community.addEventListener("click", (ev) => changeCommunity(ev));
    });
});

// localStorage.clear();