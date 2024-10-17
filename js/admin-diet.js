let dietList = [];
let currentPage = 1;
const dietsPerPage = 20;

async function loadDietData() {
    const storedDietList = localStorage.getItem('diets');

    if (storedDietList) {
        dietList = JSON.parse(storedDietList);
        renderDietList(dietList);
    } else {
        const response = await fetch('../resources/temp-db/diet.json');
        dietList = await response.json();
        localStorage.setItem('diets', JSON.stringify(dietList));
        renderDietList(dietList);
    }
}

function renderDietList(diets) {
    const dietListBody = document.getElementById('diet-list-body');
    dietListBody.innerHTML = '';

    const startIndex = (currentPage - 1) * dietsPerPage;
    const endIndex = Math.min(startIndex + dietsPerPage, diets.length);
    const paginatedDiets = diets.slice(startIndex, endIndex);

    paginatedDiets.forEach((diet, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" id="${startIndex + index}" class="edit-check-box" data-index="${startIndex + index}"><label for="${startIndex + index}"></label></td>
            <td class="edit-number">${startIndex + index + 1}</td>
            <td><input type="text" value="${diet.name}" class="edit-input-food"></td>
            <td><input type="text" value="${diet.amount}" class="edit-input-amount"></td>
            <td><input type="text" value="${diet.carb}" class="edit-input-carbs"></td>
            <td><input type="text" value="${diet.protein}" class="edit-input-protein"></td>
            <td><input type="text" value="${diet.fat}" class="edit-input-fat"></td>
        `;
        dietListBody.appendChild(row);
    });

    if (paginatedDiets.length < dietsPerPage) {
        for (let i = 0; i < dietsPerPage - paginatedDiets.length; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td></td>
                <td class="edit-number"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            `;
            dietListBody.appendChild(row);
        }
    }

    updateDeleteButtonState();
    createPagination(diets.length);
}

const createPagination = (totalDiets) => {
    const pageCount = Math.ceil(totalDiets / dietsPerPage);
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
            renderDietList(dietList);
        };
        pageButton.push(button);
    }

    paginationContainer.replaceChildren(...pageButton);
}

const arrow = (direction) => {
    let next = (direction) ? currentPage + 1 : currentPage - 1;
    next = (next > Math.ceil(dietList.length / dietsPerPage)) ? Math.ceil(dietList.length / dietsPerPage) : (next <= 0) ? 1 : next;
    currentPage = next;
    renderDietList(dietList);
}

function saveDietData() {
    const editFoods = document.querySelectorAll('.edit-input-food');
    const editAmounts = document.querySelectorAll('.edit-input-amount');
    const editCarbs = document.querySelectorAll('.edit-input-carbs');
    const editProteins = document.querySelectorAll('.edit-input-protein');
    const editFats = document.querySelectorAll('.edit-input-fat');

    dietList = Array.from(dietList).map((diet, index) => {
        return {
            food: editFoods[index] ? editFoods[index].value : diet.name,
            amount: editAmounts[index] ? editAmounts[index].value : diet.amount,
            carbs: editCarbs[index] ? editCarbs[index].value : diet.carb,
            protein: editProteins[index] ? editProteins[index].value : diet.protein,
            fat: editFats[index] ? editFats[index].value : diet.fat
        };
    });

    localStorage.setItem('diets', JSON.stringify(dietList));
    alert('저장되었습니다.');
    renderDietList(dietList);
}

function addDiet() {
    const food = prompt('음식명을 입력해주세요.');
    if (food === null) return;

    const amount = prompt('기준량을 입력해주세요.');
    if (amount === null) return;

    const carb = prompt('탄수화물을 입력해주세요.');
    if (carb === null) return;

    const protein = prompt('단백질을 입력해주세요.');
    if (protein === null) return;

    const fat = prompt('지방을 입력해주세요.');
    if (fat === null) return;

    if (food && amount && carb && protein && fat) {
        dietList.push({ food, amount, carb, protein, fat });
        localStorage.setItem('diets', JSON.stringify(dietList));
        renderDietList(dietList);
        alert('음식이 추가되었습니다.');
    } else {
        alert('모든 정보를 입력해주세요.');
    }
}

function deleteDiet() {
    const checkboxes = document.querySelectorAll('.edit-check-box');
    const selectedIndexes = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedIndexes.push(index);
        }
    });

    if (selectedIndexes.length === 0) {
        alert('삭제할 음식을 선택해주세요.');
        return;
    }

    const confirmation = confirm('정말로 삭제하시겠습니까?');
    if (!confirmation) return;

    const selectedDiets = selectedIndexes.map(index => (currentPage - 1) * dietsPerPage + index);

    for (let i = selectedDiets.length - 1; i >= 0; i--) {
        dietList.splice(selectedDiets[i], 1);
    }

    localStorage.setItem('diets', JSON.stringify(dietList));

    if (dietList.length <= (currentPage - 1) * dietsPerPage) {
        currentPage = Math.max(1, currentPage - 1);
    }

    renderDietList(dietList);
    alert('선택된 음식이 삭제되었습니다.');
}

function searchDiet() {
    const searchCategory = document.getElementById('search-category').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const filteredDiets = dietList.filter(diet => {
        if (searchCategory === '음식') {
            return diet.name.toLowerCase().includes(searchInput);
        } else if (searchCategory === '기준량') {
            return diet.amount.toLowerCase().includes(searchInput);
        } else if (searchCategory === '탄수화물') {
            return diet.carb.toLowerCase().includes(searchInput);
        } else if (searchCategory === '단백질') {
            return diet.protein.toLowerCase().includes(searchInput);
        } else if (searchCategory === '지방') {
            return diet.fat.toLowerCase().includes(searchInput);
        }
        return false;
    });

    renderDietList(filteredDiets);
}

function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll('.edit-check-box');
    const deleteButton = document.getElementById('delete-diet');

    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    deleteButton.disabled = !anyChecked;
}

window.addEventListener('DOMContentLoaded', () => {
    loadDietData();

    document.getElementById('add-diet').addEventListener('click', addDiet);
    document.getElementById('delete-diet').addEventListener('click', deleteDiet);
    document.getElementById('save-diet').addEventListener('click', saveDietData);
    document.getElementById('search-button').addEventListener('click', searchDiet);

    document.getElementById('diet-list-body').addEventListener('change', updateDeleteButtonState);
    document.getElementById('pagination-left').addEventListener('click', () => arrow(false));
    document.getElementById('pagination-right').addEventListener('click', () => arrow(true));
});

// localStorage.clear();