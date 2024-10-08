document.addEventListener("DOMContentLoaded", function() {
    const cancelBtn = document.getElementById('cancelBtn');
    const resetBtn = document.getElementById('resetBtn');
    const submitBtn = document.getElementById('submitBtn');
    const titleInput = document.querySelector('.title');
    const contentInput = document.querySelector('.tb');
    const uploadInput = document.querySelector('.upload');

    // 초기화 버튼 클릭 시 폼 초기화
    resetBtn.addEventListener('click', function() {
        titleInput.value = '';
        contentInput.value = '';
        uploadInput.value = '';
    });

    // 등록 버튼 클릭 시 입력 값 확인
    submitBtn.addEventListener('click', function(event) {
        event.preventDefault(); // 폼 제출 방지
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!title) {
            alert('제목을 입력해주세요.');
            titleInput.focus();
            return;
        }

        if (!content) {
            alert('내용을 입력해주세요.');
            contentInput.focus();
            return;
        }

        // 모든 검증이 통과되면 폼을 제출
        alert('제출이 완료되었습니다!');
        // 여기서 실제 제출 로직을 추가할 수 있습니다.
        // 예: AJAX 요청 등
    });
});