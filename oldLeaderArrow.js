// ==UserScript==
// @name         ‎Dead locator / Leader locator, press + or - to change the size of the circle around the leader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  It shows where you died at the last position and leader position (ABC' wasm hook don't work with idk why)
// @author       MSTJK STOLE THIS A LONG LONG TIME AGO NIGGER
// @match        https://diep.io/
// @require      https://greasyfork.org/scripts/455550-wasm-parser/code/wasm%20parser.js?version=1123676
// @require      https://greasyfork.org/scripts/433681-diepapi/code/diepAPI.js?version=1117485
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// ==/UserScript==
//I use DiepAPI by Cazka
const { Vector, CanvasKit } = window.diepAPI.core;
const { scaling, player, game, minimap, camera, arena } = window.diepAPI.apis;
const { backgroundOverlay } = window.diepAPI.tools;
const { entityManager } = window.diepAPI.extensions;
const ctx = backgroundOverlay.ctx;
const canvas = document.getElementById('canvas');
const ctx2 = canvas.getContext('2d');
const colors = ["#E8B18A", "#E666EA", "#9566EA", "#6690EA", "#E7D063", "#EA6666", "#92EA66", "#808080"];
////////////////////pink////////violet/////bleu///////jaune//////rouge//////vert///////bleu clair//gris////
var Deadx = 0;
var Deady = 0;
var Leaderx = 0;
var Leadery = 0;
var size = 100;

WebAssembly.instantiateStreaming = (r, i) => r.arrayBuffer().then(b => WebAssembly.instantiate(b, i));
const _instantiate = WebAssembly.instantiate;
WebAssembly.instantiate = async(bin, imports) => {
    console.log("parser loaded");
    imports.lol = {
        troll: (x,y) => {
            Leaderx = x;
            Leaderx = x;
            Leadery = y;
            return 1;
        }
    }
    const lol = new WASMParser(bin);
    const thing = lol.addImportEntry({
        "name": "lol.troll",
        "type": "func",
        "params": ['f32','f32'],
        "returns": ['i32']
    })
    lol.reindex();
    lol.loadFunc(515);
    lol.set(515, lol.lexer.inject([
        OP.local.get, 3,
        OP.local.get, 4,
        OP.call, ...Writer.vu(thing),
        OP.drop
    ]));
    console.log("%cxd instantiated",'color: red; font-weight: bold');
    bin = lol.compile();
    return _instantiate(bin, imports);
}



function show(){
//player predict position

//leader minimap
    const LeaderPos = new Vector(Leaderx, Leadery);
    const LeaderMinimapPos = toMinimapPosition(new Vector(Leaderx, Leadery));
    const LeaderPlayerMinimapPos = toMinimapPosition(new Vector(player.position.x, player.position.y));
    const LeaderDistance = Math.round(Vector.distance(LeaderPos, player.position));
    const radius = toMinimapPosition(new Vector(0, size+Leadery)).y - LeaderMinimapPos.y

    ctx2.save();
    ctx2.fillStyle = "#F58387";
    ctx2.beginPath();
    ctx2.globalAlpha = 1.0;
    ctx2.arc(LeaderMinimapPos.x, LeaderMinimapPos.y, radius, 0, 2 * Math.PI);
    ctx2.fill();

    ctx2.fillStyle = "#F58387";
    ctx2.beginPath();
    ctx2.globalAlpha = 1;
    ctx2.arc(LeaderMinimapPos.x, LeaderMinimapPos.y, 3 * window.devicePixelRatio, 0, 2 * Math.PI);
    ctx2.fill();

    ctx2.beginPath();
    ctx2.moveTo(LeaderPlayerMinimapPos.x, LeaderPlayerMinimapPos.y);
    ctx2.lineTo(LeaderMinimapPos.x, LeaderMinimapPos.y);
    ctx2.stroke();

    ctx2.restore();
//Leader map
    const screenPos = scaling.toCanvasPos(new Vector(Leaderx, Leadery));
    const radius1 = scaling.toCanvasPos(new Vector(0, size+Leadery)).y - screenPos.y
    const Radius1 = scaling.toCanvasPos(new Vector(0, 100+Leadery)).y - screenPos.y
    ctx.save();
    //↓smallest
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#ff80bf";
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, radius1, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#B43A3F";
    ctx.stroke();
    ctx.fill();
    //↓small circle
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = "#FF000040";
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, 80, 0, 5 * Math.PI);
    ctx.fill();
    ctx.restore();
    //↓big circle
     ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#FF000020";
    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, 500, 0, 6 * Math.PI);
   ctx.fill();
    ctx.restore();
//Dead minimap
    const deadPos = new Vector(Deadx, Deady);
    const deadMinimapPos = toMinimapPosition(new Vector(Deadx, Deady));
    const DeadPlayerMinimapPos = toMinimapPosition(new Vector(player.position.x, player.position.y));
    const DeadDistance = Math.round(Vector.distance(deadPos, player.position));
    ctx2.save();

    ctx2.globalAlpha = 1;
    ctx2.fillStyle = "#00B2E1";
    ctx2.beginPath();
    ctx2.arc(deadMinimapPos.x, deadMinimapPos.y, 3 * window.devicePixelRatio, 0, 2 * Math.PI);
    ctx2.fill();
    ctx2.restore();
    ctx2.beginPath();
    ctx2.moveTo(DeadPlayerMinimapPos.x, DeadPlayerMinimapPos.y);
    ctx2.lineTo(deadMinimapPos.x, deadMinimapPos.y);

    ctx2.stroke();
//Dead map
const screenPos2 = scaling.toCanvasPos(new Vector(Deadx, Deady));
const radius2 = scaling.toCanvasPos(new Vector(0, 100+Deady)).y - screenPos2.y
    ctx.save();

    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#00B2E1";
    ctx.beginPath();
    ctx.arc(screenPos2.x, screenPos2.y, radius2, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#0085A8";
    ctx.stroke();
    ctx.fill();

    ctx.restore();
//Minimap text
    const Textarenasize = toMinimapPosition((new Vector(0, -arena.size/2)));
    ctx2.save();
    ctx2.globalAlpha = 1;
    ctx2.textAlign = "center"
    ctx2.beginPath();
    ctx2.font = "14px Ubuntu";
    ctx2.fillStyle = "#F58387";
    ctx2.fillText(`Leader Distance: ${LeaderDistance}`, Textarenasize.x, Textarenasize.y+10);
    ctx2.fillStyle = "#00B2E1";
    ctx2.fillText(`Dead distance: ${DeadDistance}`, Textarenasize.x, Textarenasize.y+19);
    ctx2.strokeStyle = "#B43A3F";
    ctx2.strokeText(`Leader Distance: ${LeaderDistance}`, Textarenasize.x, Textarenasize.y+10);
    ctx2.strokeStyle = "#0085A8";
    ctx2.strokeText(`Dead distance: ${DeadDistance}`, Textarenasize.x, Textarenasize.y+20);
    ctx2.restore();
}

window.addEventListener('keydown', (e) => {
    if(e.key == "+"){size = size + 50}
    if(e.key == "-"){size = size - 50}
    if (size<100) {size=100}
    if (size>5000) {size=5000}
    return;
});

function toMinimapPosition(vector) {
  var unscale = arena.unscale(vector);
  var minimapPos = Vector.multiply(minimap.minimapDim, unscale);
  return Vector.add(minimap.minimapPos, minimapPos);
}

function XY(){
    Deadx = player.position.x;
    Deady = player.position.y;
}

game.once('ready', () => {
    game.on('frame', () => {
        if (player.isDead) {XY()};
        if (!player.isDead) {input.set_convar('ren_minimap_viewport', true)}
        show();
    });
});
diepAPI.extensions.entityManager.load();
