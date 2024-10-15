const communityListData = [];
const pageLength = 15;
let pageCount = 1;
let currentPage = 1;

function CommunityItemData(jsonData) {
    this.postNumber = jsonData.com_post_number;
    this.title = jsonData.com_title;
    this.content = jsonData.com_content;
    this.date = jsonData.com_post_date;
    this.nickname = jsonData.usr_nickname;
    this.viewCount = jsonData.com_view_count || 0;
    this.imageName = jsonData.com_image_name;
    this.imagePath = jsonData.com_image_path;
    this.videoName = jsonData.com_video_name;
    this.videoPath = jsonData.com_video_path;
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

            list.sort((a, b) => b.postNumber - a.postNumber);

            const uniqueMap = new Map();

            list.forEach(item => {
                uniqueMap.set(item.postNumber, item);
            });

            localList.forEach(item => {
                if (uniqueMap.has(item.postNumber)) {
                    const existingItem = uniqueMap.get(item.postNumber);
                    existingItem.viewCount = item.viewCount;
                    existingItem.title = item.title;
                } else {
                    uniqueMap.set(item.postNumber, item);
                }
            });

            communityListData.push(...uniqueMap.values());

            communityListData.sort((a, b) => b.postNumber - a.postNumber);

            pageCount = Math.ceil(communityListData.length / pageLength);
            refresh();
        });
}

const createCommunityList = () => {
    const firstListIndex = (currentPage - 1) * pageLength;
    const currentPageList = communityListData.slice(firstListIndex, firstListIndex + pageLength);

    const domList = currentPageList.map(e => {
        const list = document.createElement("li");
        list.className = "community-item";

        if (!e.postNumber) return list;

        const postNumber = document.createElement("span");
        postNumber.className = "community-item-number";
        postNumber.innerHTML = e.postNumber;

        const title = document.createElement("h5");
        title.className = "community-item-title";

        const titleLink = document.createElement("a");
        titleLink.href = `./community-view.html?postNumber=${e.postNumber}`;
        titleLink.innerHTML = e.title;

        title.appendChild(titleLink);

        const nickname = document.createElement("span");
        nickname.className = "community-item-nickname";
        nickname.innerHTML = e.nickname;

        const date = document.createElement("span");
        date.className = "community-item-date";
        date.innerHTML = e.date;

        const view = document.createElement("span");
        view.className = "community-item-view";
        view.innerHTML = e.viewCount;

        list.append(postNumber, title, nickname, date, view);

        return list;
    });

    const communityListContainer = document.getElementById("community-list");
    communityListContainer.innerHTML = "";
    communityListContainer.append(...domList);
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