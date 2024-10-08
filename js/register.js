    function showTerms(type) {
        const popup = document.getElementById('popup');
        const title = document.getElementById('popup-title');
        const text = document.getElementById('popup-text');

        if (type === 'terms') {
            title.innerText = '이용약관';
            text.innerText =  `
제1조(목적)
이 약관은 [HUMAN HEALTH] (이하 "회사")이 제공하는 모든 서비스(이하 "서비스")의 이용 조건 및 절차, 회원과 회사의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조(용어의 정의)
1. "서비스"란 회사가 제공하는 모든 온라인 서비스 및 기능을 말합니다.
2. "회원"이란 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 서비스를 이용하는 이용자를 말합니다.
3. "아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 이메일 주소 또는 문자와 숫자의 조합을 말합니다.
4. "비밀번호"란 회원이 설정한 아이디와 일치하는지 확인하고 회원의 비밀 보호를 위해 설정한 문자와 숫자의 조합을 말합니다.

제3조(약관의 효력 및 변경)
1. 이 약관은 회원이 회원가입 시 동의함으로써 효력이 발생합니다.
2. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지하거나 회원의 이메일로 고지합니다.
3. 회원은 변경된 약관에 동의하지 않을 권리가 있으며, 변경된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있습니다.

제4조(회원가입 및 이용계약 체결)
1. 회원가입은 이용자가 약관에 동의하고 회사가 정한 가입 양식에 따라 정보를 기입하여 가입 신청을 할시 성립됩니다.
2. 회사는 아래 각 호에 해당하는 경우 회원가입을 거부할 수 있습니다.
    1. 등록 내용에 허위, 오기가 있는 경우
    2. 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우

제5조(회원의 의무)
1. 회원은 서비스 이용 시 법령, 약관, 공지사항 및 회사가 통지하는 사항을 준수해야 합니다.
2. 회원은 타인의 개인정보를 침해하거나 도용해서는 안 됩니다.
3. 회원은 회사의 명시적 동의 없이 서비스를 영리 목적으로 사용할 수 없습니다.

제6조(서비스 제공 및 중단)
1. 회사는 회원에게 아래와 같은 서비스를 제공합니다.
    1. 사용자 건강 관리
        • 회원의 신체 정보를 입력하여 건강 상태를 분석하고, 목표 설정 및 현재 상태를 비교하여 시각적으로 제공하는 기능
        • 체중, 체지방률, 골격근량 등 주요 건강 지표를 관리하고 기록할 수 있는 기능
    2. 활동 관리
        • 사용자가 운동 및 활동 데이터를 입력하여 일일 활동량과 대사량을 기록하고 관리할 수 있는 기능
        • 활동 템플릿을 사용하여 다양한 운동의 시간과 강도를 기록하는 기능 제공
    3. 식단 관리
        • 회원의 식단 정보를 입력하여 일일 칼로리, 탄수화물, 단백질, 지방 섭취량을 계산하고 기록할 수 있는 기능
        • 권장 칼로리와 단백질 섭취량에 대한 정보 제공 및 식사 기록을 바탕으로 한 시각적 분석 기능
    4. 건강 정보 제공
        • 스트레스 지수, 수면 시간 기록 등을 바탕으로 추천 건강 정보를 제공
        • 스트레칭 및 운동 관련 동영상 추천 기능 제공
    5. 커뮤니티 기능
        • 사용자들 간의 정보 공유 및 소통을 위한 커뮤니티 게시판 제공
        • 사용자가 글을 작성할 수 있는 기능, 특정 제목, 닉네임에 대한 검색 기능
    6. Q&A 게시판
        • 홈페이지 이용관련 질문을 등록하고 관리자가 답변을 달 수 있는 기능
2. 회사는 시스템 유지보수, 기술적 문제, 또는 기타 불가피한 사유가 있는 경우 서비스 제공을 일시적으로 중단할 수 있으며, 이에 대해 사전에 통지합니다.

제7조(계약 해지 및 회원 탈퇴)
1. 회원은 언제든지 서비스 내 회원 탈퇴 절차를 통해 이용계약을 해지할 수 있습니다.
2. 회사는 회원이 약관을 위반하거나 관련 법령을 위반한 경우 이용계약을 해지할 수 있습니다.

제8조(개인정보의 보호)
회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하며, 개인정보의 보호 및 사용에 대해서는 별도의 "개인정보 처리방침"에 따릅니다.

제9조(책임 제한)
1. 회사는 천재지변, 전쟁, 테러, 자연재해 등 불가항력적인 사유로 인한 서비스 중단에 대하여 책임을 지지 않습니다.
2. 회사는 회원의 귀책 사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.

제10조(분쟁 해결)
이 약관에서 발생한 분쟁에 대하여 회사와 회원 간에 성실히 협의하되, 협의가 이루어지지 않을 경우 관련 법령에 따라 관할 법원에 소를 제기할 수 있습니다.

부칙
이 약관은 2024년 10월 18일부터 시행됩니다.
`;
        } else if (type === 'privacy'){

            title.innerText = '개인정보 취급방침';
            text.innerText = `
            [HUMAN HEALTH] (이하 "회사")는 회원의 개인정보를 중요시하며, 『개인정보 보호법』 및 관련 법령을 준수하고 있습니다. 이 개인정보 취급방침은 회원이 제공하는 개인정보가 어떻게 이용되고 보호되는지에 대해 안내드립니다.

            제1조(개인정보의 수집 목적)
            회사는 다음의 목적을 위하여 회원의 개인정보를 수집합니다.
            1. 회원관리: 회원 식별, 가입의사 확인, 본인 인증, 회원자격 유지 및 관리, 부정 이용 방지
            2. 서비스 제공: 맞춤형 건강 정보 제공, 신체 데이터 기반의 분석 및 건강 관리, 커뮤니티 이용
            3. 고지 및 안내: 서비스 이용과 관련한 중요한 공지사항 전달, 변경사항 안내
            4. 마케팅 및 광고: 이벤트 정보 제공, 광고성 정보 전달 (동의한 경우에 한함)

            제2조(수집하는 개인정보 항목)
            회사는 서비스 이용을 위해 아래와 같은 개인정보를 수집할 수 있습니다.
            1. 필수 수집 항목:
                • 회원가입 시: 이메일 주소(아이디), 비밀번호, 닉네임
                • 건강 관리 서비스 이용 시: 성별, 나이, 신체 정보(체중, 체지방률, 골격근량 등)
            2. 자동 수집 항목: 서비스 이용 기록

            제3조(개인정보의 보유 및 이용 기간)
            회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만, 관련 법령에 따라 일정 기간 보관해야 하는 경우는 아래와 같습니다.
            1. 회원 탈퇴 시: 탈퇴 후 7일간 재가입 방지 목적으로 회원정보 보관
            2. 관련 법령에 따른 보관:
                • 계약 또는 청약철회에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)
                • 서비스 이용 관련 기록: 3년 (통신비밀보호법)

            제4조(개인정보의 제3자 제공)
            회사는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우에 한해 개인정보를 제공할 수 있습니다.
            1. 회원이 사전에 동의한 경우
            2. 법령에 의하여 요구되는 경우 (예: 수사 목적으로 법령에 따른 수사기관의 요청이 있을 경우)

            제5조(개인정보의 처리 위탁)
            회사는 원활한 서비스 제공을 위해 개인정보 처리를 외부 업체에 위탁할 수 있습니다. 이 경우, 위탁 계약을 통해 수탁자가 개인정보 보호 관련 법령을 준수하도록 관리 감독합니다.
                • 위탁업체명: 없음
                • 위탁업무 내용: 없음

            제6조(개인정보의 파기 절차 및 방법)
            회사는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우, 해당 정보를 지체 없이 파기합니다. 파기 절차 및 방법은 다음과 같습니다.
            1. 파기 절차: 목적 달성 후 별도의 DB로 옮겨져 내부 방침 및 기타 법령에 따라 일정 기간 보관 후 삭제됩니다.
            2. 파기 방법:
                • 전자적 파일 형태의 정보는 복구할 수 없도록 기술적 방법을 사용해 삭제
                • 종이에 출력된 개인정보는 분쇄기로 파기

            제7조(회원의 권리 및 행사 방법)
            회원은 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제, 처리 정지를 요구할 수 있습니다. 개인정보 관련 요청은 Q & A를 통해 접수할 수 있으며, 회사는 지체 없이 처리합니다.
            1. 열람 및 정정 요청: 개인정보 열람 및 오류가 있을 경우 정정 요청 가능
            2. 삭제 요청: 개인정보 삭제를 요청할 경우, 회사는 관련 법령이 허용하는 범위 내에서 처리
            3. 처리 정지 요청: 법령에 의거해 개인정보 처리의 정지를 요구할 수 있음

            제8조(개인정보의 안전성 확보 조치)
            회사는 회원의 개인정보를 보호하기 위해 다음과 같은 기술적/관리적 대책을 시행하고 있습니다.
            1. 기술적 조치: 개인정보는 비밀번호에 의해 보호되며, 중요한 데이터는 암호화하여 저장 및 관리
            2. 관리적 조치: 개인정보 보호를 위한 내부관리 계획 수립
            3. 물리적 조치: 개인정보가 저장된 시스템에 대한 접근 통제

            제9조(개인정보 보호책임자)
            회사는 개인정보 처리와 관련한 회원의 의견을 수렴하고 불만을 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                • 개인정보 보호책임자: [없음(이름)]
                • 연락처: [없음(이메일, 전화번호)]

            제10조(개인정보 취급방침의 변경)
            이 개인정보 취급방침은 법령 및 회사 정책에 따라 변경될 수 있습니다. 변경 사항은 서비스 내 공지사항을 통해 고지되며, 중대한 변경 사항은 최소 7일 전에 고지됩니다.

            부칙
            이 개인정보 취급방침은 2024년 10월 18일부터 시행됩니다.
            `;
        }

        popup.style.display = 'block'; // 팝업 창 보이기
    }

    function closePopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none'; // 팝업 창 숨기기
    }

