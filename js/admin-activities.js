// 목록 데이터 초기화
let activityList = [
    { activity: '활동1', intensity: '1' },
    { activity: '활동2', intensity: '2' },
    { activity: '활동3', intensity: '3' },
    { activity: '활동4', intensity: '4' },
    { activity: '활동5', intensity: '5' },
    { activity: '활동6', intensity: '6' },
    { activity: '활동7', intensity: '7' },
    { activity: '활동8', intensity: '8' },
    { activity: '활동9', intensity: '9' },
    { activity: '활동10', intensity: '10' },
    { activity: '활동11', intensity: '11' },
];

// 목록을 화면에 렌더링
function renderActivityList(activities) {
    const activityListBody = document.getElementById('activity-list-body');
    activityListBody.innerHTML = ''; // 기존 내용 초기화

    activities.forEach((activity, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><input type="checkbox" class="edit-checkbox" data-index="${index}"></td>
        <td class="edit-number">${index + 1}</td>
        <td><input type="text" value="${activity.activity}" class="edit-input-activity"></td>
        <td><input type="text" value="${activity.intensity}" class="edit-input-intensity"></td>
        `;
        activityListBody.appendChild(row);
    });
}

// 데이터 저장 기능
function saveActivityData() {
    const editActivities = document.querySelectorAll('.edit-input-activity');
    const editIntensities = document.querySelectorAll('.edit-input-intensity');

    // 기존 데이터를 유지하면서 새로운 데이터를 저장
    activityList = Array.from(activityList).map((activity, index) => {
        return {
            activity: editActivities[index] ? editActivities[index].value : activity.activity,
            intensity: editIntensities[index] ? editIntensities[index].value : activity.intensity
        };
    });

    alert('저장되었습니다.');
    renderActivityList(activityList); // 변경된 내용을 다시 렌더링
}

// 추가 기능
function addActivity() {
    const activity = prompt('활동명을 입력해주세요.');
    const intensity = prompt('강도를 입력해주세요.');

    if (activity && intensity) {
        activityList.push({ activity, intensity });
        renderActivityList(activityList);
    } else {
        alert('모든 정보를 입력해주세요.');
    }
}

// 삭제 기능
function deleteActivity() {
    const checkboxes = document.querySelectorAll('.edit-checkbox');
    const selectedIndexes = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedIndexes.push(index);
        }
    });

    // 인덱스를 역순으로 삭제
    for (let i = selectedIndexes.length - 1; i >= 0; i--) {
        activityList.splice(selectedIndexes[i], 1);
    }

    renderActivityList(activityList);  // 삭제 후 업데이트
}

// 검색 기능
function searchActivity() {
    const searchCategory = document.getElementById('search-category').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    const filteredActivities = activityList.filter(activity => {
        if (searchCategory === '활동') {
            return activity.activity.toLowerCase().includes(searchInput);
        } else if (searchCategory === '강도') {
            return activity.intensity.toLowerCase().includes(searchInput);
        }
    });

    renderActivityList(filteredActivities);
}

// 페이지 로드 시 초기 목록 출력
window.addEventListener('DOMContentLoaded', () => {
    renderActivityList(activityList);

    // 추가
    document.getElementById('add-activity').addEventListener('click', addActivity);

    // 삭제
    document.getElementById('delete-activity').addEventListener('click', deleteActivity);

    // 저장
    document.getElementById('save-activity').addEventListener('click', saveActivityData);

    // 검색
    document.getElementById('search-button').addEventListener('click', searchActivity);
});