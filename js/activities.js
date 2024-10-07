function addRow() {
    // 모달 열기
    document.getElementById("actModal").style.display = "block";
}

function closeModal() {
    document.getElementById("actModal").style.display = "none";
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
    const modal = document.getElementById("actModal");
    if (event.target === modal) {
        closeModal();
    }
}

function selectActivity(activity, intensity) {
    document.getElementById('selectedActivity').textContent = activity;
}

function saveActivity() {
    const activity = document.getElementById('selectedActivity').textContent;
    const hours = document.getElementById('hours').value;
    if (activity === "선택하세요") {
        alert("활동을 선택하세요.");
        return;
    }
    alert(`활동: ${activity}, 시간: ${hours} hours 저장되었습니다.`);
}

let link = document.getElementsByClassName("link");

let currentValue = 1;
function activeLink(){
    for(l of link){
        l.classList.remove("active");
    }
    event.target.classList.add("active");
    currentValue = event.target.value;
}

function backBtn() {
    if(currentValue > 1){
        for(l of link){
            l.classList.remove("active");
        }

        currentValue--;
        link[currentValue-1].classList.add("active");
    }
}

function nextBtn() {
    if(currentValue < 6){
        for(l of link){
            l.classList.remove("active");
        }

        currentValue++;
        link[currentValue-1].classList.add("active");
    }
}