document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postNumber = urlParams.get('postNumber');

    if (postNumber) {
        loadCommunityItem(postNumber);
    }

    document.getElementById('edit-button').addEventListener('click', () => {
        window.location.href = `./community-write.html?postNumber=${postNumber}`;
    });

    document.getElementById('delete-button').addEventListener('click', () => {
        if (confirm("정말로 삭제하시겠습니까?")) {
            deleteCommunityItem(postNumber);
        }
    });
});

const loadCommunityItem = (postNumber) => {
    const localData = JSON.parse(localStorage.getItem('communityList')) || [];
    let communityItem = localData.find(item => item.com_post_number === parseInt(postNumber));

    if (communityItem) {
        communityItem.com_view_count = (communityItem.com_view_count || 0) + 1;
        displayCommunityItem(communityItem);

        const updatedLocalData = localData.map(item =>
            item.com_post_number === parseInt(postNumber) ? communityItem : item
        );
        localStorage.setItem('communityList', JSON.stringify(updatedLocalData));
    } else {
        fetch('../resources/temp-db/community.json')
            .then(res => res.json())
            .then(jsonData => {
                communityItem = jsonData.find(item => item.com_post_number === parseInt(postNumber));

                if (communityItem) {
                    communityItem.com_view_count = 1;
                    displayCommunityItem(communityItem);

                    localData.push(communityItem);
                    localStorage.setItem('communityList', JSON.stringify(localData));
                } else {
                    alert('해당 커뮤니티 항목을 찾을 수 없습니다.');
                    window.location.href = './community.html';
                }
            });
    }
};

const displayCommunityItem = (communityItem) => {
    document.getElementById('community-title').innerHTML = communityItem.com_title;
    document.getElementById('community-content').innerText = communityItem.com_content;
    document.getElementById('community-date').innerText = communityItem.com_post_date;
    document.getElementById('community-nickname').innerText = communityItem.usr_nickname;
    document.getElementById('community-view-count').innerText = communityItem.com_view_count;

    if (communityItem.com_image_path) {
        const imageElement = document.createElement('img');
        imageElement.src = communityItem.com_image_path;
        imageElement.alt = communityItem.com_image_name;
        imageElement.style.width = 'auto';
        imageElement.style.maxHeight = '300px';
        document.querySelector('.community-view-content').appendChild(imageElement);
    }

    if (communityItem.com_video_path) {
        const videoElement = document.createElement('video');
        videoElement.src = communityItem.com_video_path;
        videoElement.controls = true;
        videoElement.style.maxWidth = '50%';
        document.querySelector('.community-view-content').appendChild(videoElement);
    }
};

const deleteCommunityItem = (postNumber) => {
    let data = JSON.parse(localStorage.getItem('communityList')) || [];
    data = data.filter(item => item.com_post_number !== parseInt(postNumber));
    localStorage.setItem('communityList', JSON.stringify(data));
    alert('글이 삭제되었습니다.');
    window.location.href = './community.html';
};