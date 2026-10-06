const fs=require('fs'),vm=require('vm'),assert=require('assert');
const s=fs.readFileSync(require('path').join(__dirname,'../src/game.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(s);
function fn(name){const start=s.indexOf('function '+name+'('),body=s.indexOf('{',start);let depth=1,i=body+1;while(depth&&i<s.length){if(s[i]==='{')depth++;if(s[i]==='}')depth--;i++}return s.slice(start,i)}
vm.runInThisContext(['angleDelta','overlap','interpolatePose','sweptCollision'].map(fn).join('\n'));
const id={};assert(sweptCollision([-80,0,0],[80,0,0],[{id,pose:[0,0,0]}],[{id,pose:[0,0,0]}]),'Swept collision cannot tunnel');
assert(!sweptCollision([-80,45,0],[80,45,0],[{id,pose:[0,0,0]}],[{id,pose:[0,0,0]}]),'Separate lanes must not collide');
assert(sweptCollision([0,0,0],[0,0,0],[{id,pose:[0,-80,Math.PI/2]}],[{id,pose:[0,80,Math.PI/2]}]),'Moving car hits stopped player');
assert(overlap([0,0,0],[0,15,0]),'Side contact');
const c={};vm.createContext(c);vm.runInContext(`let running=true,current={t:{kind:'merge',title:'merge'},entryIndex:100},track=Array(230),trackIndex=150;${fn('nearJunction')};this.visible=()=>nearJunction();this.index=i=>trackIndex=i;`,c);
for(const i of [25,100,170,220]){c.index(i);assert(c.visible(),'Merge map should show at '+i)}c.index(225);assert(!c.visible(),'Merge map must hide after merge');
vm.runInContext(`let crashState=null,pose=[],lives=0,history=[],sceneFault=false,speed=50,wheel=.1,steer=0,simTime=1,feedbackUntil=0,driveState={},overCount=0;
const $=()=>({textContent:''}),resetStability=()=>{},clearKeys=()=>{},controls=()=>{},hud=()=>{},draw=()=>{},gameOver=()=>{running=false;overCount++};${fn('registerCrash')}
this.hit=()=>registerCrash({player:[0,0,0]});this.resetImpact=()=>crashState=null;this.state=()=>({lives,speed,overCount,running});`,c);
for(let i=1;i<=5;i++){c.hit();assert.equal(c.state().lives,i);assert.equal(c.state().speed,0);c.hit();assert.equal(c.state().lives,i,'One penalty per impact');if(i<5)c.resetImpact()}
assert.equal(c.state().overCount,1);assert.equal(c.state().running,false);
console.log('PASS: syntax, fast pass-through collision, side contact, moving traffic hitting parked car, no adjacent-lane false hit, merge-map window, one strike per impact, stop at exactly five.');
