const communityListData = [];
const pageLength = 15;
let pageCount = 1;
let currentPage = 1;

function CommunityItemData(jsonData) {
    this.com_post_number = jsonData.com_post_number;
    this.com_title = jsonData.com_title;
    this.com_content = jsonData.com_content;
    this.com_post_date = jsonData.com_post_date;
    this.usr_nickname = jsonData.usr_nickname;
    this.com_view_count = jsonData.com_view_count || 0;
    this.com_image_name = jsonData.com_image_name;
    this.com_image_path = jsonData.com_image_path;
    this.com_video_name = jsonData.com_video_name;
    this.com_video_path = jsonData.com_video_path;
}

const init = () => {
    getCommunityList();

    const left = document.querySelector("#pagination-left");
    left.addEventListener("click", () => arrow(false));

    const right = document.querySelector("#pagination-right");
    right.addEventListener("click", () => arrow(true));
}

const refresh = () => {
    createCommunityList();
    createPagination();
}

const getCommunityList = () => {
    const existingCommunityList = JSON.parse(localStorage.getItem('communityList')) || [];
    const localList = existingCommunityList.map(e => new CommunityItemData(e));

    fetch("../resources/temp-db/community.json")
        .then(res => res.json())
        .then(data => {
            const list = data.map(e => new CommunityItemData(e));

            list.sort((a, b) => b.com_post_number - a.com_post_number);

            const uniqueMap = new Map();

            list.forEach(item => {
                uniqueMap.set(item.com_post_number, item);
            });

            localList.forEach(item => {
                if (uniqueMap.has(item.com_post_number)) {
                    const existingItem = uniqueMap.get(item.com_post_number);
                    existingItem.com_view_count = item.com_view_count;
                    existingItem.com_title = item.com_title;
                } else {
                    uniqueMap.set(item.com_post_number, item);
                }
            });

            const uniqueList = Array.from(uniqueMap.values()).filter(item => item.com_post_number);
            communityListData.unshift(...uniqueList); // 배열의 앞에 추가

            // 로컬 스토리지에 오름차순 정렬하여 저장
            communityListData.sort((a, b) => a.com_post_number - b.com_post_number);
            localStorage.setItem('communityList', JSON.stringify(communityListData));

            // 화면에 출력할 때는 내림차순으로 정렬
            communityListData.sort((a, b) => b.com_post_number - a.com_post_number);

            pageCount = Math.ceil(communityListData.length / pageLength);
            refresh();
        });
}

const createCommunityList = () => {
    const firstListIndex = (currentPage - 1) * pageLength;
    const currentPageList = communityListData.slice(firstListIndex, firstListIndex + pageLength);
    
    const fragment = document.createDocumentFragment();

    currentPageList.forEach(e => {
        if (!e.com_post_number) return;

        const list = document.createElement("li");
        list.className = "community-item";

        const postNumber = document.createElement("span");
        postNumber.className = "community-item-number";
        postNumber.innerHTML = e.com_post_number;

        const title = document.createElement("h5");
        title.className = "community-item-title";

        const titleLink = document.createElement("a");
        titleLink.href = `./community-view.html?postNumber=${e.com_post_number}`;
        titleLink.innerHTML = e.com_title;

        title.appendChild(titleLink);

        const nickname = document.createElement("span");
        nickname.className = "community-item-nickname";
        nickname.innerHTML = e.usr_nickname;

        const date = document.createElement("span");
        date.className = "community-item-date";
        date.innerHTML = e.com_post_date;

        const view = document.createElement("span");
        view.className = "community-item-view";
        view.innerHTML = e.com_view_count;

        list.append(postNumber, title, nickname, date, view);
        fragment.appendChild(list);
    });

    const communityListContainer = document.getElementById("community-list");
    communityListContainer.innerHTML = "";
    communityListContainer.appendChild(fragment);
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

    const paginationContainer = document.getElementById("community-pagination-container");
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