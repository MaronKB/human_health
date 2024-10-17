const user = JSON.parse(localStorage.getItem("user"));
const setBMR = () => {
    const defData = {
        name: "김이름",
            img: "resources/images/male.jpg",
            gender: "male",
            age: 28,
            height: 182,
            weight: 90,
            targetWeight: 65.5,
            fat: 25,
            targetFat: 11.2,
            skeletal: 38.4,
            targetSkeletal: 32,
            bmr: 2024.69
    };
    const data = (user.length === 0) ? defData : user;
    const kcal = data.weight * 30;

    const target = document.querySelector("#recommend-kcal");
    target.innerHTML = kcal;
}

// 음식 데이터 가져오기
const getFoodData = () => {
    fetch("https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo01/getFoodNtrCpntDbInq01?serviceKey=...")
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // 데이터 출력
        })
        .catch(error => {
            alert('데이터를 가져오는 데 실패했습니다: ' + error.message);
        });
}

// 모달 열기
function openModal() {
    const modal = document.getElementById("diet-modal-container");
    if (!modal) return;
    modal.classList.remove("hidden");
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById("diet-modal-container");
    if (!modal) return;
    modal.classList.add("hidden");
}

// 영양소 초기화
let totalCarbs = 0; // 총 탄수화물
let totalProtein = 0; // 총 단백질
let totalFat = 0; // 총 지방
let totalCalories = 0; // 총 칼로리

// 현재 날짜 가져오기
function getCurrentDate() {
    const currentDateInput = document.getElementById('current-date');
    return currentDateInput.value; // YYYY-MM-DD 형식의 날짜 반환
}

// 로컬 스토리지에 데이터 저장
function saveToLocalStorage() {
    const currentDate = getCurrentDate(); // 현재 날짜 가져오기
    const dietEntries = []; // 식단 데이터를 저장할 배열

    const tableItems = document.querySelectorAll('#diet-table .table-item');
    tableItems.forEach(item => {
        const dietData = {
            name: item.children[0].innerText,
            mealType: item.children[1].innerText,
            carbs: parseFloat(item.children[2].innerText),
            protein: parseFloat(item.children[3].innerText),
            fat: parseFloat(item.children[4].innerText)
        };
        dietEntries.push(dietData); // 배열에 추가
    });

    // 총 영양소 데이터 저장
    const totalData = {
        totalCalories,
        totalCarbs,
        totalProtein,
        totalFat
    };

    // 날짜를 키로 하여 로컬 스토리지에 저장
    localStorage.setItem(`dietEntries_${currentDate}`, JSON.stringify(dietEntries)); 
    localStorage.setItem(`totalData_${currentDate}`, JSON.stringify(totalData)); 
}

// 로컬 스토리지에서 데이터 불러오기
function loadFromLocalStorage() {
    const currentDate = getCurrentDate(); // 현재 날짜 가져오기
    const dietEntries = JSON.parse(localStorage.getItem(`dietEntries_${currentDate}`)) || [];
    const totalData = JSON.parse(localStorage.getItem(`totalData_${currentDate}`)) || {};

    // 식단 데이터 테이블에 추가
    dietEntries.forEach(entry => {
        addDietToTable(entry);
    });

    // 총 영양소 업데이트
    totalCalories = totalData.totalCalories || 0;
    totalCarbs = totalData.totalCarbs || 0;
    totalProtein = totalData.totalProtein || 0;
    totalFat = totalData.totalFat || 0;

    updateTotals(); // 합계 업데이트
}

// 날짜 변경 시 데이터 로드
document.getElementById('current-date').addEventListener('change', () => {
    clearDietTable(); // 테이블 초기화
    loadFromLocalStorage(); // 선택한 날짜의 데이터 로드
});

// 식단 테이블 초기화 함수
function clearDietTable() {
    const table = document.getElementById('diet-table');
    table.innerHTML = ''; // 테이블 내용 초기화
    totalCalories = 0; 
    totalCarbs = 0;
    totalProtein = 0;
    totalFat = 0;
    updateTotals(); // 합계 초기화
}

// 식단 저장 함수
function saveDiet() {
    const dietName = document.getElementById('selectedDiet').textContent; // 선택한 음식 이름
    const mealType = document.getElementById('meal-type').value; // 식사 구분
    const quantity = document.getElementById('dietQuantity').value; // 수량

    // 입력 필드 확인
    if (dietName === '선택하세요' || mealType === '' || quantity === '') {
        alert('모든 항목을 입력하세요!');
        return;
    }

    // 선택한 음식의 영양 정보 가져오기
    const foodItem = foodData.find(item => item.name === dietName);
    const carbs = ((foodItem.carb * quantity) / foodItem.amount).toFixed(1);
    const protein = ((foodItem.protein * quantity) / foodItem.amount).toFixed(1);
    const fat = ((foodItem.fat * quantity) / foodItem.amount).toFixed(1);
    
    // 칼로리 계산
    const calories = (carbs * 4) + (protein * 4) + (fat * 9);
    
    // 총 영양소 업데이트
    totalCalories += parseFloat(calories);
    totalCarbs += parseFloat(carbs);
    totalProtein += parseFloat(protein);
    totalFat += parseFloat(fat);

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
    updateTotals(); // 합계 업데이트 호출

    // 로컬 스토리지에 저장
    saveToLocalStorage();

    // 입력 필드 초기화
    document.getElementById('meal-type').value = '';
    document.getElementById('dietQuantity').value = '100';
    closeModal(); // 모달 닫기
}

// 총 칼로리를 업데이트하는 함수
function updateCalories() {
    const totalCaloriesElement = document.querySelector('.diet-kcal-box span');
    totalCaloriesElement.innerText = `${Math.max(0, totalCalories).toFixed(0)}`; // 소수점 한 자리로 표시
}

// 음식을 테이블에 추가하는 함수
function addDietToTable(dietData) {
    const table = document.getElementById('diet-table');
    const newRow = document.createElement('div');
    newRow.className = "table-item";
    newRow.setAttribute('draggable', true); // 드래그 가능 설정

    newRow.innerHTML = `
        <span>${dietData.name}</span>
        <span>${dietData.mealType}</span>
        <span>${dietData.carbs}g</span>
        <span>${dietData.protein}g</span>
        <span>${dietData.fat}g</span>
        <button class="delete-button" onclick="deleteDiet(this)">X</button>
    `;
    // 드래그 이벤트 핸들러 추가
    newRow.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', newRow.innerHTML);
        newRow.classList.add('dragging');
    });

    newRow.addEventListener('dragend', () => {
        newRow.classList.remove('dragging');
    });

    newRow.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (newRow !== draggingItem) {
            newRow.classList.add('over');
        }
    });

    newRow.addEventListener('dragleave', () => {
        newRow.classList.remove('over');
    });

    newRow.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (newRow !== draggingItem) {
            const draggingItemContent = draggingItem.innerHTML;
            draggingItem.innerHTML = newRow.innerHTML;
            newRow.innerHTML = draggingItemContent;

            // 재배치 후 총합 업데이트
            updateTotals();
            saveToLocalStorage(); // 새로운 순서를 로컬 스토리지에 저장
        }
        newRow.classList.remove('over');
    });
    
    table.appendChild(newRow);
    updateTotals(); // 새 항목 추가 후 합계 업데이트
}

// 식단 삭제 함수
function deleteDiet(button) {
    const row = button.parentElement; // 삭제 버튼의 부모 요소 (행) 찾기
    const carbs = parseFloat(row.children[2].innerText); // 탄수화물 값 가져오기
    const protein = parseFloat(row.children[3].innerText); // 단백질 값 가져오기
    const fat = parseFloat(row.children[4].innerText); // 지방 값 가져오기

    // 총합에서 삭제할 값 차감
    totalCarbs -= carbs;
    totalProtein -= protein;
    totalFat -= fat;
    totalCalories -= (carbs * 4) + (protein * 4) + (fat * 9); // 칼로리 차감

    // 테이블에서 행 삭제
    row.remove();

    // 합계 업데이트
    updateTotals();

    // 로컬 스토리지에 저장
    saveToLocalStorage();
}

// 합계 업데이트 함수
function updateTotals() {
    const totalRow = document.querySelector('#diet-total .table-item');
    totalRow.children[2].innerText = `${Math.max(0, totalCarbs).toFixed(1)}g`; // 총 탄수화물 합계 업데이트
    totalRow.children[3].innerText = `${Math.max(0, totalProtein).toFixed(1)}g`; // 총 단백질 합계 업데이트
    totalRow.children[4].innerText = `${Math.max(0, totalFat).toFixed(1)}g`; // 총 지방 합계 업데이트

    updateCalories(); // 총 칼로리 업데이트 호출
    updateGraphs(); // 그래프 업데이트 호출
}

function updateGraphs() {
    const carbsCurrent = document.getElementById('carbs-current');
    const proteinCurrent = document.getElementById('protein-current');
    const fatCurrent = document.getElementById('fat-current');

    const carbsTotalDisplay = document.getElementById('carbs-total'); // 추가된 부분
    const proteinTotalDisplay = document.getElementById('protein-total'); // 추가된 부분
    const fatTotalDisplay = document.getElementById('fat-total'); // 추가된 부분

    const carbsTarget = 650; // 권장 탄수화물 목표값
    const proteinTarget = 170; // 권장 단백질 목표값
    const fatTarget = 100; // 권장 지방 목표값

    // 각 그래프의 현재값과 목표값 설정
    carbsCurrent.value = Math.min(totalCarbs, carbsTarget);
    proteinCurrent.value = Math.min(totalProtein, proteinTarget);
    fatCurrent.value = Math.min(totalFat, fatTarget);

    // 총합 표시
    carbsTotalDisplay.textContent = `${totalCarbs.toFixed(1)}g`; // 추가된 부분
    proteinTotalDisplay.textContent = `${totalProtein.toFixed(1)}g`; // 추가된 부분
    fatTotalDisplay.textContent = `${totalFat.toFixed(1)}g`; // 추가된 부분

    // 그래프 표시
    carbsCurrent.setAttribute('max', carbsTarget);
    proteinCurrent.setAttribute('max', proteinTarget);
    fatCurrent.setAttribute('max', fatTarget);
}

// 식단 선택 함수
function selectDiet(name) {
    const foodItem = foodData.find(item => item.name === name);
    document.getElementById('selectedDiet').innerText = name; // 선택한 음식 이름 표시
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

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById("diet-modal-container");
    if (event.target === modal) {
        closeModal();
    }
}

// 페이지네이션 구현
let foodData = JSON.parse(localStorage.getItem("diets"));
if (!foodData || foodData.length === 0) foodData = [
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
    { name: "스테이크", amount: 200, carb: 0, protein: 30, fat: 20 },
    { name: "파스타", amount: 150, carb: 75, protein: 10, fat: 5 },
    { name: "샐러드", amount: 100, carb: 10, protein: 2, fat: 8 },
    { name: "피자", amount: 150, carb: 40, protein: 12, fat: 15 },
    { name: "리조또", amount: 200, carb: 50, protein: 8, fat: 10 },
    { name: "크로와상", amount: 100, carb: 45, protein: 8, fat: 20 },
    { name: "스프링롤", amount: 100, carb: 25, protein: 2, fat: 5 },
    { name: "브라우니", amount: 100, carb: 60, protein: 5, fat: 20 },
    { name: "팬케이크", amount: 100, carb: 40, protein: 5, fat: 10 },
    { name: "오믈렛", amount: 100, carb: 1, protein: 10, fat: 7 },
    { name: "볶음밥", amount: 200, carb: 60, protein: 8, fat: 10 },
    { name: "짜장면", amount: 200, carb: 70, protein: 12, fat: 15 },
    { name: "탕수육", amount: 150, carb: 30, protein: 20, fat: 25 },
    { name: "마파두부", amount: 150, carb: 10, protein: 12, fat: 15 },
    { name: "군만두", amount: 100, carb: 30, protein: 5, fat: 15 },
    { name: "유린기", amount: 200, carb: 10, protein: 25, fat: 10 },
    { name: "소고기짬뽕", amount: 250, carb: 50, protein: 15, fat: 20 },
    { name: "해물탕면", amount: 250, carb: 60, protein: 20, fat: 15 },
    { name: "간장계란밥", amount: 150, carb: 20, protein: 6, fat: 8 },
    { name: "냉면", amount: 200, carb: 40, protein: 6, fat: 5 },
    { name: "비빔밥", amount: 300, carb: 50, protein: 15, fat: 10 },
    { name: "김치찌개", amount: 200, carb: 15, protein: 12, fat: 8 },
    { name: "불고기", amount: 150, carb: 10, protein: 25, fat: 20 },
    { name: "잡채", amount: 200, carb: 40, protein: 5, fat: 10 },
    { name: "김밥", amount: 250, carb: 40, protein: 10, fat: 5 },
    { name: "닭갈비", amount: 200, carb: 20, protein: 25, fat: 15 },
    { name: "순두부찌개", amount: 200, carb: 10, protein: 14, fat: 6 },
    { name: "된장찌개", amount: 200, carb: 15, protein: 12, fat: 5 },
    { name: "삼겹살", amount: 150, carb: 0, protein: 20, fat: 30 },
    { name: "김치볶음밥", amount: 250, carb: 60, protein: 10, fat: 10 }
];

let currentPage = 1; // 현재 페이지
const rowsPerPage = 8; // 페이지당 행 수

// 페이지 변경 함수
function changePage(page) {
    if (page === 'prev') {
        currentPage = Math.max(1, currentPage - 1);
    } else if (page === 'next') {
        currentPage = Math.min(Math.ceil(foodData.length / rowsPerPage), currentPage + 1);
    } else {
        currentPage = page;
    }

    renderTable(); // 테이블 렌더링
    updatePagination(); // 페이지네이션 업데이트
}

// 페이지네이션 업데이트 함수
function updatePagination() {
    const pageNumbersContainer = document.getElementById("page-numbers");
    pageNumbersContainer.innerHTML = ""; // 페이지 번호 초기화

    const totalPages = Math.ceil(foodData.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.className = "page-number";
        button.textContent = i; // 페이지 번호 표시
        button.onclick = () => changePage(i);
        if (i === currentPage) {
            button.disabled = true; // 현재 페이지 버튼 비활성화
        }
        pageNumbersContainer.appendChild(button);
    }
}

// 그래프 애니메이션 초기화
const graphAnimation = () => {
    const graphs = document.querySelectorAll('.graph-progress');
    graphs.forEach(graph => {
        graph.classList.remove("ready");
    })
}

/// 페이지 로드 시 테이블과 페이지네이션 렌더링
document.addEventListener("DOMContentLoaded", () => {
    const currentDateInput = document.getElementById('current-date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(today.getDate()).padStart(2, '0');

    currentDateInput.value = `${year}-${month}-${day}`; // 현재 날짜 설정

    // 로컬 스토리지에서 데이터 로드
    loadFromLocalStorage(); // 이 부분 추가
    renderTable(); // 테이블 렌더링
    updatePagination(); // 페이지네이션 업데이트
    setTimeout(graphAnimation, 300); // 그래프 애니메이션

    setBMR();
});


// 검색 기능 구현
function filterTable() {
    const searchTerm = document.getElementById('search-food').value.toLowerCase();
    const filteredData = foodData.filter(item => item.name.toLowerCase().includes(searchTerm));
    currentPage = 1; // 페이지를 처음으로 되돌리기
    renderTable(filteredData);
    updatePagination(filteredData);
}

// 테이블 렌더링 함수
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

// 새로운 음식 추가 함수
function addFood() {
    const foodName = document.getElementById('newFoodName').value.trim();
    const amount = parseFloat(document.getElementById('newFoodAmount').value);
    const carb = parseFloat(document.getElementById('newFoodCarb').value);
    const protein = parseFloat(document.getElementById('newFoodProtein').value);
    const fat = parseFloat(document.getElementById('newFoodFat').value);

    // 유효성 검사
    if (!foodName || isNaN(amount) || isNaN(carb) || isNaN(protein) || isNaN(fat) || amount <= 0 || carb < 0 || protein < 0 || fat < 0) {
        alert('모든 필드를 올바르게 입력하세요. 수량은 1 이상이어야 하며, 영양 성분은 음수가 될 수 없습니다.');
        return;
    }

    // 새로운 음식 데이터 객체 생성
    const newFood = { name: foodName, amount: amount, carb: carb, protein: protein, fat: fat };
    foodData.push(newFood); // foodData 배열에 추가
    localStorage.setItem("diets", JSON.stringify(foodData));

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
