const communityListData = [];
const pageLength = 15;
let pageCount = 1;
let currentPage = 1;

function CommunityItemData(jsonData) {
    this.postNumber  = jsonData.com_post_number;
    this.title = jsonData.com_title;
    this.imageName = jsonData.com_image_name;
    this.imagePath = jsonData.com_image_path;
    this.videoName = jsonData.com_video_name;
    this.videoPath = jsonData.com_video_path;
    this.content = jsonData.com_content;
    this.date = jsonData.com_post_date;
    this.viewCount = jsonData.com_view_count;
    this.user = jsonData.usr_number;
    this.nickname = jsonData.usr_nickname;
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
    fetch("../resources/temp-db/community.json")
        .then(res => res.json())
        .then(data => {
            const list = data.map(e => {
                return new CommunityItemData(e);
            }).sort((a, b) => {
                return b.postNumber - a.postNumber;
            });
            communityListData.push(...list);
            for (let i = 0; i < pageLength - (list.length % pageLength); i++) {
                communityListData.push(new CommunityItemData({}));
            }
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
        title.innerHTML = e.title;

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
        console.log(currentPage);
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
/*
document.addEventListener('DOMContentLoaded', function() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsPerPage = 10; // 한 페이지에 표시할 글 수
    let currentPage = 1;

    function updateCommunityList() {
        const communityList = document.getElementById('community-list');
        communityList.innerHTML = ''; // 기존 글 목록 초기화
        const startIndex = (currentPage - 1) * postsPerPage; // 시작 인덱스
        const endIndex = startIndex + postsPerPage; // 끝 인덱스
        const reversedPosts = [...posts].reverse(); // 배열 반전
        const paginatedPosts = reversedPosts.slice(startIndex, endIndex); // 페이지당 글 가져오기

        paginatedPosts.forEach((post, index) => {
            const postItem = document.createElement('div');
            postItem.classList.add('community-item');

            const postNumber = posts.length - startIndex - index; // 전체 목록에서의 번호 계산

            postItem.innerHTML = `
                <div class="communityItem1">${postNumber}</div>
                <div class="communityItem2">${post.title}</div>
                <div class="communityItem1">${post.nickname}</div>
                <div class="communityItem1">${post.date}</div>
            `;
            communityList.appendChild(postItem);
        });

        updatePagination();
    }

    function updatePagination() {
        const pagination = document.getElementById('community-pagination');
        pagination.innerHTML = ''; // 기존 페이지네이션 초기화

        const totalPages = Math.ceil(posts.length / postsPerPage);

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerText = '이전';
            prevButton.onclick = () => {
                currentPage--;
                updateCommunityList();
            };
            pagination.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.onclick = () => {
                currentPage = i;
                updateCommunityList();
            };
            pagination.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.innerText = '다음';
            nextButton.onclick = () => {
                currentPage++;
                updateCommunityList();
            };
            pagination.appendChild(nextButton);
        }
    }

    // 초기 글 목록 업데이트
    updateCommunityList();
});
*/