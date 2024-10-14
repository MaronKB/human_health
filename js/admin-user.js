let userList = [];
let currentPage = 1;
const usersPerPage = 20;

async function loadUserData() {
    const storedUserList = localStorage.getItem('users');

    if (storedUserList) {
        userList = JSON.parse(storedUserList);
        renderUserList(userList);
    } else {
        const response = await fetch('../resources/temp-db/user.json');
        userList = await response.json();
        localStorage.setItem('users', JSON.stringify(userList));
        renderUserList(userList);
    }
}

function renderUserList(users) {
    const userListBody = document.getElementById('user-list-body');
    userListBody.innerHTML = '';

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, users.length);
    const paginatedUsers = users.slice(startIndex, endIndex);

    paginatedUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="edit-check-box" data-index="${startIndex + index}"></td>
            <td class="edit-number">${startIndex + index + 1}</td>
            <td><input type="text" value="${user.id}" class="edit-input-id"></td>
            <td><input type="password" value="${user.password}" class="edit-input-password"></td>
            <td><input type="text" value="${user.nickname}" class="edit-input-nickname"></td>
            <td><input type="text" value="${user.emailOptOut}" class="edit-input-emailOptOut"></td>
            <td class="edit-input-date">${user.date}</td>
        `;
        userListBody.appendChild(row);
    });

    updateDeleteButtonState();
    createPagination(users.length);
}

const createPagination = (totalUsers) => {
    const pageCount = Math.ceil(totalUsers / usersPerPage);
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = '';

    const pageButton = [];
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("a");
        button.className = "pagination-button";
        if (i === currentPage) button.classList.add("active");
        button.innerHTML = i;
        button.onclick = () => {
            currentPage = i;
            renderUserList(userList);
        };
        pageButton.push(button);
    }

    paginationContainer.replaceChildren(...pageButton);
}

const arrow = (direction) => {
    let next = (direction) ? currentPage + 1 : currentPage - 1;
    next = (next > Math.ceil(userList.length / usersPerPage)) ? Math.ceil(userList.length / usersPerPage) : (next <= 0) ? 1 : next;
    currentPage = next;
    renderUserList(userList);
}

function saveUserData() {
    const editIds = document.querySelectorAll('.edit-input-id');
    const editPasswords = document.querySelectorAll('.edit-input-password');
    const editNicknames = document.querySelectorAll('.edit-input-nickname');
    const editEmailOptOuts = document.querySelectorAll('.edit-input-emailOptOut');

    userList = Array.from(userList).map((user, index) => {
        return {
            id: editIds[index] ? editIds[index].value : user.id,
            password: editPasswords[index] ? editPasswords[index].value : user.password,
            nickname: editNicknames[index] ? editNicknames[index].value : user.nickname,
            emailOptOut: editEmailOptOuts[index] ? editEmailOptOuts[index].value : user.emailOptOut,
            date: user.date
        };
    });

    localStorage.setItem('users', JSON.stringify(userList));

    alert('저장되었습니다.');
    renderUserList(userList);
}

function addUser() {
    const id = prompt('아이디를 입력해주세요.');
    const password = prompt('비밀번호를 입력해주세요.');
    const nickname = prompt('닉네임을 입력해주세요.');
    const emailOptOut = confirm('이메일 수신 동의 여부를 선택하세요. (확인: Y, 취소: N)') ? 'Y' : 'N';
    const date = prompt('날짜를 입력해주세요.');

    if (id && password && nickname && date) {
        const isIdExist = userList.some(user => user.id === id);
        if (isIdExist) {
            alert('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
            return;
        }

        userList.push({ id, password, nickname, emailOptOut, date });
        localStorage.setItem('users', JSON.stringify(userList));
        renderUserList(userList);
        alert('회원가입이 완료되었습니다.');
    } else {
        alert('모든 정보를 입력해주세요.');
    }
}

function deleteUser() {
    const checkboxes = document.querySelectorAll('.edit-check-box');
    const selectedIndexes = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedIndexes.push(index);
        }
    });

    if (selectedIndexes.length === 0) {
        alert('삭제할 사용자를 선택해주세요.');
        return;
    }

    const confirmation = confirm('정말로 삭제하시겠습니까?');

    if (!confirmation) {
        return;
    }

    const selectedUsers = selectedIndexes.map(index => (currentPage - 1) * usersPerPage + index);

    for (let i = selectedUsers.length - 1; i >= 0; i--) {
        userList.splice(selectedUsers[i], 1);
    }

    localStorage.setItem('users', JSON.stringify(userList));

    if (userList.length <= (currentPage - 1) * usersPerPage) {
        currentPage = Math.max(1, currentPage - 1);
    }

    renderUserList(userList);
    alert('선택된 사용자가 삭제되었습니다.');
}

function searchUser() {
    const searchCategory = document.getElementById('search-category').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const filteredUsers = userList.filter(user => {
        if (searchCategory === '아이디') {
            return user.id.toLowerCase().includes(searchInput);
        } else if (searchCategory === '닉네임') {
            return user.nickname.toLowerCase().includes(searchInput);
        } else if (searchCategory === '이메일 수신') {
            return user.emailOptOut.toLowerCase().includes(searchInput);
        } else if (searchCategory === '가입일') {
            return user.date.includes(searchInput);
        }
        return false;
    });

    renderUserList(filteredUsers);
}

function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll('.edit-check-box');
    const deleteButton = document.getElementById('delete-user');

    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    deleteButton.disabled = !anyChecked;
}

window.addEventListener('DOMContentLoaded', () => {
    loadUserData();

    document.getElementById('add-user').addEventListener('click', addUser);
    document.getElementById('delete-user').addEventListener('click', deleteUser);
    document.getElementById('save-user').addEventListener('click', saveUserData);
    document.getElementById('search-button').addEventListener('click', searchUser);

    document.getElementById('user-list-body').addEventListener('change', updateDeleteButtonState);

    document.getElementById('pagination-left').addEventListener('click', () => arrow(false));
    document.getElementById('pagination-right').addEventListener('click', () => arrow(true));
});

// localStorage.clear();