let communityList = [];
let currentPage = 1;
const communitiesPerPage = 20;

async function loadCommunityData() {
    const storedCommunityList = localStorage.getItem('communities');

    if (storedCommunityList) {
        communityList = JSON.parse(storedCommunityList);
        renderCommunityList(communityList);
    } else {
        const response = await fetch('../resources/temp-db/community.json');
        communityList = await response.json();
        localStorage.setItem('communities', JSON.stringify(communityList));
        renderCommunityList(communityList);
    }
}

function renderCommunityList(communities) {
    const communityListBody = document.getElementById('community-list-body');
    communityListBody.innerHTML = '';

    const startIndex = (currentPage - 1) * communitiesPerPage;
    const endIndex = Math.min(startIndex + communitiesPerPage, communities.length);
    const paginatedCommunities = communities.slice(startIndex, endIndex);

    paginatedCommunities.forEach((community, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="edit-check-box" data-index="${startIndex + index}"></td>
            <td class="edit-number">${startIndex + index + 1}</td>
            <td><input type="text" value="${community.com_title}" class="edit-input-title"></td>
            <td><input type="text" value="${community.usr_nickname}" class="edit-input-nickname"></td>
            <td class="edit-input-date">${community.com_post_date}</td>
        `;
        communityListBody.appendChild(row);
    });

    updateDeleteButtonState();
    createPagination(communities.length);
}

function createPagination(totalCommunities) {
    const pageCount = Math.ceil(totalCommunities / communitiesPerPage);
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = '';

    const pageButtons = [];
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("a");
        button.className = "pagination-button";
        if (i === currentPage) button.classList.add("active");
        button.innerHTML = i;
        button.onclick = () => {
            currentPage = i;
            renderCommunityList(communityList);
        };
        pageButtons.push(button);
    }

    paginationContainer.replaceChildren(...pageButtons);
}

const arrow = (direction) => {
    let next = direction ? currentPage + 1 : currentPage - 1;
    next = (next > Math.ceil(communityList.length / communitiesPerPage)) ? Math.ceil(communityList.length / communitiesPerPage) : (next <= 0) ? 1 : next;
    currentPage = next;
    renderCommunityList(communityList);
}

function saveCommunityData() {
    const editCommunities = document.querySelectorAll('.edit-input-title');
    const editNicknames = document.querySelectorAll('.edit-input-nickname');

    communityList = Array.from(communityList).map((community, index) => {
        return {
            com_post_number: community.com_post_number,
            com_title: editCommunities[index] ? editCommunities[index].value : community.com_title,
            usr_nickname: editNicknames[index] ? editNicknames[index].value : community.usr_nickname,
            com_post_date: community.com_post_date,
            com_content: community.com_content,
            com_image_name: community.com_image_name,
            com_image_path: community.com_image_path,
            com_video_name: community.com_video_name,
            com_video_path: community.com_video_path,
            com_view_count: community.com_view_count
        };
    });

    localStorage.setItem('communities', JSON.stringify(communityList));
    alert('저장되었습니다.');
    renderCommunityList(communityList);
}

function addCommunity() {
    const title = prompt('제목을 입력해주세요.');
    const nickname = prompt('닉네임을 입력해주세요.');
    const date = prompt('날짜를 입력해주세요.');

    if (title && nickname && date) {
        const newCommunity = {
            com_post_number: communityList.length + 1,
            com_title: title,
            usr_nickname: nickname,
            com_post_date: date,
            com_content: "내용",
            com_view_count: 0,
            com_image_name: null,
            com_image_path: null,
            com_video_name: null,
            com_video_path: null
        };
        communityList.push(newCommunity);
        localStorage.setItem('communities', JSON.stringify(communityList));
        renderCommunityList(communityList);
        alert('커뮤니티가 추가되었습니다.');
    } else {
        alert('모든 정보를 입력해주세요.');
    }
}

function deleteCommunity() {
    const checkboxes = document.querySelectorAll('.edit-check-box');
    const selectedIndexes = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedIndexes.push(index);
        }
    });

    if (selectedIndexes.length === 0) {
        alert('삭제할 커뮤니티를 선택해주세요.');
        return;
    }

    const confirmation = confirm('정말로 삭제하시겠습니까?');
    if (!confirmation) return;

    const selectedCommunities = selectedIndexes.map(index => (currentPage - 1) * communitiesPerPage + index);
    for (let i = selectedCommunities.length - 1; i >= 0; i--) {
        communityList.splice(selectedCommunities[i], 1);
    }

    localStorage.setItem('communities', JSON.stringify(communityList));
    renderCommunityList(communityList);
    alert('선택된 커뮤니티가 삭제되었습니다.');
}

function searchCommunity() {
    const searchCategory = document.getElementById('search-category').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const filteredCommunities = communityList.filter(community => {
        if (searchCategory === '제목') {
            return community.com_title.toLowerCase().includes(searchInput);
        } else if (searchCategory === '닉네임') {
            return community.usr_nickname.toLowerCase().includes(searchInput);
        } else if (searchCategory === '작성일') {
            return community.com_post_date.includes(searchInput);
        }
        return false;
    });

    renderCommunityList(filteredCommunities);
}

function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll('.edit-check-box');
    const deleteButton = document.getElementById('delete-community');

    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    deleteButton.disabled = !anyChecked;
}

window.addEventListener('DOMContentLoaded', () => {
    loadCommunityData();

    document.getElementById('add-community').addEventListener('click', addCommunity);
    document.getElementById('delete-community').addEventListener('click', deleteCommunity);
    document.getElementById('save-community').addEventListener('click', saveCommunityData);
    document.getElementById('search-button').addEventListener('click', searchCommunity);

    document.getElementById('community-list-body').addEventListener('change', updateDeleteButtonState);
    document.getElementById('pagination-left').addEventListener('click', () => arrow(false));
    document.getElementById('pagination-right').addEventListener('click', () => arrow(true));
});

// localStorage.clear();