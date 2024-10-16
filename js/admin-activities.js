let activityList = [];
let currentPage = 1;
const activitiesPerPage = 20;

async function loadActivityData() {
    const storedActivityList = localStorage.getItem('activities');

    if (storedActivityList) {
        activityList = JSON.parse(storedActivityList);
        renderActivityList(activityList);
    } else {
        const response = await fetch('../resources/temp-db/activity.json');
        activityList = await response.json();
        localStorage.setItem('activities', JSON.stringify(activityList));
        renderActivityList(activityList);
    }
}

function renderActivityList(activities) {
    const activityListBody = document.getElementById('activity-list-body');
    activityListBody.innerHTML = '';

    const startIndex = (currentPage - 1) * activitiesPerPage;
    const endIndex = Math.min(startIndex + activitiesPerPage, activities.length);
    const paginatedActivities = activities.slice(startIndex, endIndex);

    paginatedActivities.forEach((activity, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" id="${startIndex + index}" class="edit-check-box" data-index="${startIndex + index}"><label for="${startIndex + index}"></label></td>
            <td class="edit-number">${startIndex + index + 1}</td>
            <td><input type="text" value="${activity.activity}" class="edit-input-activity"></td>
            <td><input type="text" value="${activity.intensity}" class="edit-input-intensity"></td>
        `;
        activityListBody.appendChild(row);
    });

    if (paginatedActivities.length < activitiesPerPage) {
        for (let i = 0; i < activitiesPerPage - paginatedActivities.length; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td></td>
                <td class="edit-number"></td>
                <td></td>
                <td></td>
            `;
            activityListBody.appendChild(row);
        }
    }

    updateDeleteButtonState();
    createPagination(activities.length);
}

const createPagination = (totalActivities) => {
    const pageCount = Math.ceil(totalActivities / activitiesPerPage);
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = '';

    const pageButton = [];
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement("a");
        button.className = "pagination-button";
        if (i === currentPage) button.classList.add("active");
        button.innerHTML = i;
        button.onclick = () => {
            currentPage = i;
            renderActivityList(activityList);
        };
        pageButton.push(button);
    }

    paginationContainer.replaceChildren(...pageButton);
}

const arrow = (direction) => {
    let next = (direction) ? currentPage + 1 : currentPage - 1;
    next = (next > Math.ceil(activityList.length / activitiesPerPage)) ? Math.ceil(activityList.length / activitiesPerPage) : (next <= 0) ? 1 : next;
    currentPage = next;
    renderActivityList(activityList);
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

    localStorage.setItem('activities', JSON.stringify(activityList));

    alert('저장되었습니다.');
    renderActivityList(activityList);
}

function addActivity() {
    const activity = prompt('활동명을 입력해주세요.');
    if (activity === null) return;

    const intensity = prompt('강도를 입력해주세요.');
    if (intensity === null) return;

    if (activity && intensity) {
        activityList.push({ activity, intensity });
        localStorage.setItem('activities', JSON.stringify(activityList));
        renderActivityList(activityList);
        alert('활동이 추가되었습니다.');
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

    if (selectedIndexes.length === 0) {
        alert('삭제할 활동을 선택해주세요.');
        return;
    }

    const confirmation = confirm('정말로 삭제하시겠습니까?');

    if (!confirmation) {
        return;
    }

    const selectedActivities = selectedIndexes.map(index => (currentPage - 1) * activitiesPerPage + index);

    for (let i = selectedActivities.length - 1; i >= 0; i--) {
        activityList.splice(selectedActivities[i], 1);
    }

    localStorage.setItem('activities', JSON.stringify(activityList));

    if (activityList.length <= (currentPage - 1) * activitiesPerPage) {
        currentPage = Math.max(1, currentPage - 1);
    }

    renderActivityList(activityList);
    alert('선택된 활동이 삭제되었습니다.');
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
        return false;
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
    loadActivityData();

    document.getElementById('add-activity').addEventListener('click', addActivity);
    document.getElementById('delete-activity').addEventListener('click', deleteActivity);
    document.getElementById('save-activity').addEventListener('click', saveActivityData);
    document.getElementById('search-button').addEventListener('click', searchActivity);

    document.getElementById('activity-list-body').addEventListener('change', updateDeleteButtonState);

    document.getElementById('pagination-left').addEventListener('click', () => arrow(false));
    document.getElementById('pagination-right').addEventListener('click', () => arrow(true));
});

// localStorage.clear();