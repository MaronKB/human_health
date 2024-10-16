document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postNumber = urlParams.get('postNumber');

    if (postNumber) {
        loadQnaItem(postNumber);
    }

    document.getElementById('edit-button').addEventListener('click', () => {
        window.location.href = `./admin-qna-write.html?postNumber=${postNumber}`;
    });

    document.getElementById('delete-button').addEventListener('click', () => {
        if (confirm("정말로 삭제하시겠습니까?")) {
            deleteQnaItem(postNumber);
        }
    });

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        const qnaItem = JSON.parse(localStorage.getItem('qnaList')).find(item => item.qna_post_number === parseInt(postNumber));
        
        if (qnaItem && (qnaItem.usr_nickname === loggedInUser.nickname || loggedInUser.nickname === '관리자')) {
            document.getElementById('edit-button').style.display = 'inline-block';
            document.getElementById('delete-button').style.display = 'inline-block';
        } else {
            document.getElementById('edit-button').style.display = 'none';
            document.getElementById('delete-button').style.display = 'none';
        }
    } else {
        document.getElementById('edit-button').style.display = 'none';
        document.getElementById('delete-button').style.display = 'none';
    }
});

const loadQnaItem = (postNumber) => {
    const localData = JSON.parse(localStorage.getItem('qnaList')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let qnaItem = localData.find(item => item.qna_post_number === parseInt(postNumber));

    if (qnaItem) {
        if (qnaItem.is_secret && (!loggedInUser || (qnaItem.usr_nickname !== loggedInUser.nickname && loggedInUser.nickname !== "관리자"))) {
            alert("이 글은 비밀글로 작성되어 있습니다. 작성자 또는 관리자만 볼 수 있습니다.");
            window.location.href = './admin-qna.html';
            return;
        }

        qnaItem.qna_view_count = (qnaItem.qna_view_count || 0) + 1;
        displayQnaItem(qnaItem);

        const updatedLocalData = localData.map(item =>
            item.qna_post_number === parseInt(postNumber) ? qnaItem : item
        );
        localStorage.setItem('qnaList', JSON.stringify(updatedLocalData));
    } else {
        fetch('../resources/temp-db/qna.json')
            .then(res => res.json())
            .then(jsonData => {
                qnaItem = jsonData.find(item => item.qna_post_number === parseInt(postNumber));

                if (qnaItem) {
                    if (qnaItem.is_secret && (!loggedInUser || (qnaItem.usr_nickname !== loggedInUser.nickname && loggedInUser.nickname !== "관리자"))) {
                        alert("이 글은 비밀글로 작성되어 있습니다. 작성자 또는 관리자만 볼 수 있습니다.");
                        window.location.href = './admin-qna.html';
                        return;
                    }

                    qnaItem.qna_view_count = (qnaItem.qna_view_count || 0) + 1;
                    displayQnaItem(qnaItem);

                    localData.push(qnaItem);
                    localStorage.setItem('qnaList', JSON.stringify(localData));
                } else {
                    alert('해당 Q&A 항목을 찾을 수 없습니다.');
                    window.location.href = './admin-qna.html';
                }
            });
    }
};

const displayQnaItem = (qnaItem) => {
    document.getElementById('admin-qna-title').innerHTML = qnaItem.qna_title;
    document.getElementById('admin-qna-content').innerText = qnaItem.qna_content;
    document.getElementById('admin-qna-date').innerText = qnaItem.qna_post_date;
    document.getElementById('admin-qna-nickname').innerText = qnaItem.usr_nickname;
    document.getElementById('admin-qna-view-count').innerText = qnaItem.qna_view_count;
};

const deleteQnaItem = (postNumber) => {
    let data = JSON.parse(localStorage.getItem('qnaList')) || [];
    data = data.filter(item => item.qna_post_number !== parseInt(postNumber));
    localStorage.setItem('qnaList', JSON.stringify(data));
    alert('글이 삭제되었습니다.');
    window.location.href = './admin-qna.html';
};