document.addEventListener('DOMContentLoaded', function() {
    // 등록 버튼 클릭 시 글 데이터 저장
    document.getElementById('submitBtn').addEventListener('click', function(event) {
        event.preventDefault();  // 폼 기본 제출 동작 방지

        const title = document.querySelector('.title').value;
        const content = document.querySelector('.tb').value;

        if (title && content) {
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            const postIndex = posts.length; // 현재 글의 인덱스
            posts.push({ title: title, content: content, date: new Date().toLocaleDateString(), nickname: '익명' });
            localStorage.setItem('posts', JSON.stringify(posts));

            // c.view.html로 이동하면서 해당 글의 인덱스 전달
            location.href = `c.view.html?post=${postIndex}`;
        } else {
            alert('제목과 내용을 모두 입력해주세요.');
        }
    });
});
