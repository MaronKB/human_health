function addRow() {
    // 모달 열기
    document.getElementById("dietModal").style.display = "block";
}

function closeModal() {
    document.getElementById("dietModal").style.display = "none";
}

function submitData() {
    //입력 데이터 가져오기
    const foodName = document.getElementById("food-name").value;
    const mealType = document.getElementById("meal-type").value;
    const carbs = document.getElementById("carbs").value;
    const protein = document.getElementById("protein").value;
    const fat = document.getElementById("fat").value;

    // 테이블 본문 부분 선택
    const tableBody = document.querySelector('tbody');

    // 행 생성
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${foodName}</td>
        <td>${mealType}</td>
        <td>${carbs}g</td>
        <td>${protein}g</td>
        <td>${fat}g</td>
    `;
    //새로운 행 본문에 추가
    tableBody.appendChild(newRow);
    //모달 닫기
    closeModal();

    document.getElementById("food-name").value = '';
    document.getElementById("meal-type").value = '';
    document.getElementById("carbs").value = '';
    document.getElementById("protein").value = '';
    document.getElementById("fat").value = '';
}
    // 모달 외부에서 닫기
window.onclick = function(event) {
    const modal = document.getElementById("dietModal");
    if (event.target === modal) {
        closeModal();
    }
}

// 음식을 저장하는 함수
function saveDiet() {
    const dietName = document.getElementById('selectedDiet').textContent;
    const mealType = document.getElementById('meal-type').value;
    const quantity = document.getElementById('dietQuantity').value;

    if (dietName === '선택하세요' || mealType === '' || quantity === '') {
        alert('모든 항목을 입력하세요!');
        return;
    }

    // 음식 데이터를 객체로 저장
    const dietData = {
        name: dietName,
        mealType: mealType,
        quantity: quantity
    };

    // 기존 저장된 데이터를 가져오기
    let savedDiets = JSON.parse(localStorage.getItem('savedDiets')) || [];

    // 새로운 음식 데이터를 추가
    savedDiets.push(dietData);

    // LocalStorage에 저장
    localStorage.setItem('savedDiets', JSON.stringify(savedDiets));

    // 테이블에 새 항목 추가
    addDietToTable(dietData);

    // 입력 필드 초기화
    document.getElementById('meal-type').value = '';
    document.getElementById('dietQuantity').value = '100';
}

// 음식을 테이블에 추가하는 함수
function addDietToTable(dietData) {
    const dietTbody = document.getElementById('dietTbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${dietData.name}</td>
        <td>${dietData.quantity}g</td>
        <td>탄수화물값</td> <!-- 나중에 데이터를 여기에 추가 -->
        <td>단백질값</td>  <!-- 나중에 데이터를 여기에 추가 -->
        <td>지방값</td>    <!-- 나중에 데이터를 여기에 추가 -->
    `;

    dietTbody.appendChild(newRow);
}

// 페이지 로드 시 저장된 데이터를 불러오는 함수
function loadSavedDiets() {
    const savedDiets = JSON.parse(localStorage.getItem('savedDiets')) || [];

    savedDiets.forEach(dietData => {
        addDietToTable(dietData);
    });
}

// 페이지 로드 시 저장된 음식 목록을 불러오기
window.onload = function() {
    loadSavedDiets();
};

// 음식 선택 함수 (예시)
function selectDiet(name, carbs, protein, fat) {
    document.getElementById('selectedDiet').textContent = name;
}