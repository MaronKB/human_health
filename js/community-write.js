document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postNumber = urlParams.get('postNumber');

    if (postNumber) {
        loadCommunityItem(postNumber);
    }

    document.getElementById('community-submit').addEventListener('click', () => {
        if (postNumber) {
            updateCommunityItem(postNumber);
        } else {
            addCommunityItem();
        }
    });

    document.getElementById('image-upload').addEventListener('change', handleImageUpload);
    document.getElementById('video-upload').addEventListener('change', handleVideoUpload);
});

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('image-preview');
    previewContainer.innerHTML = '';

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.alt = file.name;
            imgElement.style.maxWidth = '100%';
            imgElement.style.height = 'auto';
            previewContainer.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    }
};

const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    const videoPreviewContainer = document.getElementById('video-preview');
    videoPreviewContainer.innerHTML = '';

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const videoElement = document.createElement('video');
            videoElement.src = e.target.result;
            videoElement.controls = true;
            videoElement.style.maxWidth = '100%';
            videoElement.style.height = 'auto';
            videoPreviewContainer.appendChild(videoElement);
        };
        reader.readAsDataURL(file);
    }
};

const loadCommunityItem = (postNumber) => {
    const data = JSON.parse(localStorage.getItem('communityList')) || [];
    const communityItem = data.find(item => item.com_post_number === parseInt(postNumber));

    if (communityItem) {
        document.getElementById('community-title').value = communityItem.com_title;
        document.getElementById('community-content').value = communityItem.com_content;

        document.getElementById('image-upload').value = '';
        document.getElementById('video-upload').value = '';

        if (communityItem.com_image_path) {
            const imgPreview = document.createElement('img');
            imgPreview.src = communityItem.com_image_path;
            imgPreview.style.maxWidth = '100%';
            imgPreview.style.height = 'auto';
            document.getElementById('image-preview').appendChild(imgPreview);
        }

        if (communityItem.com_video_path) {
            const videoPreview = document.createElement('video');
            videoPreview.src = communityItem.com_video_path;
            videoPreview.controls = true;
            videoPreview.style.maxWidth = '100%';
            document.getElementById('video-preview').appendChild(videoPreview);
        }
    } else {
        alert('해당 커뮤니티 항목을 찾을 수 없습니다.');
    }
};

const updateCommunityItem = (postNumber) => {
    const title = document.getElementById('community-title').value;
    const content = document.getElementById('community-content').value;
    const imageFile = document.getElementById('image-upload').files[0];
    const videoFile = document.getElementById('video-upload').files[0];
    const nickname = "유저";
    const date = new Date().toISOString().split('T')[0];

    if (!title || !content) {
        alert("제목과 내용을 입력해 주세요.");
        return;
    }

    let data = JSON.parse(localStorage.getItem('communityList')) || [];
    const communityItemIndex = data.findIndex(item => item.com_post_number === parseInt(postNumber));

    if (communityItemIndex !== -1) {
        const existingCommunityItem = data[communityItemIndex];

        const imagePromise = new Promise((resolve) => {
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    data[communityItemIndex].com_image_path = e.target.result;
                    resolve();
                };
                reader.readAsDataURL(imageFile);
            } else {
                data[communityItemIndex].com_image_path = existingCommunityItem.com_image_path;
                resolve();
            }
        });

        const videoPromise = new Promise((resolve) => {
            if (videoFile) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    data[communityItemIndex].com_video_path = e.target.result;
                    resolve();
                };
                reader.readAsDataURL(videoFile);
            } else {
                data[communityItemIndex].com_video_path = existingCommunityItem.com_video_path;
                resolve();
            }
        });

        Promise.all([imagePromise, videoPromise]).then(() => {
            saveDataAndRedirect(data, communityItemIndex, postNumber, title, content, nickname, date);
        });
    } else {
        alert('해당 커뮤니티 항목을 찾을 수 없습니다.');
    }
};

const saveDataAndRedirect = (data, communityItemIndex, postNumber, title, content, nickname, date) => {
    data[communityItemIndex] = {
        com_post_number: parseInt(postNumber),
        com_title: title,
        com_content: content,
        com_post_date: date,
        usr_nickname: nickname,
        com_view_count: data[communityItemIndex].com_view_count,
    };

    localStorage.setItem('communityList', JSON.stringify(data));
    window.location.href = `./community-view.html?postNumber=${postNumber}`;
};

const addCommunityItem = () => {
    const title = document.getElementById('community-title').value;
    const content = document.getElementById('community-content').value;
    const imageFile = document.getElementById('image-upload').files[0];
    const videoFile = document.getElementById('video-upload').files[0];
    const nickname = "유저";
    const date = new Date().toISOString().split('T')[0];

    if (!title || !content) {
        alert("제목과 내용을 입력해 주세요.");
        return;
    }

    let data = JSON.parse(localStorage.getItem('communityList')) || [];
    let maxPostNumber = 0;

    fetch("../resources/temp-db/community.json")
        .then(res => res.json())
        .then(initialData => {
            const initialMaxPostNumber = Math.max(0, ...initialData.map(e => e.com_post_number));

            if (data.length > 0) {
                const localMaxPostNumber = Math.max(0, ...data.map(e => e.com_post_number));
                maxPostNumber = Math.max(initialMaxPostNumber, localMaxPostNumber);
            } else {
                maxPostNumber = initialMaxPostNumber;
            }

            const newPostNumber = maxPostNumber + 1;

            const imagePromise = new Promise((resolve) => {
                if (imageFile) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        resolve(e.target.result);
                    };
                    reader.readAsDataURL(imageFile);
                } else {
                    resolve('');
                }
            });

            const videoPromise = new Promise((resolve) => {
                if (videoFile) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        resolve(e.target.result);
                    };
                    reader.readAsDataURL(videoFile);
                } else {
                    resolve('');
                }
            });

            Promise.all([imagePromise, videoPromise]).then(([imageBase64, videoBase64]) => {
                const newCommunityItem = {
                    com_post_number: newPostNumber,
                    com_title: title,
                    com_content: content,
                    com_image_path: imageBase64,
                    com_video_path: videoBase64,
                    com_post_date: date,
                    usr_nickname: nickname,
                    com_view_count: 0,
                };

                data.push(newCommunityItem);
                localStorage.setItem('communityList', JSON.stringify(data));

                window.location.href = `./community-view.html?postNumber=${newPostNumber}`;
            });
        });
};

// localStorage.clear();