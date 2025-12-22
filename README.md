**10514 이서준 탐구자료 **


diep io 메모리 분석
WASM 후킹. WebAssembly.instantiate 및 WebAssembly.instatiateStreaming 함수 래핑하여 WASM 가로채기

memory 요소중 Float32Array ->> 플레이어 좌표, 플레이어 FOV 및 리더 좌표가 포함되어있음.
Int32Array ->> 탐구해봐야함
WASMheap32 
원리는 cheat engine 및 게임가디언의 unknown 값 탐색 과정과 비슷함.
0이 아닌 Float32값을 다 스캔떠오고 ->> 이 과정에서 180000개 정도 스캔나오는게 정상적인 스캔 성공임
특정 값을 따오거나 
// fov 메커니즘 
<img width="891" height="542" alt="image" src="https://github.com/user-attachments/assets/5cca033a-8c01-4931-97bb-127ad8d9bdc3" />

0.5500 ->> 0.5473 ->> 0.5446 _>> 0.5419
fov 값이 레벨업 할때마ㅏㄷ 저렇게 미세하게 변하고, 그걸 메모리를 확인해보니 오차범위 한 0.01? 사이에서 저게 계속 작아질거야. 이걸 근거로 저 값 근처에서 작아지는 이벤트가 있으며 오차범위 안으로 들어가는걸 찾으면 그게 fov값이겠네
이런식으로 굳이 업데이트 마다 직접 값을 찾지않고, 
1레벨부터 서서히 fov값이 감소하는걸 통해서 자동적으로 오차범위를 설정한다음 fov값을 찾을수있음.

///
scan unknown ->> 후 정제과정을 거침.
Fov가 조금씩 줄때마다 decreased, 아니면 changed 를 하고 정제를 위해 unchanged 를 한번씩 섞어줌(다른 요소가 우연하게도 겹치는것을 방지하기 위하여)
///
diep io는 내부적으로 좌표를 11350 까지 저장하는걸 알수있음.
왼쪽 상단이 -11350,-11350 으로 pygame과 유사하게 reverse y 를 사용하는 모습을 보임
리더 좌표도 비슷함 
<img width="763" height="792" alt="image" src="https://github.com/user-attachments/assets/c20a8eb2-34d8-43b3-89b4-2677bb9c5f72" />

첫번째 실험한 접속 기준으로 53856 인덱스, 53857 인덱스에 각 leader x,y 좌표가 저장되는것을 볼수있음.
연속된 두자리의 값으로 존재하고 player position 의 경우 FOV 벨류 근처에 생기는 모습을 볼수있다.

->> cazka 의 diep api 나 미니맵을 가져오는 방식과는 다르게 이것은 wasm 을 직접 파생해오는것으로 더 정확한 위치를 얻을수있다.



//canvas 요소 ->>  이것까지는 아직 잘 이해를 못하겠음.
일단 cazka 의 diep api 의 canvas kit 를 사용해서 리더 로케이터 구현예정



TODO :
nab 의 과거 FOV 방식과 비슷하게, 자동적으로 게임이 시작될시 F32 벨류를 모두 스캔해오고 
레벨별 FOV의 변화를 바탕으로 FOV값을 가져올수있다. 
그러나 정확한 FOV 값 확인시 0.4349394 이런식으로 0.XXX 의 오차가 발생하는것을 감안하여 
게임 시작시 탐지기를 실행하고 0.5xx 요소중 변화하는 요소만 필터링을 해온다음
계속해서 일정한 오차범위내의 수준으로 감소힌다면 그것을 FOV 값으로 보고
해당 메모리의 요소를 수정함
마우스휠 올릴시 -0.1
마우스 휠 내릴시 + 0.1 
관측한 바로 FOV가 넓어질수록 숫자는 줄어듬. 0.6 FOV < 0.4 FOV 라는것임.
따라서 휠을 올릴시(증가를 원할시에)는 값을 감소시켜야 하고
휠을 내릴시(감소를 원할시에)는 값을 증가시켜야함.
과거 ABC's packet wasm hook 은 m number에 의존하는 방식이지만 (내가 알기론)
이것은 모든 게임의 메모리를 캡쳐하고 증가 감소를 통해 퍼지값을 찾아오는것이므로 업데이트 의존도가 낮음

//
또한 player (x,y) 와 leader(x,y) 를 알게되었으니 
카즈카의 diep api 를 통해 미니맵에 리더좌표 표시와 리더에 원표시를 구현가능
과거 폰요/tariteur/ crabby 의 leader locator 및 permanent leader arrow에서 작동원리를 얻어올수 있을것임







