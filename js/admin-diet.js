let dietList = [
    { food: '음식1', amount: '100', carbs: '1', protein: '1', fat: '1' },
    { food: '음식2', amount: '100', carbs: '2', protein: '2', fat: '2' },
    { food: '음식3', amount: '100', carbs: '3', protein: '3', fat: '3' },
    { food: '음식4', amount: '100', carbs: '4', protein: '4', fat: '4' },
    { food: '음식5', amount: '100', carbs: '5', protein: '5', fat: '5' },
    { food: '음식6', amount: '100', carbs: '6', protein: '6', fat: '6' },
    { food: '음식7', amount: '100', carbs: '7', protein: '7', fat: '7' },
    { food: '음식8', amount: '100', carbs: '8', protein: '8', fat: '8' },
    { food: '음식9', amount: '100', carbs: '9', protein: '9', fat: '9' },
    { food: '음식10', amount: '100', carbs: '10', protein: '10', fat: '10' },
    { food: '음식11', amount: '100', carbs: '11', protein: '11', fat: '11' },
];

function renderDietList(diets) {
    const dietListBody = document.getElementById('diet-list-body');
    dietListBody.innerHTML = '';

    diets.forEach((diet, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><input type="checkbox" class="edit-checkbox" data-index="${index}"></td>
        <td class="edit-number">${index + 1}</td>
        <td><input type="text" value="${diet.food}" class="edit-input-food"></td>
        <td><input type="text" value="${diet.amount}" class="edit-input-amount"></td>
        <td><input type="text" value="${diet.carbs}" class="edit-input-carbs"></td>
        <td><input type="text" value="${diet.protein}" class="edit-input-protein"></td>
        <td><input type="text" value="${diet.fat}" class="edit-input-fat"></td>
    `;
        dietListBody.appendChild(row);
    });
}

function saveDietData() {
    const editFoods = document.querySelectorAll('.edit-input-food');
    const editAmounts = document.querySelectorAll('.edit-input-amount');
    const editCarbs = document.querySelectorAll('.edit-input-carbs');
    const editProteins = document.querySelectorAll('.edit-input-protein');
    const editFats = document.querySelectorAll('.edit-input-fat');

    dietList = Array.from(dietList).map((diet, index) => {
        return {
            food: editFoods[index] ? editFoods[index].value : diet.food,
            amount: editAmounts[index] ? editAmounts[index].value : diet.amount,
            carbs: editCarbs[index] ? editCarbs[index].value : diet.carbs,
            protein: editProteins[index] ? editProteins[index].value : diet.protein,
            fat: editFats[index] ? editFats[index].value : diet.fat
        };
    });

    alert('저장되었습니다.');
    renderDietList(dietList);
}

function addDiet() {
    const food = prompt('음식명을 입력해주세요.');
    const amount = prompt('기준량을 입력해주세요.');
    const carbs = prompt('탄수화물을 입력해주세요.');
    const protein = prompt('단백질을 입력해주세요.');
    const fat = prompt('지방을 입력해주세요.');

    if (food && amount && carbs && protein && fat) {
        dietList.push({ food, amount, carbs, protein, fat });
        renderDietList(dietList);
    } else {
        alert('모든 정보를 입력해주세요.');
    }
}

function deleteDiet() {
    const checkboxes = document.querySelectorAll('.edit-checkbox');
    const selectedIndexes = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedIndexes.push(index);
        }
    });

    for (let i = selectedIndexes.length - 1; i >= 0; i--) {
        dietList.splice(selectedIndexes[i], 1);
    }

    renderDietList(dietList);
}

function searchDiet() {
    const searchCategory = document.getElementById('search-category').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const filteredDiets = dietList.filter(diet => {
        if (searchCategory === '음식') {
            return diet.food.toLowerCase().includes(searchInput);
        } else if (searchCategory === '기준량') {
            return diet.amount.toLowerCase().includes(searchInput);
        } else if (searchCategory === '탄수화물') {
            return diet.carbs.toLowerCase().includes(searchInput);
        } else if (searchCategory === '단백질') {
            return diet.protein.toLowerCase().includes(searchInput);
        } else if (searchCategory === '지방') {
            return diet.fat.toLowerCase().includes(searchInput);
        }
        return false;
    });

    renderDietList(filteredDiets);
}

window.addEventListener('DOMContentLoaded', () => {
    renderDietList(dietList);

    document.getElementById('add-diet').addEventListener('click', addDiet);

    document.getElementById('delete-diet').addEventListener('click', deleteDiet);

    document.getElementById('save-diet').addEventListener('click', saveDietData);

    document.getElementById('search-button').addEventListener('click', searchDiet);
});