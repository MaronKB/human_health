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
    this.isSecret = jsonData.is_secret || false;
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
    const existingQnaList = JSON.parse(localStorage.getItem('qnaList'));

    if (existingQnaList) {
        const localList = existingQnaList.map(e => new QnaItemData(e));
        qnaListData.push(...localList);
        pageCount = Math.ceil(qnaListData.length / pageLength);
        refresh();
    } else {
        fetch("../resources/temp-db/qna.json")
            .then(res => res.json())
            .then(data => {
                const list = data.map(e => new QnaItemData(e));

                list.sort((a, b) => b.postNumber - a.postNumber);

                qnaListData.push(...list);

                saveToLocalStorage();

                pageCount = Math.ceil(qnaListData.length / pageLength);
                refresh();
            })
            .catch(error => console.error("Error fetching data:", error));
    }
}

const saveToLocalStorage = () => {
    const dataToSave = qnaListData.map(item => {
        return {
            qna_post_number: item.postNumber,
            qna_title: item.title,
            qna_content: item.content,
            qna_post_date: item.date,
            usr_nickname: item.nickname,
            qna_view_count: item.viewCount,
            is_secret: item.isSecret
        };
    });
    localStorage.setItem('qnaList', JSON.stringify(dataToSave));
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

        postNumber.innerHTML = Number.isInteger(e.postNumber) ? e.postNumber : "　ㄴ";

        const title = document.createElement("h5");
        title.className = "qna-item-title";

        const titleLink = document.createElement("a");
        titleLink.href = `./qna-view.html?postNumber=${e.postNumber}`;
        titleLink.innerHTML = e.title;

        title.appendChild(titleLink);

        const nickname = document.createElement("span");
        nickname.className = "qna-item-nickname";
        nickname.innerHTML = e.nickname;

        const date = document.createElement("span");
        date.className = "qna-item-date";
        date.innerHTML = e.date;

        const view = document.createElement("span");
        view.className = "qna-item-view";
        view.innerHTML = e.viewCount;

        list.append(postNumber, title, nickname, date, view);

        return list;
    });

    const emptyItemsCount = pageLength - domList.length;
    for (let i = 0; i < emptyItemsCount; i++) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "qna-item empty";
        emptyItem.innerHTML = " ";
        domList.push(emptyItem);
    }

    const qnaListContainer = document.getElementById("qna-list");
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

// localStorage.clear();