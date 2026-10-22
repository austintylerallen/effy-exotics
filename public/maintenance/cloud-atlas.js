// Native WebGL adapter for the user-supplied React Bits Pro Cloud Atlas shader.
// Autonomous smoke with a location-triggered outward clearing wave; no pointer input.
import { fragmentShader } from './cloud-shader.js?v=smoke-clear-v6';

const canvas = document.querySelector('#clouds');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const connection = navigator.connection;
let frame = 0;
let disposed = false;
let cleanup = () => {};
function cloudState(state) {
  canvas.dataset.cloudReady=state==='ready'?'true':'false';
  document.documentElement.dataset.cloudState=state;
  window.dispatchEvent(new CustomEvent('effy-cloud-state',{detail:state}));
}

try {
  const gl = canvas.getContext('webgl', {alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
  if (!gl) throw new Error('WebGL unavailable');
  const shaders = [];
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Cloud shader unavailable');
    return shader;
  };
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  cleanup = () => {
    disposed = true;
    cancelAnimationFrame(frame);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program); shaders.forEach(shader => gl.deleteShader(shader));
  };
  gl.attachShader(program, compile(gl.VERTEX_SHADER, 'attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}'));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Cloud program unavailable');
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const names = ['uResolution','uTime','uFlow','uWind','uSky','uLight','uShade','uTransparent','uTop','uCeiling','uFadeStart','uCoverage','uDensity','uScale','uRise','uDip','uOpacity','uSeed','uClear'];
  const u = Object.fromEntries(names.map(name=>[name,gl.getUniformLocation(program,name)]));
  const floats = {uTransparent:0,uTop:0,uCeiling:2,uFadeStart:1.5,uCoverage:.85,uDensity:.52,uScale:5.8,uRise:.35,uDip:.06,uOpacity:.95,uSeed:2.1,uClear:0};
  for (const [name,value] of Object.entries(floats)) gl.uniform1f(u[name],value);
  gl.uniform3f(u.uSky,5/255,12/255,8/255);
  gl.uniform3f(u.uLight,164/255,141/255,77/255);
  gl.uniform3f(u.uShade,15/255,39/255,25/255);
  let time=12, last=0, clearing=0;
  const staticMotion = () => reduced.matches || connection?.saveData;
  function size() {
    if (disposed) return;
    const ratio=Math.min(.45,720/innerWidth);
    canvas.width=Math.max(1,Math.round(innerWidth*ratio));
    canvas.height=Math.max(1,Math.round(innerHeight*ratio));
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.uniform2f(u.uResolution,canvas.width,canvas.height);
    if (staticMotion()) draw(0);
  }
  function draw(dt) {
    time+=dt*.42*(1+8*clearing);
    gl.uniform1f(u.uTime,time); gl.uniform1f(u.uFlow,time*.65); gl.uniform1f(u.uWind,time*.025);
    gl.uniform1f(u.uClear,clearing);
    gl.drawArrays(gl.TRIANGLES,0,6);
  }
  function tick(now) {
    frame=0;
    if (disposed || document.hidden || staticMotion()) return;
    if (!last || now-last>=32) { draw(last?Math.min((now-last)/1000,.08):0); last=now; }
    frame=requestAnimationFrame(tick);
  }
  function resume() {
    if (disposed) return;
    cancelAnimationFrame(frame); frame=0; last=0;
    if (!document.hidden) { draw(0); if (!staticMotion()) frame=requestAnimationFrame(tick); }
  }
  const clearSmoke = event => {
    clearing=Math.max(0,Math.min(1,Number(event.detail)||0));
    if (!disposed) draw(0);
  };
  window.addEventListener('resize',size);
  window.addEventListener('effy-smoke-clear',clearSmoke);
  document.addEventListener('visibilitychange',resume);
  reduced.addEventListener('change',resume);
  connection?.addEventListener?.('change',resume);
  const release=cleanup;
  cleanup=()=>{
    window.removeEventListener('resize',size);
    window.removeEventListener('effy-smoke-clear',clearSmoke);
    document.removeEventListener('visibilitychange',resume);
    reduced.removeEventListener('change',resume); connection?.removeEventListener?.('change',resume);
    release();
  };
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();cleanup();canvas.hidden=true;cloudState('fallback');},{once:true});
  window.addEventListener('pagehide',event=>{if(!event.persisted) cleanup();},{once:true});
  window.addEventListener('pageshow',event=>{if(event.persisted) resume();});
  size(); resume();
  cloudState('ready');
} catch {
  cleanup();
  canvas.hidden=true;
  cloudState('fallback');
  // A visible SVG cloud field remains if WebGL is unavailable or lost.
}
