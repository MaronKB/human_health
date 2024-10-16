document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postNumber = urlParams.get('postNumber');

    if (postNumber) {
        loadQnaItem(postNumber);
    }

    document.getElementById('edit-button').addEventListener('click', () => {
        window.location.href = `./qna-write.html?postNumber=${postNumber}`;
    });

    document.getElementById('delete-button').addEventListener('click', () => {
        if (confirm("정말로 삭제하시겠습니까?")) {
            deleteQnaItem(postNumber);
        }
    });

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        const qnaItem = JSON.parse(localStorage.getItem('qnaList')).find(item => item.qna_post_number === parseFloat(postNumber));

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
    let qnaItem = localData.find(item => item.qna_post_number === parseFloat(postNumber));

    if (qnaItem) {
        const previousIndex = localData.findIndex(item => item.qna_post_number === parseFloat(postNumber)) - 1;
        const previousQnaItem = previousIndex >= 0 ? localData[previousIndex] : null;

        const canViewSecret =
            (loggedInUser && (qnaItem.usr_nickname === loggedInUser.nickname || loggedInUser.nickname === "관리자")) ||
            (previousQnaItem && previousQnaItem.usr_nickname === loggedInUser.nickname);

        if (qnaItem.is_secret && !canViewSecret) {
            alert("이 글은 비밀글로 작성되어 있습니다. 작성자 또는 관리자만 볼 수 있습니다.");
            window.location.href = './qna.html';
            return;
        }

        qnaItem.qna_view_count = (qnaItem.qna_view_count || 0) + 1;
        displayQnaItem(qnaItem);

        const updatedLocalData = localData.map(item =>
            item.qna_post_number === parseFloat(postNumber) ? qnaItem : item
        );
        localStorage.setItem('qnaList', JSON.stringify(updatedLocalData));
    } else {
        fetch('../resources/temp-db/qna.json')
            .then(res => res.json())
            .then(jsonData => {
                qnaItem = jsonData.find(item => item.qna_post_number === parseFloat(postNumber));

                if (qnaItem) {
                    const previousIndex = localData.findIndex(item => item.qna_post_number === parseFloat(postNumber)) - 1;
                    const previousQnaItem = previousIndex >= 0 ? localData[previousIndex] : null;

                    const canViewSecret =
                        (loggedInUser && (qnaItem.usr_nickname === loggedInUser.nickname || loggedInUser.nickname === "관리자")) ||
                        (previousQnaItem && previousQnaItem.usr_nickname === loggedInUser.nickname);

                    if (qnaItem.is_secret && !canViewSecret) {
                        alert("이 글은 비밀글로 작성되어 있습니다. 작성자 또는 관리자만 볼 수 있습니다.");
                        window.location.href = './qna.html';
                        return;
                    }

                    qnaItem.qna_view_count = (qnaItem.qna_view_count || 0) + 1;
                    displayQnaItem(qnaItem);

                    localData.push(qnaItem);
                    localStorage.setItem('qnaList', JSON.stringify(localData));
                } else {
                    alert('해당 Q&A 항목을 찾을 수 없습니다.');
                    window.location.href = './qna.html';
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                alert('데이터를 가져오는 중 오류가 발생했습니다.');
            });
    }
};

const displayQnaItem = (qnaItem) => {
    document.getElementById('qna-title').innerHTML = qnaItem.qna_title;
    document.getElementById('qna-content').innerText = qnaItem.qna_content;
    document.getElementById('qna-date').innerText = qnaItem.qna_post_date;
    document.getElementById('qna-nickname').innerText = qnaItem.usr_nickname;
    document.getElementById('qna-view-count').innerText = qnaItem.qna_view_count;
};

const deleteQnaItem = (postNumber) => {
    let data = JSON.parse(localStorage.getItem('qnaList')) || [];
    data = data.filter(item => item.qna_post_number !== parseFloat(postNumber));
    localStorage.setItem('qnaList', JSON.stringify(data));
    alert('글이 삭제되었습니다.');
    window.location.href = './qna.html';
};