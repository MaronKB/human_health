// 목록 데이터 초기화
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

// 목록을 화면에 렌더링
function renderCommunityList(communities) {
    const communityListBody = document.getElementById('community-list-body');
    communityListBody.innerHTML = ''; // 기존 내용 초기화

    communities.forEach((community, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><input type="checkbox" class="edit-checkbox" data-index="${index}"></td>
        <td class="edit-number">${index + 1}</td>
        <td><input type="text" value="${community.title}" class="edit-input-title"></td>
        <td><input type="text" value="${community.nickname}" class="edit-input-nickname"></td>
        <td class="edit-input-date">${community.date}</td>
        `;
        communityListBody.appendChild(row);
    });
}

// 데이터 저장 기능
function saveCommunityData() {
    const editCommunities = document.querySelectorAll('.edit-input-title');
    const editNicknames = document.querySelectorAll('.edit-input-nickname');

    // 기존 데이터를 유지하면서 새로운 데이터를 저장
    communityList = Array.from(communityList).map((community, index) => {
        return {
            title: editCommunities[index] ? editCommunities[index].value : community.title,
            nickname: editNicknames[index] ? editNicknames[index].value : community.nickname,
            date: community.date
        };
    });

    alert('저장되었습니다.');
    renderCommunityList(communityList); // 변경된 내용을 다시 렌더링
}

// 추가 기능
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

// 삭제 기능
function deleteCommunity() {
    const checkboxes = document.querySelectorAll('.edit-checkbox');
    const selectedIndexes = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedIndexes.push(index);
        }
    });

    // 인덱스를 역순으로 삭제
    for (let i = selectedIndexes.length - 1; i >= 0; i--) {
        communityList.splice(selectedIndexes[i], 1);
    }

    renderCommunityList(communityList);  // 삭제 후 업데이트
}

// 검색 기능
function searchCommunity() {
    const searchCategory = document.getElementById('search-category').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const filteredCommunities = communityList.filter(community => {
        if (searchCategory === '제목') {
            return community.title.toLowerCase().includes(searchInput);
        } else if (searchCategory === '닉네임') {
            return community.nickname.toLowerCase().includes(searchInput);
        }
    });

    renderCommunityList(filteredCommunities);
}

// 페이지 로드 시 초기 목록 출력
window.addEventListener('DOMContentLoaded', () => {
    renderCommunityList(communityList);

    // 추가
    document.getElementById('add-community').addEventListener('click', addCommunity);

    // 삭제
    document.getElementById('delete-community').addEventListener('click', deleteCommunity);

    // 저장
    document.getElementById('save-community').addEventListener('click', saveCommunityData);

    // 검색
    document.getElementById('search-button').addEventListener('click', searchCommunity);
});