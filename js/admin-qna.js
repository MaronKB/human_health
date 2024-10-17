const qnaListData = [];
const pageLength = 15;
let pageCount = 1;
let currentPage = 1;

function QnaItemData(jsonData) {
    this.postNumber = jsonData.qna_post_number;
    this.title = jsonData.qna_title;
    this.content = jsonData.qna_content;
    this.date = jsonData.qna_post_date;
    this.nickname = jsonData.usr_nickname;
    this.viewCount = jsonData.qna_view_count || 0;
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
    const existingQnaList = JSON.parse(localStorage.getItem('qnaList')) || [];
    const localList = existingQnaList.map(e => new QnaItemData(e));

    if (localList.length > 0) {
        qnaListData.push(...localList);
        pageCount = Math.ceil(qnaListData.length / pageLength);
        refresh();
        return;
    }

    fetch("../resources/temp-db/qna.json")
        .then(res => res.json())
        .then(data => {
            const list = data.map(e => new QnaItemData(e));

            list.sort((a, b) => b.postNumber - a.postNumber);

            qnaListData.push(...list);
            pageCount = Math.ceil(qnaListData.length / pageLength);

            refresh();

            localStorage.setItem('qnaList', JSON.stringify(qnaListData));
        });
};

const createQnaList = () => {
    const firstListIndex = (currentPage - 1) * pageLength;
    const currentPageList = qnaListData.slice(firstListIndex, firstListIndex + pageLength);

    const domList = currentPageList.map(e => {
        const list = document.createElement("li");
        list.className = "admin-qna-item";

        if (!e.postNumber) return list;

        const postNumber = document.createElement("span");
        postNumber.className = "admin-qna-item-number";

        if (Number.isInteger(e.postNumber)) {
            postNumber.innerHTML = e.postNumber;
        } else {
            postNumber.innerHTML = "　ㄴ";
        }

        const title = document.createElement("h5");
        title.className = "admin-qna-item-title";

        const titleLink = document.createElement("a");
        titleLink.href = `./admin-qna-view.html?postNumber=${e.postNumber}`;
        titleLink.innerHTML = e.title;

        title.appendChild(titleLink);

        const nickname = document.createElement("span");
        nickname.className = "admin-qna-item-nickname";
        nickname.innerHTML = e.nickname;

        const date = document.createElement("span");
        date.className = "admin-qna-item-date";
        date.innerHTML = e.date;

        const view = document.createElement("span");
        view.className = "admin-qna-item-view";
        view.innerHTML = e.viewCount;

        list.append(postNumber, title, nickname, date, view);

        return list;
    });

    const emptyItemsCount = pageLength - domList.length;
    for (let i = 0; i < emptyItemsCount; i++) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "admin-qna-item empty";
        emptyItem.innerHTML = " ";
        domList.push(emptyItem);
    }

    const qnaListContainer = document.getElementById("admin-qna-list");
    qnaListContainer.innerHTML = "";
    qnaListContainer.append(...domList);
}

const createPagination = () => {
    const pageButton = [];
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("a");
        button.className = "pagination-button";
        if (i === currentPage) button.classList.add("active");
        button.innerHTML = i;
        button.onclick = () => {
            currentPage = i;
            refresh();
        }
        pageButton.push(button);
    }

    const paginationContainer = document.getElementById("admin-qna-pagination-container");
    paginationContainer.replaceChildren(...pageButton);
}

const arrow = (direction) => {
    let next = (direction) ? currentPage + 1 : currentPage - 1;
    next = (next > pageCount) ? pageCount : (next <= 0) ? 1 : next;
    currentPage = next;
    refresh();
}

document.addEventListener('DOMContentLoaded', init);

// localStorage.clear();