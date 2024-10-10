let selectedIntensity = 0; // 전역 변수로 강도 저장

// 모달 열기
function addRow() {
    document.getElementById("actModal").style.display = "block";
    renderTable(); // 테이블 렌더링 함수 호출   
    updatePagination();  // 페이지 번호 업데이트 함수 호출
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
    const previousSelected = document.querySelector('#actTbody tr.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    // 새로 선택된 활동에 선택 효과 추가
    element.classList.add('selected');

    // 선택된 활동과 강도 업데이트
    document.getElementById('selectedActivity').textContent = activity;
    // document.getElementById('selectedIntensity').value = intensity;
}

// 활동 저장 및 테이블에 추가
// 활동 메인 테이블에 추가
function saveActivity() {
    const activity = document.getElementById('selectedActivity').textContent;
    const hours = document.getElementById('hours').value;
    if (activity === "선택하세요") {
        alert("활동을 선택하세요.");
        return;
    }

    // 메인 테이블에 새 행 추가
    const tbody = document.getElementById('act-tbody');
    let emptyRow = Array.from(tbody.children).find(row => row.children[0].textContent === "");
    const newRow = emptyRow || document.createElement('tr');
    // const newRow = document.createElement('tr');

    // 새로운 셀 생성
    const activityCell = document.createElement('td');
    activityCell.textContent = activity;

    const hoursCell = document.createElement('td');
    hoursCell.textContent = hours;

    const intensityCell = document.createElement('td');
    intensityCell.textContent = `${(selectedIntensity * hours).toFixed(2)} `; // 활동량 계산

    // 셀을 행에 추가
    newRow.innerHTML = '';
    newRow.appendChild(activityCell);
    newRow.appendChild(hoursCell);
    newRow.appendChild(intensityCell);

    // 행을 테이블에 추가
    // tbody.appendChild(newRow);
    if (!emptyRow) {
        tbody.appendChild(newRow);
    }

    // 모달 닫기
    closeModal();

    alert(`활동: ${activity}, 시간: ${hours} hours 저장되었습니다.`);
}

// 모달창 pagination
const actData = [
    { name: "걷기", intensity: 3.5},   // 30분
    { name: "달리기", intensity: 9.0}, // 45분
    { name: "수영", intensity: 6.0},   // 60분
    { name: "요가", intensity: 2.5},   // 40분
    { name: "자전거 타기", intensity: 7.5}, // 50분
    { name: "등산", intensity: 8.0},   // 70분
    { name: "스쿼트", intensity: 5.0},  // 20분
    { name: "술먹기", intensity: 5.0},
    { name: "놀기", intensity: 5.0},
    { name: "공부하기", intensity: 5.0},
];

let currentPage = 1; // 현재 페이지 초기값
const rowsPerPage = 7; // 페이지당 표시할 행 수

// 페이지 변경 함수
function changePage(page) { 
    const totalPages = Math.ceil(actData.length / rowsPerPage); // 총 페이지 수 계산
    // 페이지가 'prev'인 경우: 이전 페이지로 이동
    if (page === 'prev') {
        currentPage = Math.max(1, currentPage - 1); // 페이지 번호 최소 1
    } 
    // 페이지가 'next'인 경우: 다음 페이지로 이동
    else if (page === 'next') {
        currentPage = Math.min(totalPages, currentPage + 1); // 최대 페이지 수를 초과하지 않도록
    } 
    // 특정 페이지로 이동하는 경우
    else {
        currentPage = page; // 페이지 번호 업데이트
    }

    renderTable(); // 테이블 렌더링
    updatePagination(); // 페이지 번호 업데이트
}

// 테이블 렌더링 함수
function renderTable() {
    const actTbody = document.getElementById("actTbody");
    actTbody.innerHTML = ""; // 테이블 내용 초기화

    // 현재 페이지에 맞는 데이터의 시작과 끝 인덱스 계산
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = actData.slice(start, end); // 현재 페이지의 데이터만 추출

    // 추출한 데이터로 테이블 행 생성
    paginatedData.forEach(item => {
        const row = `
            <tr onclick="selectActivity('${item.name}', ${item.intensity}, this)">
                <td>${item.name}</td>
                <td>${item.intensity}</td>
            </tr>
        `;
        actTbody.innerHTML += row; // 행 추가
    });
}

// 페이지 번호 업데이트 함수
function updatePagination() {
    const pageNumbersContainer = document.getElementById("modalPageNumber");
    pageNumbersContainer.innerHTML = ""; // 페이지 번호 초기화

    const totalPages = Math.ceil(actData.length / rowsPerPage); // 총 페이지 수 계산
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.className = "page-number";
        button.textContent = i; // 페이지 번호 설정
        button.onclick = () => changePage(i); // 버튼 클릭 시 해당 페이지로 이동

        // 현재 페이지 버튼 비활성화
        if (i === currentPage) {
            button.disabled = true; // 현재 페이지 버튼 비활성화
        }
        pageNumbersContainer.appendChild(button); // 페이지 번호 버튼 추가
    }
}

// 이전, 다음 버튼도 업데이트
const prevButton = document.getElementById("pagePrev");
const nextButton = document.getElementById("pageNext");

prevButton.disabled = (currentPage === 1); // 첫 페이지면 이전 버튼 비활성화
nextButton.disabled = (currentPage === totalPages); // 마지막 페이지면 다음 버튼 비활성화

// let link = document.getElementsByClassName("link");

// let currentValue = 1;
// function activeLink(){
//     for(l of link){
//         l.classList.remove("active");
//     }
//     event.target.classList.add("active");
//     currentValue = event.target.value;
// }

// function backBtn() {
//     if(currentValue > 1){
//         for(l of link){
//             l.classList.remove("active");
//         }

//         currentValue--;
//         link[currentValue-1].classList.add("active");
//     }
// }

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

    const tableBody = document.getElementById('actTbody');
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