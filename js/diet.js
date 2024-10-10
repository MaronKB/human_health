function addRow() {
    document.getElementById("dietModal").style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("dietModal");
    if (modal) {
        modal.style.display = "none";
    }
}

function saveDiet() {
    const dietName = document.getElementById('selectedDiet').textContent;
    const mealType = document.getElementById('meal-type').value;
    const quantity = document.getElementById('dietQuantity').value;

    if (dietName === '선택하세요' || mealType === '' || quantity === '') {
        alert('모든 항목을 입력하세요!');
        return;
    }

    // 선택한 음식의 영양 정보 가져오기
    const foodItem = foodData.find(item => item.name === dietName);
    const carbs = ((foodItem.carb * quantity) / foodItem.amount).toFixed(2);
    const protein = ((foodItem.protein * quantity) / foodItem.amount).toFixed(2);
    const fat = ((foodItem.fat * quantity) / foodItem.amount).toFixed(2);

    // 음식 데이터를 객체로 저장
    const dietData = {
        name: dietName,
        mealType: mealType,
        quantity: quantity,
        carbs: carbs,
        protein: protein,
        fat: fat
    };

    // 테이블에 새 항목 추가
    addDietToTable(dietData);

    // 입력 필드 초기화
    document.getElementById('meal-type').value = '';
    document.getElementById('dietQuantity').value = '100';
    closeModal(); // 모달 닫기
}

// 음식을 테이블에 추가하는 함수
function addDietToTable(dietData) {
    const dietTbody = document.getElementById('dietTbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${dietData.name}</td>
        <td>${dietData.mealType}</td>
        <td>${dietData.carbs}g</td>
        <td>${dietData.protein}g</td>
        <td>${dietData.fat}g</td>
    `;

    dietTbody.appendChild(newRow);
}

function selectDiet(foodName) {
    const foodItem = foodData.find(item => item.name === foodName);
    document.getElementById('selectedDiet').innerText = foodName;
    document.getElementById('dietQuantity').value = 100; // 기본량 설정

    // 영양 성분 업데이트
    document.getElementById('dietInfo').innerHTML = `
        <strong>음식: ${foodName}</strong> (기준량: 100g)
        <br><strong>탄수화물:</strong><span id="carbs">${foodItem.carb}</span>g
        <br><strong>단백질:</strong><span id="protein">${foodItem.protein}</span>g
        <br><strong>지방:</strong><span id="fat">${foodItem.fat}</span>g
    `;
}

// 모달 외부에서 닫기
window.onclick = function(event) {
    const modal = document.getElementById("dietModal");
    if (event.target === modal) {
        closeModal();
    }
}
    // 페이지네이션 구현
const foodData = [
    { name: "밥", amount: 100, carb: 28, protein: 2, fat: 0.3 },
    { name: "닭가슴살", amount: 100, carb: 0, protein: 24, fat: 1.5 },
    { name: "사과", amount: 100, carb: 12, protein: 0.3, fat: 0.2 },
    { name: "계란", amount: 50, carb: 1, protein: 6, fat: 5 },
    { name: "고구마", amount: 100, carb: 20, protein: 1, fat: 0.1 },
    { name: "바나나", amount: 100, carb: 23, protein: 1.1, fat: 0.3 },
    { name: "치킨", amount: 100, carb: 0, protein: 31, fat: 10 },
    { name: "연어", amount: 100, carb: 0, protein: 25, fat: 13 },
    { name: "아보카도", amount: 100, carb: 9, protein: 1.5, fat: 15 },
    { name: "브로콜리", amount: 100, carb: 7, protein: 2.8, fat: 0.4 },
];

let currentPage = 1;
const rowsPerPage = 5;

function changePage(page) {
    if (page === 'prev') {
        currentPage = Math.max(1, currentPage - 1);
    } else if (page === 'next') {
        currentPage = Math.min(Math.ceil(foodData.length / rowsPerPage), currentPage + 1);
    } else {
        currentPage = page;
    }

    renderTable();
    updatePagination();
}

function renderTable() {
    const foodTbody = document.getElementById("foodTbody");
    foodTbody.innerHTML = ""; // 테이블 내용 초기화

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = foodData.slice(start, end); // 현재 페이지의 데이터만 추출

    paginatedData.forEach(item => {
        const row = `
            <tr onclick="selectDiet('${item.name}')">
                <td>${item.name}</td>
                <td>${item.amount}</td>
                <td>${item.carb}</td>
                <td>${item.protein}</td>
                <td>${item.fat}</td>
            </tr>
        `;
        foodTbody.innerHTML += row; // 행 추가
    });
}

function updatePagination() {
    const pageNumbersContainer = document.getElementById("page-numbers");
    pageNumbersContainer.innerHTML = ""; // 페이지 번호 초기화

    const totalPages = Math.ceil(foodData.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.className = "page-number";
        button.textContent = i;
        button.onclick = () => changePage(i);
        if (i === currentPage) {
            button.disabled = true; // 현재 페이지 버튼 비활성화
        }
        pageNumbersContainer.appendChild(button);
    }
}

// 페이지 로드 시 테이블과 페이지네이션 렌더링
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
    updatePagination();
});

//=======================================================
    //검색창 키워드 필터링 구현
function filterTable() {
    const searchTerm = document.getElementById('search-food').value.toLowerCase();
    const filteredData = foodData.filter(item => item.name.toLowerCase().includes(searchTerm));
    currentPage = 1; // 페이지를 처음으로 되돌리기
    renderTable(filteredData);
    updatePagination(filteredData);
}

function renderTable(data = foodData) {
    const foodTbody = document.getElementById("foodTbody");
    foodTbody.innerHTML = ""; // 테이블 내용 초기화

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end); // 현재 페이지의 데이터만 추출

    paginatedData.forEach(item => {
        const row = `
            <tr onclick="selectDiet('${item.name}')">
                <td>${item.name}</td>
                <td>${item.amount}</td>
                <td>${item.carb}</td>
                <td>${item.protein}</td>
                <td>${item.fat}</td>
            </tr>
        `;
        foodTbody.innerHTML += row; // 행 추가
    });
}
//=====================================================================
    // 사용자가 직접 입력하여 모달 테이블에 데이터 추가.
function addFood() {
    const foodName = document.getElementById('newFoodName').value.trim();
    const amount = parseFloat(document.getElementById('newFoodAmount').value);
    const carb = parseFloat(document.getElementById('newFoodCarb').value);
    const protein = parseFloat(document.getElementById('newFoodProtein').value);
    const fat = parseFloat(document.getElementById('newFoodFat').value);

    // 유효성 검사
    if (!foodName || isNaN(amount) || isNaN(carb) || isNaN(protein) || isNaN(fat)) {
        alert('모든 필드를 올바르게 입력하세요.');
        return;
    }

    // 새로운 음식 데이터 객체 생성
    const newFood = { name: foodName, amount: amount, carb: carb, protein: protein, fat: fat };
    foodData.push(newFood); // foodData 배열에 추가

    // 테이블 업데이트
    renderTable();
    updatePagination(); // 페이지 업데이트

    // 입력 필드 초기화
    document.getElementById('newFoodName').value = '';
    document.getElementById('newFoodAmount').value = '';
    document.getElementById('newFoodCarb').value = '';
    document.getElementById('newFoodProtein').value = '';
    document.getElementById('newFoodFat').value = '';
}