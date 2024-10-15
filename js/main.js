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
    target.scrollIntoView({behavior: "smooth"});

    isScrolling = true;
    setTimeout(() => {
        isScrolling = false;
    }, 500);
}
const getJsonData = (type) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState !== 4 || xhttp.status !== 200) return;
        const arr = JSON.parse(xhttp.responseText).slice(0, (type === "community") ? 6 : 3);
        injectHtml(type, arr);
    }
    xhttp.open("GET", `resources/temp-db/${type}.json`, true);
    xhttp.send();
}
const injectHtml = (type, data) => {
    const postData = data.sort((a, b) => {
        return b.com_post_number - a.com_post_number;
    }).slice(0, 6);
    const _html = postData.map(e => {
        if (type === "community") {
            const index = document.createElement("span");
            index.className = "main-community-index";
            index.innerText = e.com_post_number;

            const title = document.createElement("span");
            title.className = "main-community-title";
            title.innerText = e.com_title;

            const nickname = document.createElement("span");
            nickname.className = "main-community-nickname";
            nickname.innerText = e.usr_nickname;

            const date = document.createElement("span");
            date.className = "main-community-date";
            date.innerText = e.com_post_date.slice(5);

            const a = document.createElement("a");
            a.append(index, title, nickname, date);

            const list = document.createElement("li");
            list.className = "main-community-entry main-communication-entry";
            list.append(a);

            return list;
        }
        else {
            const question = document.createElement("span");
            question.className = "main-qna-q";
            question.innerText = e.title;

            const answer = document.createElement("span");
            answer.className = "main-qna-a";
            answer.innerText = e.answer;

            const a = document.createElement("a");
            a.append(question, answer);

            const list = document.createElement("li");
            list.className = "main-qna-entry main-communication-entry";
            list.append(a);

            return list;
        }
    });
    const target = document.querySelector(`#main-${type}-list`);
    target.replaceChildren(..._html);
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