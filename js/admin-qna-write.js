let postNumber;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    postNumber = urlParams.get('postNumber');

    if (postNumber) {
        loadQnaItem(postNumber);
    }

    document.getElementById('admin-qna-submit').addEventListener('click', () => {
        addQnaItem();
    });

    document.getElementById('admin-qna-cancel').addEventListener('click', () => {
        window.location.href = `./admin-qna-view.html?postNumber=${postNumber}`;
    });
});

const loadQnaItem = (postNumber) => {
    let data = JSON.parse(localStorage.getItem('qnaList')) || [];
    let qnaItem = data.find(item => item.qna_post_number === parseFloat(postNumber));

    if (qnaItem) {
        qnaItem.qna_view_count = (qnaItem.qna_view_count || 0) + 1;

        localStorage.setItem('qnaList', JSON.stringify(data));

        document.getElementById('admin-qna-title').value = qnaItem.qna_title.replace('<img src="../resources/images/lock.png" alt="비밀글" style="width:20px; height:20px;">', '').trim();
        document.getElementById('admin-qna-content').value = '';
        document.getElementById('admin-qna-check').checked = qnaItem.is_secret;
    } else {
        alert('해당 Q&A 항목을 찾을 수 없습니다.');
    }
};

const addQnaItem = () => {
    const title = document.getElementById('admin-qna-title').value;
    const content = document.getElementById('admin-qna-content').value;
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const nickname = loggedInUser ? loggedInUser.nickname : "관리자";
    const date = new Date().toISOString().split('T')[0];
    const isSecret = document.getElementById('admin-qna-check').checked;

    if (!title || !content) {
        alert("제목과 내용을 입력해 주세요.");
        return;
    }

    let data = JSON.parse(localStorage.getItem('qnaList')) || [];
    const qnaItemIndex = data.findIndex(item => item.qna_post_number === parseFloat(postNumber));

    const newQnaPostNumber = parseFloat(postNumber) - 0.1;

    const newQnaItem = {
        qna_post_number: newQnaPostNumber,
        qna_title: (isSecret ? '<img src="../resources/images/lock.png" alt="비밀글" style="width:20px; height:20px;"> ' : '') + title,
        qna_content: content,
        qna_post_date: date,
        usr_nickname: nickname,
        is_secret: isSecret,
        qna_view_count: 0
    };

    if (qnaItemIndex !== -1) {
        data[qnaItemIndex].qna_content = content;
        data.splice(qnaItemIndex + 1, 0, newQnaItem);
    } else {
        data.push(newQnaItem);
    }

    localStorage.setItem('qnaList', JSON.stringify(data));

    window.location.href = `./admin-qna.html`;
};