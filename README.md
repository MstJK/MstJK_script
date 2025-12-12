diep io 메모리 분석
WASM 후킹. WebAssembly.instantiate 및 WebAssembly.instatiateStreaming 함수 래핑하여 WASM 가로채기

memory 요소중 Float32Array ->> 플레이어 좌표, 플레이어 FOV 및 리더 좌표가 포함되어있음.
Int32Array ->> 탐구해봐야함
WASMheap32 
원리는 cheat engine 및 게임가디언의 unknown 값 탐색 과정과 비슷함.
0이 아닌 Float32값을 다 스캔떠오고 ->> 이 과정에서 180000개 정도 스캔나오는게 정상적인 스캔 성공임
특정 값을 따오거나 
