// 활동 데이터 (시간 포함)
const activityData = [
    { name: "걷기", intensity: 3.5, duration: 30 },   // 30분
    { name: "달리기", intensity: 9.0, duration: 45 }, // 45분
    { name: "수영", intensity: 6.0, duration: 60 },   // 60분
    { name: "요가", intensity: 2.5, duration: 40 },   // 40분
    { name: "자전거 타기", intensity: 7.5, duration: 50 }, // 50분
    { name: "등산", intensity: 8.0, duration: 70 },   // 70분
    { name: "스쿼트", intensity: 5.0, duration: 20 },  // 20분
];

// 활동 추가 버튼 클릭 시 모달 열기
function addRow() {
    document.getElementById("activityModal").style.display = "block";
}

// 모달 닫기
function closeModal() {
    const modal = document.getElementById("activityModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// 활동 저장
function saveActivity() {
    const activityName = document.getElementById('selectedActivity').textContent;
    const activityDuration = document.getElementById('activityDuration').value;

    if (activityName === '선택하세요' || activityDuration === '') {
        alert('모든 항목을 입력하세요!');
        return;
    }

    // 선택한 활동의 강도 가져오기
    const activityItem = activityData.find(item => item.name === activityName);
    const intensity = activityItem.intensity;
    const calories = ((intensity * activityDuration) / 60).toFixed(2); // 소모 칼로리 계산 (시간에 따른 비율로)

    // 활동 데이터를 객체로 저장
    const activityItemData = {
        name: activityName,
        duration: activityDuration,
        intensity: intensity,
        calories: calories
    };

    // 테이블에 새 항목 추가
    addActivityToTable(activityItemData);

    // 입력 필드 초기화
    document.getElementById('activityDuration').value = '';
    closeModal(); // 모달 닫기
}

// 활동을 테이블에 추가하는 함수
function addActivityToTable(activityData) {
    const activityTbody = document.getElementById('activityTbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${activityData.name}</td>
        <td>${activityData.intensity} MET</td>
        <td>${activityData.duration} 분</td>
        <td>${activityData.calories} kcal</td>
    `;

    activityTbody.appendChild(newRow);
}

// 활동 선택
function selectActivity(activityName, intensity, element) {
    document.getElementById('selectedActivity').innerText = activityName;
    document.getElementById('activityDuration').value = 30; // 기본 시간 설정

    // 활동 정보 업데이트
    document.getElementById('activityInfo').innerHTML = `
        <strong>활동: ${activityName}</strong> 
        <br><strong>강도:</strong><span id="intensity">${intensity}</span> MET
        <br><strong>시간:</strong> <input type="number" id="activityDuration" value="30" min="1"> 분
    `;
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById("activityModal");
    if (event.target === modal) {
        closeModal();
    }
}

// 페이지네이션 관련 기능
let currentPage = 1;
const rowsPerPage = 5;

function changePage(page) {
    if (page === 'prev') {
        currentPage = Math.max(1, currentPage - 1);
    } else if (page === 'next') {
        currentPage = Math.min(Math.ceil(activityData.length / rowsPerPage), currentPage + 1);
    } else {
        currentPage = page;
    }

    renderTable();
    updatePagination();
}

function renderTable(data = activityData) {
    const activityTbody = document.getElementById("activityTbody");
    activityTbody.innerHTML = ""; // 테이블 내용 초기화

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end); // 현재 페이지의 데이터만 추출

    paginatedData.forEach(item => {
        const row = `
            <tr onclick="selectActivity('${item.name}', ${item.intensity}, this)">
                <td>${item.name}</td>
                <td>${item.intensity}</td>
                <td>${item.duration}분</td>
            </tr>
        `;
        activityTbody.innerHTML += row; // 행 추가
    });
}

function updatePagination(data = activityData) {
    const pageNumbersContainer = document.getElementById("page-numbers");
    pageNumbersContainer.innerHTML = ""; // 페이지 번호 초기화

    const totalPages = Math.ceil(data.length / rowsPerPage);
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

// 검색창 키워드 필터링 구현
function filterTable() {
    const searchTerm = document.getElementById('search-activity').value.toLowerCase();
    const filteredData = activityData.filter(item => item.name.toLowerCase().includes(searchTerm));
    currentPage = 1; // 페이지를 처음으로 되돌리기
    renderTable(filteredData);
    updatePagination(filteredData);
}

// 사용자가 직접 입력하여 모달 테이블에 데이터 추가
function addActivity() {
    const activityName = document.getElementById('newActivityName').value.trim();
    const intensity = parseFloat(document.getElementById('newActivityIntensity').value);
    const duration = parseInt(document.getElementById('newActivityDuration').value);

    // 유효성 검사
    if (!activityName || isNaN(intensity) || isNaN(duration)) {
        alert('모든 필드를 올바르게 입력하세요.');
        return;
    }

    // 새로운 활동 데이터 객체 생성
    const newActivity = { name: activityName, intensity: intensity, duration: duration };
    activityData.push(newActivity); // activityData 배열에 추가

    // 테이블 업데이트
    renderTable();
    updatePagination(); // 페이지 업데이트

    // 입력 필드 초기화
    document.getElementById('newActivityName').value = '';
    document.getElementById('newActivityIntensity').value = '';
    document.getElementById('newActivityDuration').value = '';
}

// 페이지 로드 시 테이블과 페이지네이션 렌더링
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
    updatePagination();
});
