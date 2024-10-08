// 목록 데이터 초기화
let userList = [
    { id: 'user01@gmail.com', password: 'user01', nickname: '유저1', emailOptOut: 'Y', date: '2024.10.01' },
    { id: 'user02@gmail.com', password: 'user02', nickname: '유저2', emailOptOut: 'N', date: '2024.10.02' },
    { id: 'user03@gmail.com', password: 'user03', nickname: '유저3', emailOptOut: 'Y', date: '2024.10.03' },
    { id: 'user04@gmail.com', password: 'user04', nickname: '유저4', emailOptOut: 'Y', date: '2024.10.04' },
    { id: 'user05@gmail.com', password: 'user05', nickname: '유저5', emailOptOut: 'N', date: '2024.10.05' },
    { id: 'user06@gmail.com', password: 'user06', nickname: '유저6', emailOptOut: 'Y', date: '2024.10.06' },
    { id: 'user07@gmail.com', password: 'user07', nickname: '유저7', emailOptOut: 'Y', date: '2024.10.07' },
    { id: 'user08@gmail.com', password: 'user08', nickname: '유저8', emailOptOut: 'N', date: '2024.10.08' },
    { id: 'user09@gmail.com', password: 'user09', nickname: '유저9', emailOptOut: 'Y', date: '2024.10.09' },
    { id: 'user10@gmail.com', password: 'user10', nickname: '유저10', emailOptOut: 'Y', date: '2024.10.10' },
    { id: 'user11@gmail.com', password: 'user11', nickname: '유저11', emailOptOut: 'N', date: '2024.10.11' },
];

// 목록을 화면에 렌더링
function renderUserList(users) {
    const userListBody = document.getElementById('user-list-body');
    userListBody.innerHTML = ''; // 기존 내용 초기화

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="edit-checkbox" data-index="${index}"></td>
            <td class="edit-number">${index + 1}</td>
            <td><input type="text" value="${user.id}" class="edit-input-id"></td>
            <td><input type="text" value="${user.password}" class="edit-input-password"></td>
            <td><input type="text" value="${user.nickname}" class="edit-input-nickname"></td>
            <td><input type="text" value="${user.emailOptOut}" class="edit-input-emailOptOut"></td>
            <td class="edit-input-date">${user.date}</td>
        `;
        userListBody.appendChild(row);
    });
}

// 데이터 저장 기능
function saveUserData() {
    const editIds = document.querySelectorAll('.edit-input-id');
    const editPasswords = document.querySelectorAll('.edit-input-password');
    const editNicknames = document.querySelectorAll('.edit-input-nickname');
    const editEmailOptOuts = document.querySelectorAll('.edit-input-emailOptOut');

    // 기존 데이터를 유지하면서 새로운 데이터를 저장
    userList = Array.from(userList).map((user, index) => {
        return {
            id: editIds[index] ? editIds[index].value : user.id,
            password: editPasswords[index] ? editPasswords[index].value : user.password,
            nickname: editNicknames[index] ? editNicknames[index].value : user.nickname,
            emailOptOut: editEmailOptOuts[index] ? editEmailOptOuts[index].value : user.emailOptOut,
            date: user.date
        };
    });

    alert('저장되었습니다.');
    renderUserList(userList); // 변경된 내용을 다시 렌더링
}

// 추가 기능
function addUser() {
    const id = prompt('아이디를 입력해주세요.');
    const password = prompt('비밀번호를 입력해주세요.');
    const nickname = prompt('닉네임을 입력해주세요.');
    const emailOptOut = confirm('이메일 수신 동의 여부를 선택하세요. (확인: Y, 취소: N)') ? 'Y' : 'N';
    const date = prompt('날짜를 입력해주세요.');

    if (id && password && nickname && date) {
        userList.push({ id, password, nickname, emailOptOut, date });
        renderUserList(userList);
    } else {
        alert('모든 정보를 입력해주세요.');
    }
}

// 삭제 기능
function deleteUser() {
    const checkboxes = document.querySelectorAll('.edit-checkbox');
    const selectedIndexes = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedIndexes.push(index);
        }
    });

    // 인덱스를 역순으로 삭제
    for (let i = selectedIndexes.length - 1; i >= 0; i--) {
        userList.splice(selectedIndexes[i], 1);
    }

    renderUserList(userList);  // 삭제 후 업데이트
}

// 검색 기능
function searchUser() {
    const searchCategory = document.getElementById('search-category').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const filteredUsers = userList.filter(user => {
        if (searchCategory === '아이디') {
            return user.id.toLowerCase().includes(searchInput);
        } else if (searchCategory === '닉네임') {
            return user.nickname.toLowerCase().includes(searchInput);
        }
    });

    renderUserList(filteredUsers);
}

// 페이지 로드 시 초기 목록 출력
window.addEventListener('DOMContentLoaded', () => {
    renderUserList(userList);

    // 추가
    document.getElementById('add-user').addEventListener('click', addUser);

    // 삭제
    document.getElementById('delete-user').addEventListener('click', deleteUser);

    // 저장
    document.getElementById('save-user').addEventListener('click', saveUserData);

    // 검색
    document.getElementById('search-button').addEventListener('click', searchUser);
});