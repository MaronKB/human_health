let selectedIntensity = 0; // 전역 변수로 강도 저장

// 템플릿 데이터 정의
const templates = {
    "일반 평일 활동": [
        { activity: "출근", duration: 8, intensity: 1.5 },
        { activity: "운동", duration: 1, intensity: 5 },
        { activity: "독서", duration: 1, intensity: 1.2 }
    ],
    "일반 휴일 활동": [
        { activity: "산책", duration: 2, intensity: 2 },
        { activity: "영화 보기", duration: 3, intensity: 1.3 },
        { activity: "가사일", duration: 2, intensity: 3 }
    ],
    "일반 학업 활동": [
        { activity: "강의 듣기", duration: 4, intensity: 1.5 },
        { activity: "스터디", duration: 3, intensity: 2 },
        { activity: "도서관 공부", duration: 2, intensity: 1.8 }
    ],
    "집에만 있는 날": [
        { activity: "TV 시청", duration: 4, intensity: 1.2 },
        { activity: "요리", duration: 2, intensity: 2.5 },
        { activity: "휴식", duration: 3, intensity: 1 }
    ]
};

// 템플릿을 테이블에 적용
function applyTemplate(templateName) {
    const tbody = document.getElementById("act-tbody");
    const templateActivities = templates[templateName];

    // 테이블 초기화 (기존 항목 삭제)
    tbody.innerHTML = "";

    // 템플릿 항목 추가
    templateActivities.forEach(activity => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${activity.activity}</td>
            <td>${activity.duration}</td>
            <td>${activity.intensity}</td>
        `;
        tbody.appendChild(row);
    });
}

// 템플릿 항목을 편집하는 함수
function editTemplate(templateName) {
    console.log(`Edit button clicked for: ${templateName}`); // 클릭 이벤트 확인용 로그

    // 템플릿 항목 찾기
    const templateElement = document.querySelector(`.template-item span`);
    if (templateElement.textContent === templateName) {
        // contenteditable 속성 추가
        templateElement.setAttribute("contenteditable", "true");
        templateElement.focus(); // 요소에 포커스 맞추기

        // 스타일 추가 (밑줄 표시)
        templateElement.style.borderBottom = "1px dashed #28a745";

        // 수정 완료를 위한 엔터 키 이벤트 추가
        templateElement.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // 엔터 입력 시 줄 바꿈 방지
                templateElement.setAttribute("contenteditable", "false");
                templateElement.style.borderBottom = "none";

                // 수정된 텍스트 반영
                const newTemplateName = templateElement.textContent.trim();
                if (newTemplateName !== "" && newTemplateName !== templateName) {
                    // templates 객체의 키도 업데이트
                    if (templates[templateName]) {
                        templates[newTemplateName] = templates[templateName];
                        delete templates[templateName];
                    }
                }
            }
        });

        // 수정 도중 focusout 이벤트 발생 시에도 수정 완료 처리
        templateElement.addEventListener("blur", function () {
            templateElement.setAttribute("contenteditable", "false");
            templateElement.style.borderBottom = "none";
        });
    }
}



// 템플릿 항목을 삭제
function deleteTemplate(event, templateName) {
    event.stopPropagation(); // 삭제 버튼 클릭 시 템플릿 적용 방지

    // 삭제 확인 메시지
    const confirmed = confirm(`정말 "${templateName}" 템플릿을 삭제하시겠습니까?`);
    if (confirmed) {
        const templateElement = event.target.closest(".template-item");
        templateElement.remove();

        // templates 객체에서 삭제 
        if (templates[templateName]) {
            delete templates[templateName];
        }
    }
}




// 현재 목록 템플릿 리스트에 저장
function saveTemplate() {
    const tbody = document.getElementById('act-tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // 현재 활동 리스트가 비어있으면 저장X
    if (rows.length === 0 || rows.every(row => row.children[0].textContent === "")) {
        alert("저장할 활동이 없습니다.");
        return;
    }

    // 템플릿 이름 입력
    const templateName = prompt("저장할 이름을 입력해주세요:");
    if (!templateName || templateName.trim() === "") {
        alert("템플릿 이름은 필수입니다.");
        return;
    }

    // 활동 리스트 데이터 수집
    const activities = rows.map(row => {
        return {
            activity: row.children[0].textContent,
            duration: row.children[1].textContent,
            intensity: row.children[2].textContent,
        };
    });

    // 템플릿 저장 (templates 객체에 추가)
    templates[templateName] = activities;

    // 리스트에 새로운 템플릿 추가
    addTemplateToSidebar(templateName);

    alert("리스트에 저장되었습니다!");
}

// 리스트에 템플릿을 추가하는 함수
function addTemplateToSidebar(templateName) {
    const sidebar = document.querySelector('.saved-templates');

    // 새로운 템플릿 요소 생성
    const templateItem = document.createElement('div');
    templateItem.className = 'template-item';
    templateItem.setAttribute('onclick', `applyTemplate('${templateName}')`);

    const templateNameSpan = document.createElement('span');
    templateNameSpan.textContent = templateName;

    // 템플릿 편집 및 삭제 버튼 추가?
    const templateActions = document.createElement('div');
    templateActions.className = 'template-actions';

    const editButton = document.createElement('button');
    editButton.className = 'template-edit-btn';
    editButton.setAttribute('onclick', `editTemplate('${templateName}')`);
    editButton.innerHTML = `
        <span class="material-symbols-outlined" style="color: #ffffff;">
            stylus
        </span>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'template-delete-btn';
    deleteButton.setAttribute('onclick', `deleteTemplate(event, '${templateName}')`);
    deleteButton.innerHTML = `
        <span class="material-symbols-outlined" style="color: #ffffff;">
            delete
        </span>
    `;

    // 버튼 액션 컨테이너 추가
    templateActions.appendChild(editButton);
    templateActions.appendChild(deleteButton);

    // 템플릿 요소에 이름과 액션 추가
    templateItem.appendChild(templateNameSpan);
    templateItem.appendChild(templateActions);

    // 사이드바에 추가
    sidebar.appendChild(templateItem);
}

// 총 활동 시간 업데이트
function updateTotalActivityHours() {
    const tbody = document.getElementById('act-tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    let totalHours = 0;

    // 각 행 시간 합산
    rows.forEach(row => {
        const hours = parseFloat(row.children[1].textContent);
        if (!isNaN(hours)) {
            totalHours += hours;
        }
    });

    // 총 활동 시간 요소 업데이트
    const totalHoursElement = document.querySelector('.act-hours-value');
    totalHoursElement.textContent = totalHours.toFixed(2);

    // 24시간까지 남은 시간 계산 및 표시
    const remainingHours = 24 - totalHours;
    const remainingElement = document.querySelector('.act-hours-alert h6');
    
    if (remainingHours > 0) {
        remainingElement.textContent = `(${remainingHours.toFixed(2)} 시간 부족)`;
        remainingElement.style.color = 'red';
    } else {
        remainingElement.textContent = '';
    }
}


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
    const hoursInput = document.getElementById('hours');
    const hours = parseFloat(hoursInput.value);

    if (activity === "선택하세요" || isNaN(hours) || hours <=0) {
        alert('활동을 선택하고, 시간을 정확히 입력해주세요.');
        return;
    }

    // 현재 활동 시간 계산하여 24시간 초과 확인
    const currentTotalHours = parseFloat(document.querySelector('.act-hours-value').textContent);
    if (currentTotalHours + hours > 24) {
        alert('총 활동 시간이 24시간을 초과할 수 없습니다.');
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

    alert(`${activity}, ${hours}시간이 저장되었습니다.`);
    //시간 초기화
    hoursInput.value = '';
    //총 시간 업데이트 
    updateTotalActivityHours();
}

// 모달창 pagination
const actData = [
    { name: "잠자기", intensity: 0.93},
    { name: "누워있기", intensity: 1.2},
    { name: "읽기", intensity: 1.3},
    { name: "앉아서 TV", intensity: 1.57},
    { name: "사무업무", intensity: 1.6},
    { name: "대중교통(앉음)", intensity: 1.72},
    { name: "대중교통(서서)", intensity: 2},
    { name: "식사", intensity: 1.4},
    { name: "서서 돌아다니는 업무", intensity: 2.5},
    { name: "주방일", intensity: 2.7},
    { name: "느리게 걷기", intensity: 2.8},
    { name: "집안일", intensity: 3.1},
    { name: "빠르게 걷기", intensity: 3.8},
    { name: "유산소(약)", intensity: 4.5},
    { name: "유산소(중)", intensity: 6},
    { name: "유산소(강)", intensity: 9},
    { name: "근력운동(약)", intensity: 3},
    { name: "근력운동(중)", intensity: 4.5},
    { name: "근력운동(강)", intensity: 6},
    { name: "운동1", intensity: 4.4},
    { name: "운동2", intensity: 2.5},
    { name: "운동3", intensity: 2.2},
    { name: "운동4", intensity: 2},
    { name: "운동5", intensity: 1.9},
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

    if (page === 'prev' && currentPage > 1) {
        currentPage--; // 이전 페이지로 이동
    } else if (page === 'next' && currentPage < totalPages) {
        currentPage++; // 다음 페이지로 이동
    } else if (typeof page === 'number' && page >= 1 && page <= totalPages) {
        currentPage = page; // 특정 페이지로 이동
    }

    renderTable(); // 테이블 렌더링
    updatePagination(); // 페이지 번호 및 버튼상태 업데이트
    
    // 페이지가 'prev'인 경우: 이전 페이지로 이동
    // if (page === 'prev') {
    //     currentPage = Math.max(1, currentPage - 1); // 페이지 번호 최소 1
    // } 
    // 페이지가 'next'인 경우: 다음 페이지로 이동
    // else if (page === 'next') {
    //     currentPage = Math.min(totalPages, currentPage + 1); // 최대 페이지 수를 초과하지 않도록
    // } 
    // // 특정 페이지로 이동하는 경우
    // else {
    //     currentPage = page; // 페이지 번호 업데이트
    // }


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

prevButton.disabled = (currentPage === 1) ? false : false; // 첫 페이지면 이전 버튼 비활성화
nextButton.disabled = (currentPage === totalPages) ? false :

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

    if (activityName === '' || activityIntensity === ''|| isNaN(activityIntensity) || parseFloat(activityIntensity) <= 0) {
        alert('활동 이름과 강도를 정확히 입력해주세요.');
        return;
    }

    // 새로운 데이터를 actData 배열에 추가 (배열 맽 끝에)
    actData.push({ name: activityName, intensity: activityIntensity });

    // 데이터를 localStorage에 저장
    // saveActData();

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

    // 새 데이터를 추가한 후 마지막 페이지로 이동
    currentPage = Math.ceil(actData.length / rowsPerPage);
    renderTable(); // 테이블 랜더링
    updatePagination(); // 페이지 번호 업데이트

    alert('활동이 추가되었습니다.');
}