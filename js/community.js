const communityListData = [];
const originalCommunityListData = [];
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

    const searchButton = document.querySelector(".search-button");
    searchButton.addEventListener("click", handleSearch);
}

const handleSearch = () => {
    const searchInput = document.querySelector(".post-search input").value;
    const selectedCategory = document.querySelector(".post-category").value;
    currentPage = 1;
    searchCommunityList(searchInput, selectedCategory);
}

const searchCommunityList = (searchTerm, category) => {
    const filteredList = originalCommunityListData.filter(item => {
        if (category === "제목") {
            return item.com_title.includes(searchTerm);
        } else if (category === "닉네임") {
            return item.usr_nickname.includes(searchTerm);
        }
        return false;
    });

    communityListData.length = 0;
    communityListData.push(...filteredList);

    pageCount = Math.ceil(communityListData.length / pageLength);
    refresh();
}

const refresh = () => {
    createCommunityList();
    createPagination();
}

const getCommunityList = () => {
    const existingCommunityList = JSON.parse(localStorage.getItem('communityList')) || [];

    if (existingCommunityList.length > 0) {
        const localList = existingCommunityList.map(e => new CommunityItemData(e));
        communityListData.push(...localList);
        originalCommunityListData.push(...localList);

        communityListData.sort((a, b) => b.com_post_number - a.com_post_number);

        pageCount = Math.ceil(communityListData.length / pageLength);
        refresh();
    } else {
        fetch("../resources/temp-db/community.json")
            .then(res => res.json())
            .then(data => {
                const list = data.map(e => new CommunityItemData(e));

                list.sort((a, b) => b.com_post_number - a.com_post_number);

                communityListData.push(...list);
                originalCommunityListData.push(...list);

                communityListData.sort((a, b) => b.com_post_number - a.com_post_number);

                localStorage.setItem('communityList', JSON.stringify(communityListData));

                pageCount = Math.ceil(communityListData.length / pageLength);
                refresh();
            });
    }
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

    const emptyItemsCount = pageLength - fragment.childElementCount;
    for (let i = 0; i < emptyItemsCount; i++) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "community-item empty";
        emptyItem.innerHTML = " ";
        fragment.appendChild(emptyItem);
    }

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