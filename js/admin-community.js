let communityList = [
    { title: '제목1', nickname: '닉네임1', date: '2024.10.01' },
    { title: '제목2', nickname: '닉네임2', date: '2024.10.02' },
    { title: '제목3', nickname: '닉네임3', date: '2024.10.03' },
    { title: '제목4', nickname: '닉네임4', date: '2024.10.04' },
    { title: '제목5', nickname: '닉네임5', date: '2024.10.05' },
    { title: '제목6', nickname: '닉네임6', date: '2024.10.06' },
    { title: '제목7', nickname: '닉네임7', date: '2024.10.07' },
    { title: '제목8', nickname: '닉네임8', date: '2024.10.08' },
    { title: '제목9', nickname: '닉네임9', date: '2024.10.09' },
    { title: '제목10', nickname: '닉네임10', date: '2024.10.10' },
    { title: '제목11', nickname: '닉네임11', date: '2024.10.11' },
];

function renderCommunityList(communities) {
    const communityListBody = document.getElementById('community-list-body');
    communityListBody.innerHTML = '';

    communities.forEach((community, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><input type="checkbox" class="edit-check-box" data-index="${index}"></td>
        <td class="edit-number">${index + 1}</td>
        <td><input type="text" value="${community.title}" class="edit-input-title"></td>
        <td><input type="text" value="${community.nickname}" class="edit-input-nickname"></td>
        <td class="edit-input-date">${community.date}</td>
        `;
        communityListBody.appendChild(row);
    });

    updateDeleteButtonState();
}

function saveCommunityData() {
    const editCommunities = document.querySelectorAll('.edit-input-title');
    const editNicknames = document.querySelectorAll('.edit-input-nickname');

    communityList = Array.from(communityList).map((community, index) => {
        return {
            title: editCommunities[index] ? editCommunities[index].value : community.title,
            nickname: editNicknames[index] ? editNicknames[index].value : community.nickname,
            date: community.date
        };
    });

    alert('저장되었습니다.');
    renderCommunityList(communityList);
}

function addCommunity() {
    const title = prompt('제목을 입력해주세요.');
    const nickname = prompt('닉네임을 입력해주세요.');
    const date = prompt('날짜를 입력해주세요.');

    if (title && nickname && date) {
        communityList.push({ title, nickname, date });
        renderCommunityList(communityList);
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

    for (let i = selectedIndexes.length - 1; i >= 0; i--) {
        communityList.splice(selectedIndexes[i], 1);
    }

    renderCommunityList(communityList);
}

function searchCommunity() {
    const searchCategory = document.getElementById('search-category').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const filteredCommunities = communityList.filter(community => {
        if (searchCategory === '제목') {
            return community.title.toLowerCase().includes(searchInput);
        } else if (searchCategory === '닉네임') {
            return community.nickname.toLowerCase().includes(searchInput);
        } else if (searchCategory === '작성일') {
            return community.date.includes(searchInput);
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
    renderCommunityList(communityList);

    document.getElementById('add-community').addEventListener('click', addCommunity);
    document.getElementById('delete-community').addEventListener('click', deleteCommunity);
    document.getElementById('save-community').addEventListener('click', saveCommunityData);
    document.getElementById('search-button').addEventListener('click', searchCommunity);

    document.getElementById('community-list-body').addEventListener('change', updateDeleteButtonState);
});