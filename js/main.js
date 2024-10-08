
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
    const _html = data.map(e => {
        if (type === "community") {
            const index = document.createElement("span");
            index.className = "main-community-index";
            index.innerText = e.index;

            const category = document.createElement("span");
            category.className = "main-community-category";
            category.innerText = e.category;

            const title = document.createElement("span");
            title.className = "main-community-title";
            title.innerText = e.title;

            const nickname = document.createElement("span");
            nickname.className = "main-community-nickname";
            nickname.innerText = e.nickname;

            const date = document.createElement("span");
            date.className = "main-community-date";
            date.innerText = e.date;

            const a = document.createElement("a");
            a.append(index, category, title, nickname, date);

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
    target.childNodes.forEach(e => {
        e.remove();
    });
    target.append(..._html);
}
window.addEventListener('DOMContentLoaded', () => {
    getJsonData("community");
    getJsonData("qna");
});