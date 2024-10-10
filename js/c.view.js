document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postIndex = urlParams.get('post');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    if (posts[postIndex]) {
        const post = posts[postIndex];
        document.querySelector('td[title]').textContent = post.title;
        document.querySelector('td[nickname]').textContent = post.nickname;
        document.querySelector('td[date]').textContent = post.date;
        document.querySelector('.qna_view_content p').textContent = post.content;
    } else {
        alert('글을 찾을 수 없습니다.');
        location.href = 'community.html';
    }
});
