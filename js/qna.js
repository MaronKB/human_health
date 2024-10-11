const qnaListData = [];
const pageLength = 15;
let pageCount = 1;
let currentPage = 1;

function QnaItemData(jsonData) {
    this.postNumber  = jsonData.com_post_number;
    this.title = jsonData.com_title;
    this.content = jsonData.com_content;
    this.date = jsonData.com_post_date;
    this.user = jsonData.usr_number;
    this.nickname = jsonData.uer_nickname;
}

const init = () => {
    getQnaList();

    const left = document.querySelector("#pagination-left");
    left.addEventListener("click", () => arrow(false));

    const right = document.querySelector("#pagination-right");
    right.addEventListener("click", () => arrow(true));
}

const refresh = () => {
    createQnaList();
    createPagination();
}

const getQnaList = () => {
    fetch("../resources/temp-db/qna.json")
        .then(res => res.json())
        .then(data => {
            const list = data.map(e => {
                return new QnaItemData(e);
            }).sort((a, b) => {
                return b.postNumber - a.postNumber;
            });
            qnaListData.push(...list);
            for (let i = 0; i < pageLength - (list.length % pageLength); i++) {
                qnaListData.push(new QnaItemData({}));
            }
            pageCount = Math.ceil(qnaListData.length / pageLength);
            refresh();
        });
}

const createQnaList = () => {
    const firstListIndex = (currentPage - 1) * pageLength;
    const currentPageList = qnaListData.slice(firstListIndex, firstListIndex + pageLength);

    const domList = currentPageList.map(e => {
        const list = document.createElement("li");
        list.className = "qna-item";

        if (!e.postNumber) return list;

        const postNumber = document.createElement("span");
        postNumber.className = "qna-item-number";
        postNumber.innerHTML = e.postNumber;

        const title = document.createElement("h5");
        title.className = "qna-item-title";
        title.innerHTML = e.title;

        const nickname = document.createElement("span");
        nickname.className = "qna-item-nickname";
        nickname.innerHTML = e.nickname;

        const date = document.createElement("span");
        date.className = "qna-item-date";
        date.innerHTML = e.date;

        list.append(postNumber, title, nickname, date);

        return list;
    });

    const qnaListContainer = document.getElementById("qna-list");
    qnaListContainer.innerHTML = "";
    qnaListContainer.append(...domList);
}

const createPagination = () => {
    const pageButton = [];
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("a");
        button.className = "pagination-button";
        console.log(currentPage);
        if (i === currentPage) button.classList.add("active");
        button.innerHTML = i;
        button.onclick = () => {
            currentPage = i;
            refresh();
        }
        pageButton.push(button);
    }

    const paginationContainer = document.getElementById("qna-pagination-container");
    paginationContainer.replaceChildren(...pageButton);
}

const arrow = (direction) => {
    let next = (direction) ? currentPage + 1 : currentPage - 1;
    next = (next > pageCount) ? pageCount : (next <= 0) ? 1 : next;
    currentPage = next;
    refresh();
}

document.addEventListener('DOMContentLoaded', init);