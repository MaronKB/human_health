document.addEventListener('DOMContentLoaded', function() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsPerPage = 10; // 한 페이지에 표시할 글 수
    let currentPage = 1;

    function updateCommunityList() {
        const communityList = document.getElementById('community-list');
        communityList.innerHTML = ''; // 기존 글 목록 초기화
        const startIndex = (currentPage - 1) * postsPerPage; // 시작 인덱스
        const endIndex = startIndex + postsPerPage; // 끝 인덱스
        const reversedPosts = [...posts].reverse(); // 배열 반전
        const paginatedPosts = reversedPosts.slice(startIndex, endIndex); // 페이지당 글 가져오기

        paginatedPosts.forEach((post, index) => {
            const postItem = document.createElement('div');
            postItem.classList.add('community-item');

            const postNumber = posts.length - startIndex - index; // 전체 목록에서의 번호 계산

            postItem.innerHTML = `
                <div class="communityItem1">${postNumber}</div>
                <div class="communityItem2">${post.title}</div>
                <div class="communityItem1">${post.nickname}</div>
                <div class="communityItem1">${post.date}</div>
            `;
            communityList.appendChild(postItem);
        });

        updatePagination();
    }

    function updatePagination() {
        const pagination = document.getElementById('community-pagination');
        pagination.innerHTML = ''; // 기존 페이지네이션 초기화

        const totalPages = Math.ceil(posts.length / postsPerPage);

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerText = '이전';
            prevButton.onclick = () => {
                currentPage--;
                updateCommunityList();
            };
            pagination.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.onclick = () => {
                currentPage = i;
                updateCommunityList();
            };
            pagination.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.innerText = '다음';
            nextButton.onclick = () => {
                currentPage++;
                updateCommunityList();
            };
            pagination.appendChild(nextButton);
        }
    }

    // 초기 글 목록 업데이트
    updateCommunityList();
});
