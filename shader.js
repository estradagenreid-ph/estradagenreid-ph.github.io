// A single-pass procedural field: domain-warped fBM, contour SDFs, and interference.
// No textures, framework, ray marching, or post-processing passes are required.
(() => {
  const canvas = document.getElementById('shader-canvas');
  if (!canvas) return;
  const ambient = document.querySelector('.ambient-field');
  const journey = document.querySelector('.visual-journey');
  const journeyButton = journey.querySelector('button');
  const chapters = [
    { element: document.querySelector('.hero'), mode: 0, strength: .4, speed: .55, opacity: 0 },
    { element: document.getElementById('featured'), mode: 2, strength: .3, speed: .3, opacity: .1 },
    { element: document.getElementById('work'), mode: 0, label: 'Work · Flow', strength: .4, speed: .55, opacity: .12 },
    { element: document.getElementById('games'), mode: 1, label: 'Game Development · Terrain', strength: .7, speed: .65, opacity: .32 },
    { element: document.getElementById('research'), mode: 2, label: 'Research · Signal', strength: .4, speed: .35, opacity: .12 },
    { element: document.getElementById('approach'), mode: 0, label: 'Approach · Flow', strength: .3, speed: .3, opacity: .1 },
    { element: document.getElementById('experience'), mode: 0, label: 'Experience · Steady flow', strength: .15, speed: .18, opacity: .08 },
    { element: document.getElementById('contact'), mode: 0, label: 'Contact · Calm', strength: .05, speed: .08, opacity: .14 }
  ];
  let chapter = 0, chapterFrame = 0, speed = 1;
  let weights = [1, 0, 0], targetWeights = [1, 0, 0];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let gl, program, buffer, uniforms;
  let frame = 0, last = 0, elapsed = 0, visible = false, paused = false, lost = false;
  let mode = 0, intensity = .5, pointer = [.5, .5], savedTime = 0;
  const vertex = `attribute vec2 position;
    void main(){gl_Position=vec4(position,0.0,1.0);}`;
  const fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec2 resolution;
    uniform vec2 pointer;
    uniform float time;
    uniform vec3 weights;
    uniform float intensity;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
    }
    float fbm(vec2 p){
      float v=0.,a=.5;mat2 rot=mat2(.8,-.6,.6,.8);
      for(int i=0;i<4;i++){v+=a*noise(p);p=rot*p*2.03+vec2(3.1,1.7);a*=.5;}
      return v;
    }
    float contourLine(float distance){
      #ifdef USE_DERIVATIVES
      float width=max(fwidth(distance)*1.15,.025);
      #else
      float width=.05;
      #endif
      return 1.-smoothstep(.025,.025+width,distance);
    }
    void main(){
      vec2 uv=gl_FragCoord.xy/resolution;
      vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.)*3.;
      p+=(pointer-.5)*.7;
      float t=time*.09;
      vec2 warp=vec2(fbm(p+vec2(t,0.)),fbm(p+vec2(4.2,-t)));
      float field=fbm(p+(1.1+intensity)*warp+vec2(0.,t));
      float bands=abs(sin(field*37.+p.x*1.4-t));
      float contour=contourLine(bands);
      float halo=exp(-abs(field-.52)*13.);
      vec3 dark=vec3(.055,.14,.115), ink=vec3(.36,.63,.42), light=vec3(.74,.92,.48);
      float strength=.12+field*.4+halo*.15;
      vec3 flow=mix(dark,ink,strength)+light*contour*(.28+intensity*.28);
      float ridge=sin(length(p+warp*.5)*7.-field*8.+t);
      vec3 terrain=mix(dark,vec3(.44,.62,.35),.12+field*.35)+vec3(.81,.83,.51)*contourLine(abs(ridge))*(.28+intensity*.28);
      float wave=sin(p.x*6.+warp.x*4.+t)*cos(p.y*5.-warp.y*3.-t);
      vec3 signal=mix(dark,vec3(.31,.52,.73),.1+abs(wave)*.19+halo*.2)+vec3(.66,.53,.88)*contourLine(abs(wave))*(.28+intensity*.28);
      vec3 color=flow*weights.x+terrain*weights.y+signal*weights.z;
      float vignette=1.-smoothstep(.35,.95,length(uv-.5));
      color*=.7+.3*vignette;
      gl_FragColor=vec4(color,1.);
    }`;
  function fallback() {
    cancelAnimationFrame(frame); frame = 0;
    canvas.hidden = true;
    journey.hidden = true;
    ambient.dataset.renderer = 'static';
  }
  function compile(type, source) {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader); throw new Error('Shader compilation unavailable');
    }
    return shader;
  }
  function initialize() {
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
      if (!gl) { fallback(); return false; }
      const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, (gl.getExtension('OES_standard_derivatives') ? '#extension GL_OES_standard_derivatives : enable\n#define USE_DERIVATIVES\n' : '') + fragment);
      program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
      gl.deleteShader(vs); gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader linking unavailable');
      gl.useProgram(program);
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      uniforms = Object.fromEntries(['resolution','pointer','time','weights','intensity'].map(name => [name, gl.getUniformLocation(program, name)]));
      canvas.hidden = false;
      ambient.dataset.renderer = 'webgl';
      journey.hidden = chapter === 0;
      return true;
    } catch { fallback(); return false; }
  }
  function stopped() { return paused || preference.matches || !visible || document.hidden || document.body.classList.contains('dialog-open') || lost; }
  function draw() {
    if (!program || lost || !visible || ambient.dataset.renderer !== 'webgl') return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, pointer[0], pointer[1]);
    gl.uniform1f(uniforms.time, elapsed / 1000); gl.uniform3fv(uniforms.weights, weights); gl.uniform1f(uniforms.intensity, intensity);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function loop(timestamp) {
    frame = 0;
    if (stopped()) { last = 0; return; }
    // Cap at 30fps; no catch-up work after a hidden tab or long frame.
    if (!last || timestamp - last >= 1000 / 30) {
      const delta = last ? Math.min(timestamp - last, 80) : 33;
      elapsed += delta * speed;
      const blend = 1 - Math.exp(-delta / 550);
      weights = weights.map((value, i) => value + (targetWeights[i] - value) * blend);
      last = timestamp; draw();
    }
    frame = requestAnimationFrame(loop);
  }
  function sync() {
    journeyButton.disabled = preference.matches;
    journeyButton.textContent = preference.matches ? 'Reduced motion' : paused ? 'Resume background' : 'Pause background';
    journeyButton.setAttribute('aria-pressed', String(paused || preference.matches));
    if (stopped()) { cancelAnimationFrame(frame); frame = 0; last = 0; draw(); }
    else if (!frame && ambient.dataset.renderer === 'webgl') frame = requestAnimationFrame(loop);
  }
  function resize() {
    if (canvas.hidden) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 1.25, 800 / Math.max(rect.width, 1), 520 / Math.max(rect.height, 1));
    canvas.width = Math.max(1, Math.round(rect.width * ratio)); canvas.height = Math.max(1, Math.round(rect.height * ratio));
    draw();
  }
  if (!initialize()) return;
  function selectMode(value) {
    mode = value; targetWeights = [0, 1, 2].map(i => i === mode ? 1 : 0);
    if (stopped()) weights = [...targetWeights];
  }
  function updateChapter() {
    chapterFrame = 0;
    // Read layout once per scroll frame. The upper third of the viewport is the reading position.
    const readingLine = innerHeight * .32;
    let next = 0;
    chapters.forEach((item, i) => { if (item.element.getBoundingClientRect().top <= readingLine) next = i; });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) next = chapters.length - 1;
    if (next === chapter) return;
    chapter = next;
    const state = chapters[chapter];
    document.body.dataset.visualChapter = state.element.id || 'intro';
    document.body.style.setProperty('--field-opacity', state.opacity);
    journey.hidden = chapter === 0 || ambient.dataset.renderer !== 'webgl';
    visible = chapter > 0; speed = state.speed; intensity = state.strength;
    selectMode(state.mode); resize(); sync();
  }
  const scheduleChapter = () => { if (!chapterFrame) chapterFrame = requestAnimationFrame(updateChapter); };
  window.addEventListener('scroll', scheduleChapter, { passive: true });
  window.addEventListener('resize', scheduleChapter, { passive: true });
  // Filters and expandable project details alter section positions without scrolling.
  if ('ResizeObserver' in window) new ResizeObserver(scheduleChapter).observe(document.querySelector('main'));
  journeyButton.addEventListener('click', () => { paused = !paused; sync(); });
  preference.addEventListener('change', sync); document.addEventListener('visibilitychange', sync); document.addEventListener('portfolio:dialog', sync);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; savedTime = elapsed; fallback(); });
  canvas.addEventListener('webglcontextrestored', () => { lost = false; elapsed = savedTime; if (initialize()) { resize(); sync(); } });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize', resize);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); cancelAnimationFrame(chapterFrame); frame = 0; chapterFrame = 0; last = 0; });
  window.addEventListener('pageshow', () => { updateChapter(); sync(); });
  resize(); updateChapter(); sync();
})();
