    function showTerms(type) {
        const popup = document.getElementById('popup');
        const title = document.getElementById('popup-title');
        const text = document.getElementById('popup-text');

        if (type === 'terms') {
            title.innerText = '이용약관';
            text.innerText =  `
제 1 조 (목적)
이 이용약관은 “e나라 표준인증 (이하 "당 사이트")”에서 제공하는 인터넷 서비스(이하 '서비스')의 가입조건, 당 사이트와 이용자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.

제 2 조 (정의)
이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
1. “회원”이라 함은 당 사이트에 개인 정보 등록을 통해 서비스를 제공받는 자를 말합니다.
2. “비밀번호”라 함은 회원의 개인 정보 보호를 위해 회원이 설정한 문자와 숫자의 조합을 의미합니다.

제 3 조 (약관의 개정)
1. 당 사이트는 이 약관을 변경할 수 있으며, 변경된 약관은 사전에 공지합니다.
2. 변경된 약관은 공지한 날로부터 효력이 발생합니다.

제 4 조 (서비스의 제공 및 변경)
1. 당 사이트는 다음과 같은 서비스를 제공합니다:
   - 인증 서비스
   - 정보 제공 서비스
2. 서비스의 내용은 필요한 경우 변경될 수 있습니다.
`;
        } else if (type === 'privacy'){

            title.innerText = '개인정보 취급방침';
            text.innerText = `개인정보보호위원회(이하 '개인정보위'라 한다)는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립 ‧ 공개합니다.`;
        }

        popup.style.display = 'block'; // 팝업 창 보이기
    }

    function closePopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none'; // 팝업 창 숨기기
    }

