

let selectedIntensity = 0; // 전역 변수로 강도 저장

// 모달 열기
function addRow() {
    document.getElementById("actModal").style.display = "block";
}

// 모달 닫기
function closeModal() {
    document.getElementById("actModal").style.display = "none";
}

// 모달 외부에서 닫기
window.onclick = function(event) {
    const modal = document.getElementById("actModal");
    if (event.target === modal) {
        closeModal();
    }
}

// 활동 선택
function selectActivity(activity, intensity, element) {
    selectedIntensity = intensity; // 강도 저장

    // 기존 선택된 활동의 선택 효과 제거
    const previousSelected = document.querySelector('#act-tbody2 tr.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    // 새로 선택된 활동에 선택 효과 추가
    element.classList.add('selected');

    // 선택된 활동과 강도 업데이트
    document.getElementById('selectedActivity').textContent = activity;
    document.getElementById('selectedIntensity').value = intensity;
}

// 활동 저장 및 테이블에 추가
function saveActivity() {
    const activity = document.getElementById('selectedActivity').textContent;
    const hours = document.getElementById('hours').value;
    if (activity === "선택하세요") {
        alert("활동을 선택하세요.");
        return;
    }

    // 메인 테이블에 새 행 추가
    const tbody = document.getElementById('act-tbody');
    const newRow = document.createElement('tr');

    // 새로운 셀 생성
    const activityCell = document.createElement('td');
    activityCell.textContent = activity;

    const hoursCell = document.createElement('td');
    hoursCell.textContent = hours;

    const intensityCell = document.createElement('td');
    intensityCell.textContent = `${(selectedIntensity * hours).toFixed(2)} `; // 활동량 계산

    // 셀을 행에 추가
    newRow.appendChild(activityCell);
    newRow.appendChild(hoursCell);
    newRow.appendChild(intensityCell);

    // 행을 테이블에 추가
    tbody.appendChild(newRow);

    // 모달 닫기
    closeModal();

    alert(`활동: ${activity}, 시간: ${hours} hours 저장되었습니다.`);
}

// 모달창 pagination
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

//사용자 입력을 통해 활동을 추가하는 함수
function addCustomActivity() {
    const activityName = document.getElementById('newActivity').value;
    const activityIntensity = document.getElementById('newIntensity').value;

    if (activityName === '' || activityIntensity === '') {
        alert('활동 이름과 강도를 모두 입력하세요.');
        return;
    }

    const tableBody = document.getElementById('act-tbody2');
    const newRow = document.createElement('tr');
    newRow.setAttribute('onclick', `selectActivity('${activityName}', ${activityIntensity}, this)`);

    const activityCell = document.createElement('td');
    activityCell.textContent = activityName;

    const intensityCell = document.createElement('td');
    intensityCell.textContent = activityIntensity;

    newRow.appendChild(activityCell);
    newRow.appendChild(intensityCell);
    tableBody.appendChild(newRow);

    // 입력 필드 초기화
    document.getElementById('newActivity').value = '';
    document.getElementById('newIntensity').value = '';

    alert('활동이 추가되었습니다.');
}