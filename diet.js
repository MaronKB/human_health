function addRow() {
    // 모달 열기
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
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
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        closeModal();
    }
}
