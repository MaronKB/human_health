const savedTemplates = {}; // 날짜별로 저장할 객체

const getFoodData = () => {
    fetch("https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo01/getFoodNtrCpntDbInq01?serviceKey=f1%2BQbUgod6QOKV6u1la%2FM%2FjdVet5FcocsbwQZqd9%2FvsXMpdSf70BOzdBJudiUb%2Bg5%2By96ISpkAlZZm%2FlWRiktg%3D%3D&type=json")
        .then((response) => response.json())
        .then(data => {
            console.log(data);
        });
};

function openModal() {
    const modal = document.getElementById("diet-modal-container");
    if (!modal) return;
    modal.classList.remove("hidden");
}

function closeModal() {
    const modal = document.getElementById("diet-modal-container");
    if (!modal) return;
    modal.classList.add("hidden");
}

let totalCarbs = 0; // 총 탄수화물 초기화
let totalProtein = 0; // 총 단백질 초기화
let totalFat = 0; // 총 지방 초기화
let totalCalories = 0; // 총 칼로리 초기화

function saveTemplate() {
    const currentDateInput = document.getElementById('current-date');
    const currentDate = currentDateInput.value; // 선택된 날짜 가져오기

    if (!currentDate) {
        alert('날짜를 선택하세요!');
        return;
    }

    savedTemplates[currentDate] = {
        totalCarbs,
        totalProtein,
        totalFat,
        totalCalories,
        dietEntries: []
    };

    const dietTableItems = document.querySelectorAll('#diet-table .table-item');
    dietTableItems.forEach(item => {
        const dietEntry = {
            name: item.children[0].innerText,
            mealType: item.children[1].innerText,
            carbs: parseFloat(item.children[2].innerText),
            protein: parseFloat(item.children[3].innerText),
            fat: parseFloat(item.children[4].innerText),
        };
        savedTemplates[currentDate].dietEntries.push(dietEntry);
    });

    alert(`템플릿이 ${currentDate}에 저장되었습니다!`);
}

function loadTemplate() {
    const currentDateInput = document.getElementById('current-date');
    const currentDate = currentDateInput.value; // 선택된 날짜 가져오기

    if (!currentDate) {
        alert('날짜를 선택하세요!');
        return;
    }

    const template = savedTemplates[currentDate];
    if (!template) {
        alert('저장된 템플릿이 없습니다!');
        return;
    }

    totalCarbs = template.totalCarbs;
    totalProtein = template.totalProtein;
    totalFat = template.totalFat;
    totalCalories = template.totalCalories;

    // 테이블 초기화
    const dietTable = document.getElementById('diet-table');
    dietTable.innerHTML = '';

    template.dietEntries.forEach(entry => {
        addDietToTable(entry);
    });

    updateTotals();
    alert(`템플릿이 ${currentDate}에서 불러와졌습니다!`);
}

function saveDiet() {
    const dietName = document.getElementById('selectedDiet').textContent;
    const mealType = document.getElementById('meal-type').value;
    const quantity = document.getElementById('dietQuantity').value;

    if (dietName === '선택하세요' || mealType === '' || quantity === '') {
        alert('모든 항목을 입력하세요!');
        return;
    }
    updateGraphs(); // 그래프 업데이트 함수

    // 선택한 음식의 영양 정보 가져오기
    const foodItem = foodData.find(item => item.name === dietName);
    const carbs = ((foodItem.carb * quantity) / foodItem.amount).toFixed(2);
    const protein = ((foodItem.protein * quantity) / foodItem.amount).toFixed(2);
    const fat = ((foodItem.fat * quantity) / foodItem.amount).toFixed(2);

    // 칼로리 계산
    const calories = (carbs * 4) + (protein * 4) + (fat * 9);
    totalCalories += parseFloat(calories); // 총 칼로리 업데이트

    // 합계 업데이트
    totalCarbs += parseFloat(carbs); // 총 탄수화물 업데이트
    totalProtein += parseFloat(protein); // 총 단백질 업데이트
    totalFat += parseFloat(fat); // 총 지방 업데이트

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
    updateTotals(); // 합계 업데이트 함수 호출

    // 입력 필드 초기화
    document.getElementById('meal-type').value = '';
    document.getElementById('dietQuantity').value = '100';
    closeModal(); // 모달 닫기
}

// 총 칼로리를 업데이트하는 함수 추가
function updateCalories() {
    const totalCaloriesElement = document.querySelector('.diet-kcal span');
    totalCaloriesElement.innerText = `${totalCalories.toFixed(1)}`; // 소수점 한 자리로 표시
}

// 음식을 테이블에 추가하는 함수
function addDietToTable(dietData) {
    const table = document.getElementById('diet-table');
    const newRow = document.createElement('div');
    newRow.className = "table-item";

    newRow.innerHTML = `
        <span>${dietData.name}</span>
        <span>${dietData.mealType}</span>
        <span>${dietData.carbs}g</span>
        <span>${dietData.protein}g</span>
        <span>${dietData.fat}g</span>
        <button class="delete-button" onclick="deleteDiet(this)">X</button>
    `;
    
    table.appendChild(newRow);
    updateTotals(); // 새 항목 추가 후 합계 업데이트
}

function deleteDiet(button) {
    const row = button.parentElement; // 삭제 버튼의 부모 요소 (행) 찾기
    const carbs = parseFloat(row.children[2].innerText); // 탄수화물 값 가져오기
    const protein = parseFloat(row.children[3].innerText); // 단백질 값 가져오기
    const fat = parseFloat(row.children[4].innerText); // 지방 값 가져오기

    // 총합에서 삭제할 값 차감
    totalCarbs -= carbs;
    totalProtein -= protein;
    totalFat -= fat;

    // 테이블에서 행 삭제
    row.remove();

    // 합계 업데이트
    updateTotals();
    updateGraphs();
}

function updateTotals() {
    const totalRow = document.querySelector('#diet-total .table-item');
    totalRow.children[2].innerText = `${totalCarbs.toFixed(1)}g`; // 총 탄수화물 합계 업데이트
    totalRow.children[3].innerText = `${totalProtein.toFixed(1)}g`; // 총 단백질 합계 업데이트
    totalRow.children[4].innerText = `${totalFat.toFixed(1)}g`; // 총 지방 합계 업데이트

    updateCalories(); // 총 칼로리 업데이트 함수 호출
    updateGraphs(); // 그래프 업데이트 함수 호출
}

function updateGraphs() {
    const carbsCurrent = document.getElementById('carbs-current');
    const proteinCurrent = document.getElementById('protein-current');
    const fatCurrent = document.getElementById('fat-current');

    const carbsTarget = 130; // 권장 탄수화물 목표값
    const proteinTarget = 70; // 권장 단백질 목표값
    const fatTarget = 30; // 권장 지방 목표값

    // 각 그래프의 현재값과 목표값 설정
    carbsCurrent.value = Math.min(totalCarbs, carbsTarget); // 탄수화물 현재값
    proteinCurrent.value = Math.min(totalProtein, proteinTarget); // 단백질 현재값
    fatCurrent.value = Math.min(totalFat, fatTarget); // 지방 현재값

    // 그래프의 최대값을 업데이트
    carbsCurrent.max = carbsTarget;
    proteinCurrent.max = proteinTarget;
    fatCurrent.max = fatTarget;
}

function selectDiet(name) {
    const foodItem = foodData.find(item => item.name === name);
    document.getElementById('selectedDiet').innerText = name;
    document.getElementById('dietQuantity').value = 100; // 기본량 설정

    // 영양 성분 업데이트
    const foodName = document.querySelector("#food-name");
    foodName.innerHTML = name;
    const amount = document.querySelector("#amount");
    amount.innerHTML = foodItem.amount;
    const carbs = document.querySelector("#carbs");
    carbs.innerHTML = foodItem.carb;
    const protein = document.querySelector("#protein");
    protein.innerHTML = foodItem.protein;
    const fat = document.querySelector("#fat");
    fat.innerHTML = foodItem.fat;
}

// 모달 외부에서 닫기
window.onclick = function(event) {
    const modal = document.getElementById("diet-modal-container");
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

const graphAnimation = () => {
    const graphs = document.querySelectorAll('.graph-progress');
    graphs.forEach(graph => {
        graph.classList.remove("ready");
    });
};

// 페이지 로드 시 테이블과 페이지네이션 렌더링
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
    updatePagination();
    setTimeout(graphAnimation, 300);

    const currentDateInput = document.getElementById('current-date');
    const today = new Date();

    // 연도, 월, 일 가져오기
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(today.getDate()).padStart(2, '0');

    // 현재 날짜를 "YYYY-MM-DD" 형식으로 설정
    currentDateInput.value = `${year}-${month}-${day}`;
});

// 검색창 키워드 필터링 구현
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
            <li class="food-item" onclick="selectDiet('${item.name}')">
                <span>${item.name}</span>
                <span>${item.amount}</span>
                <span>${item.carb}</span>
                <span>${item.protein}</span>
                <span>${item.fat}</span>
            </li>
        `;
        foodTbody.innerHTML += row; // 행 추가
    });
}

// 사용자가 직접 입력하여 모달 테이블에 데이터 추가.
function addFood() {
    const foodName = document.getElementById('newFoodName').value.trim();
    const amount = parseFloat(document.getElementById('newFoodAmount').value);
    const carb = parseFloat(document.getElementById('newFoodCarb').value);
    const protein = parseFloat(document.getElementById('newFoodProtein').value);
    const fat = parseFloat(document.getElementById('newFoodFat').value);

    updateGraphs(); // 합계 업데이트 후 그래프도 업데이트
    
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
