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
    const carbs = parseFloat(document.querySelector("#carbs").innerHTML);
    const protein = parseFloat(document.querySelector("#protein").innerHTML);
    const fat = parseFloat(document.querySelector("#fat").innerHTML);

    // 음식 데이터를 객체로 저장
    const dietData = {
        name: dietName,
        mealType: mealType,
        quantity: quantity,
        carbs: carbs,
        protein: protein,
        fat: fat
    };

    // 기존 저장된 데이터를 가져오기
    let savedDiets = JSON.parse(localStorage.getItem('savedDiets')) || [];
    savedDiets.push(dietData);
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
        <td>${dietData.mealType}</td>
        <td>${dietData.carbs}g</td>
        <td>${dietData.protein}g</td>
        <td>${dietData.fat}g</td>
    `;

    dietTbody.appendChild(newRow);
}

function selectDiet(foodName, carbs, protein, fat) {
    document.getElementById('selectedDiet').innerText = foodName;
    const quantity = document.getElementById('dietQuantity').value;
    document.getElementById('dietInfo').innerHTML = `
        <strong>음식: ${foodName}</strong> (기준량: ${quantity}g)
        <br><strong>탄수화물:</strong><span id="carbs">${((carbs * quantity) / 100).toFixed(2)}</span>g
        <br><strong>단백질:</strong><span id="protein">${((protein * quantity) / 100).toFixed(2)}</span>g
        <br><strong>지방:</strong><span id="fat">${((fat * quantity) / 100).toFixed(2)}</span>g
    `;
}

// 모달 외부에서 닫기
window.onclick = function(event) {
    const modal = document.getElementById("dietModal");
    if (event.target === modal) {
        closeModal();
    }
}