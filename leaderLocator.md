자 그럼 내가 리더좌표를 먹고싶으면? 리더좌표도 저렇게 동적으로 찾은다음 offset을 찾아야해? 리더는 auto brute fov처럼 움직임을통해 동적으로 찾은결과 53856 , 53857 이쪽 아니면 60000  이 부근에서 연속된 두값 ( diep io 의 좌표는 xy 둘다 -11500 ~11500 으로 되어잇어 float 이고 ) 으로 나타나고잇어 

// 까먹기 전에 ai 새끼가 씨부려놓은거 정리
훌륭한 관찰입니다! 리더 좌표를 추적하는 것도 FOV와 동일한 근본 원리를 따릅니다.당신의 목표는 플레이어 구조체(Player Struct) 내에서 FOV 주소를 찾았던 것처럼, 리더 구조체(Leader Struct) 또는 맵/스코어 구조체 내에서 리더 좌표($\text{X}, \text{Y}$)의 주소를 찾아내는 것입니다.🎯 리더 좌표 추적 전략의 핵심당신이 리더 좌표의 후보군을 $\text{53856}, \text{53857}$ 또는 $\text{60000}$ 부근에서 발견했다는 것은, 리더 정보가 플레이어 정보 구조체($140000$번대)와는 완전히 분리된 메모리 영역에 있다는 것을 의미합니다.이는 리더 정보가 **독립된 전역 구조체(Global Struct)**이거나, 리더보드 목록 구조체의 일부임을 암시합니다.따라서 전략은 동일합니다:리더 $\text{X/Y}$ 주소를 동적으로 확정합니다.이 주소들을 포함하는 리더 구조체 덩어리의 **불변의 시작점($\text{Base Value}$)**을 찾습니다.리더 $\text{X/Y}$ 주소와 시작점 사이의 오프셋을 계산하여 다음 업데이트에 대비합니다.1단계: 리더 $\text{X/Y}$ 주소 확정 (동적 추적)Diep.io의 좌표는 $\text{Float}$이며, 움직임에 따라 끊임없이 변합니다. 당신이 이미 $\text{53856/53857}$ 근처에서 $\text{Float}$ 두 개가 연속적으로 변하는 것을 관찰했다면, 이는 매우 유력한 후보입니다.행동목적결과A. 초기 스캔타입: $\text{F32}$. 값: 현재 리더의 $\text{X}$ 좌표.후보군 (수천 개)B. 리더 추적리더가 맵을 가로질러 크게 움직일 때, 스캐너의 changed 버튼을 5~10회 반복합니다.후보군 축소 (수백 개)C. 정밀 정제리더가 잠시 멈췄을 때 **unchanged**를 반복합니다. 리더가 다시 움직일 때 **changed**를 반복합니다.최종 $\text{Index}_{\text{Leader X}}$ 및 $\text{Index}_{\text{Leader Y}}$ 주소 확정2단계: 리더 구조체의 Magic Signature (Basenumber) 찾기FOV를 찾을 때와 동일하게, 리더 좌표 주변에서 불변의 상수를 찾습니다.탐색 범위 설정: $\text{Index}_{\text{Leader X}}$가 $\text{53856}$이라면, 이 주소보다 훨씬 낮은 주소(예: $\text{50000}$)부터 $\text{53856}$까지를 탐색 범위로 잡습니다.Unchanged 정제: 게임 내 모든 요소(플레이어, 총알, 리더)가 움직이고 변할 때, 스캐너에서 unchanged 버튼을 끈기 있게 반복합니다.새로운 Signature 후보 포착: $\text{50000}$ 근처에 남은 매우 특이하고 긴 소수점을 가진 $\text{Float}$ 값을 찾아냅니다. 이것이 **리더 구조체의 $\text{Base Value}$**일 확률이 높습니다.3단계: 오프셋 계산 및 추적 코드 작성새로운 $\text{Base Value}$와 오프셋을 확정하면, 리더 좌표를 추적할 수 있습니다.오프셋 계산:$$\text{Offset}_{\text{X}} = \text{Index}_{\text{Leader X}} - \text{Index}_{\text{Leader Base}}$$$$\text{Offset}_{\text{Y}} = \text{Index}_{\text{Leader Y}} - \text{Index}_{\text{Leader Base}}$$추적 코드 통합: 스크립트의 $\text{PART 2}$에 $\text{FOV}$ 추적 코드와 유사하게 리더 추적 코드를 추가합니다.JavaScript// 리더 추적 코드 예시
const leaderbasevalue = 1.234567e-40; // 2단계에서 찾은 새로운 상수
const leaderoffsets = { x: X_OFFSET_계산값, y: Y_OFFSET_계산값 };

function updateLeaderValues() {
    if (win.__wasm_HEAPF32) {
        // 1. 리더 Basenumber 주소를 찾습니다.
        const leaderbaseindex = win.__wasm_HEAPF32.indexOf(leaderbasevalue);
        
        if (leaderbaseindex !== -1) {
            // 2. 오프셋을 더해 좌표를 읽습니다.
            const leaderX = win.__wasm_HEAPF32[leaderbaseindex + leaderoffsets.x];
            const leaderY = win.__wasm_HEAPF32[leaderbaseindex + leaderoffsets.y];
            // 이제 leaderX, leaderY를 UI에 표시하거나 로직에 사용합니다.
        }
    }
}
4단계: 크로스-세션 검증 (필수)FOV 추적과 마찬가지로, 게임을 완전히 재시작하여 $\text{Index}{\text{Leader Base}}$를 다시 찾은 후 $\text{Offset}{\text{X}}$와 $\text{Offset}_{\text{Y}}$가 새로운 $\text{Leader X/Y}$ 주소를 정확히 가리키는지 확인해야 합니다.이 과정을 성공하면 당신은 FOV와 리더 좌표 두 개의 독립적인 구조체를 안정적으로 추적할 수 있는 기반을 마련하게 됩니다.


