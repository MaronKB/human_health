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

function renderActivityList(activities) {
    const activityListBody = document.getElementById('activity-list-body');
    activityListBody.innerHTML = '';

    activities.forEach((activity, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><input type="checkbox" class="edit-check-box" data-index="${index}"></td>
        <td class="edit-number">${index + 1}</td>
        <td><input type="text" value="${activity.activity}" class="edit-input-activity"></td>
        <td><input type="text" value="${activity.intensity}" class="edit-input-intensity"></td>
        `;
        activityListBody.appendChild(row);
    });

    updateDeleteButtonState();
}

function saveActivityData() {
    const editActivities = document.querySelectorAll('.edit-input-activity');
    const editIntensities = document.querySelectorAll('.edit-input-intensity');

    activityList = Array.from(activityList).map((activity, index) => {
        return {
            activity: editActivities[index] ? editActivities[index].value : activity.activity,
            intensity: editIntensities[index] ? editIntensities[index].value : activity.intensity
        };
    });

    alert('저장되었습니다.');
    renderActivityList(activityList);
}

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

function deleteActivity() {
    const checkboxes = document.querySelectorAll('.edit-check-box');
    const selectedIndexes = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedIndexes.push(index);
        }
    });

    for (let i = selectedIndexes.length - 1; i >= 0; i--) {
        activityList.splice(selectedIndexes[i], 1);
    }

    renderActivityList(activityList);
}

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

function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll('.edit-check-box');
    const deleteButton = document.getElementById('delete-activity');

    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    deleteButton.disabled = !anyChecked;
}

window.addEventListener('DOMContentLoaded', () => {
    renderActivityList(activityList);

    document.getElementById('add-activity').addEventListener('click', addActivity);
    document.getElementById('delete-activity').addEventListener('click', deleteActivity);
    document.getElementById('save-activity').addEventListener('click', saveActivityData);
    document.getElementById('search-button').addEventListener('click', searchActivity);

    document.getElementById('activity-list-body').addEventListener('change', updateDeleteButtonState);
});