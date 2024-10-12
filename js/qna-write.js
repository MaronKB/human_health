document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postNumber = urlParams.get('postNumber');

    if (postNumber) {
        loadQnaItem(postNumber);
    }

    document.getElementById('qna-submit').addEventListener('click', () => {
        if (postNumber) {
            updateQnaItem(postNumber);
        } else {
            addQnaItem();
        }
    });
});

const loadQnaItem = (postNumber) => {
    const data = JSON.parse(localStorage.getItem('qnaList')) || [];

    const qnaItem = data.find(item => item.com_post_number === parseInt(postNumber));

    if (qnaItem) {
        document.getElementById('qna-title').value = qnaItem.com_title.replace('<img src="../resources/images/lock.png" alt="비밀글" style="width:20px; height:20px;">', '').trim();
        document.getElementById('qna-content').value = qnaItem.com_content;
        document.getElementById('qna-check').checked = qnaItem.is_secret;
    } else {
        alert('해당 Q&A 항목을 찾을 수 없습니다.');
    }
};

const updateQnaItem = (postNumber) => {
    const title = document.getElementById('qna-title').value;
    const content = document.getElementById('qna-content').value;
    const nickname = "유저";
    const date = new Date().toISOString().split('T')[0];
    const isSecret = document.getElementById('qna-check').checked;

    if (!title || !content) {
        alert("제목과 내용을 입력해 주세요.");
        return;
    }

    let data = JSON.parse(localStorage.getItem('qnaList')) || [];

    const qnaItemIndex = data.findIndex(item => item.com_post_number === parseInt(postNumber));

    if (qnaItemIndex !== -1) {
        const existingQnaItem = data[qnaItemIndex];

        data[qnaItemIndex] = {
            com_post_number: parseInt(postNumber),
            com_title: (isSecret ? '<img src="../resources/images/lock.png" alt="비밀글" style="width:20px; height:20px;"> ' : '') + title,
            com_content: content,
            com_post_date: date,
            usr_nickname: nickname,
            com_view_count: existingQnaItem.com_view_count,
            is_secret: isSecret
        };

        localStorage.setItem('qnaList', JSON.stringify(data));

        window.location.href = `./qna-view.html?postNumber=${postNumber}`;
    } else {
        alert('해당 Q&A 항목을 찾을 수 없습니다.');
    }
};

const addQnaItem = () => {
    const title = document.getElementById('qna-title').value;
    const content = document.getElementById('qna-content').value;
    const nickname = "유저";
    const date = new Date().toISOString().split('T')[0];
    const isSecret = document.getElementById('qna-check').checked;

    if (!title || !content) {
        alert("제목과 내용을 입력해 주세요.");
        return;
    }

    let data = JSON.parse(localStorage.getItem('qnaList')) || [];

    let maxPostNumber = 0;

    fetch("../resources/temp-db/qna.json")
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

            const secretImage = '<img src="../resources/images/lock.png" alt="비밀글" style="width:20px; height:20px;">';

            data.unshift({
                com_post_number: newPostNumber,
                com_title: (isSecret ? secretImage + ' ' : '') + title,
                com_content: content,
                com_post_date: date,
                usr_nickname: nickname,
                is_secret: isSecret
            });

            localStorage.setItem('qnaList', JSON.stringify(data));

            window.location.href = `./qna-view.html?postNumber=${newPostNumber}`;
        });
};