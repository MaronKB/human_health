document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postNumber = urlParams.get('postNumber');

    if (postNumber) {
        loadQnaItem(postNumber);
    }

    document.getElementById('admin-qna-submit').addEventListener('click', () => {
        if (postNumber) {
            updateQnaItem(postNumber);
        } else {
            addQnaItem();
        }
    });
});

const loadQnaItem = (postNumber) => {
    const data = JSON.parse(localStorage.getItem('admin-qnaList')) || [];

    const qnaItem = data.find(item => item.qna_post_number === parseInt(postNumber));

    if (qnaItem) {
        document.getElementById('admin-qna-title').value = qnaItem.qna_title.replace('<img src="../resources/images/lock.png" alt="비밀글" style="width:20px; height:20px;">', '').trim();
        document.getElementById('admin-qna-content').value = qnaItem.qna_content;
        document.getElementById('admin-qna-check').checked = qnaItem.is_secret;
    } else {
        alert('해당 Q&A 항목을 찾을 수 없습니다.');
    }
};

const updateQnaItem = (postNumber) => {
    const title = document.getElementById('admin-qna-title').value;
    const content = document.getElementById('admin-qna-content').value;
    const nickname = "유저";
    const date = new Date().toISOString().split('T')[0];
    const isSecret = document.getElementById('admin-qna-check').checked;

    if (!title || !content) {
        alert("제목과 내용을 입력해 주세요.");
        return;
    }

    let data = JSON.parse(localStorage.getItem('qnaList')) || [];
    const qnaItemIndex = data.findIndex(item => item.qna_post_number === parseInt(postNumber));

    if (qnaItemIndex !== -1) {
        const existingQnaItem = data[qnaItemIndex];

        data[qnaItemIndex] = {
            qna_post_number: parseInt(postNumber),
            qna_title: (isSecret ? '<img src="../resources/images/lock.png" alt="비밀글" style="width:20px; height:20px;"> ' : '') + title,
            qna_content: content,
            qna_post_date: date,
            usr_nickname: nickname,
            qna_view_count: existingQnaItem.qna_view_count,
            is_secret: isSecret
        };

        localStorage.setItem('qnaList', JSON.stringify(data));
        window.location.href = `./admin-qna-view.html?postNumber=${postNumber}`;
    } else {
        alert('해당 Q&A 항목을 찾을 수 없습니다.');
    }
};

const addQnaItem = () => {
    const title = document.getElementById('admin-qna-title').value;
    const content = document.getElementById('admin-qna-content').value;
    const nickname = "유저";
    const date = new Date().toISOString().split('T')[0];
    const isSecret = document.getElementById('admin-qna-check').checked;

    if (!title || !content) {
        alert("제목과 내용을 입력해 주세요.");
        return;
    }

    let data = JSON.parse(localStorage.getItem('qnaList')) || [];
    let maxPostNumber = 0;

    fetch("../resources/temp-db/qna.json")
        .then(res => res.json())
        .then(initialData => {
            const initialMaxPostNumber = Math.max(0, ...initialData.map(e => e.qna_post_number));

            if (data.length > 0) {
                const localMaxPostNumber = Math.max(0, ...data.map(e => e.qna_post_number));
                maxPostNumber = Math.max(initialMaxPostNumber, localMaxPostNumber);
            } else {
                maxPostNumber = initialMaxPostNumber;
            }

            createNewQnaItem(maxPostNumber + 1, title, content, nickname, date, isSecret, data);
        })
        .catch(() => {
            if (data.length > 0) {
                const localMaxPostNumber = Math.max(0, ...data.map(e => e.qna_post_number));
                maxPostNumber = localMaxPostNumber;
            }

            createNewQnaItem(maxPostNumber + 1, title, content, nickname, date, isSecret, data);
        });
};

const createNewQnaItem = (newPostNumber, title, content, nickname, date, isSecret, data) => {
    const secretImage = '<img src="../resources/images/lock.png" alt="비밀글" style="width:20px; height:20px;">';

    data.unshift({
        qna_post_number: newPostNumber,
        qna_title: (isSecret ? secretImage + ' ' : '') + title,
        qna_content: content,
        qna_post_date: date,
        usr_nickname: nickname,
        is_secret: isSecret,
        qna_view_count: 0
    });

    localStorage.setItem('qnaList', JSON.stringify(data));
    window.location.href = `./admin-qna-view.html?postNumber=${newPostNumber}`;
};