```js
let _buf = new ArrayBuffer(4);
let _i32 = new Int32Array(_buf);
let _f32 = new Float32Array(_buf);

const unmask = win.unmask = (v) => {
    _f32[0] = v;
    let v1 = _i32[0];
    let v2 = v1 >>> 16;
    let v3 = v1 >>> 8;
    let r = ((Math.imul(v1, -553648127) + 150994944) & -16777216) |
        ((((v1 + v3 * 99) << 16) + 589824) & 16711680) |
        ((((v3 + v2 * 222) << 8) + 58368) & 65280) |
        ((v2 + 225) & 255);
    _i32[0] = r ^ -105841027;
    return _f32[0];
};

const mask = win.mask = (v) => {
    _f32[0] = v;
    let v0 = _i32[0];
    let v1 = v0 ^ 125;
    let v2 = v1 * 34 + ((v0 >>> 8) ^ -2) + 58;
    let v3 = (v2 - 58) * -100 + v2 + ((v0 >>> 16) ^ -80) - 5809;
    let r = ((((v0 >>> 24) ^ 249) + v3 + (v3 << 5)) << 24) |
        (((v1 + 31) & 255) << 16) |
        ((v2 & 255) << 8) |
        (v3 & 255);
    _i32[0] = r - 150994944;
    return _f32[0];
};
```

저게 xor decoding 이야?