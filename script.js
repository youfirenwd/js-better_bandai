(function WebdriverTorso() {
  const CANVAS_ID = "wdt-canvas";
  const BEEP_DURATION = 1.0; // seconds
  const BEEP_VOLUME = 0.2;

  // timestamp (current date/time once at startup)
  function makeTimestamp() {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    return `${YYYY}${MM}${DD}-${hh}${mm}${ss}`;
  }

  const VIDEO_DATE = makeTimestamp();
  const VIDEO_ID = String(Math.floor(Math.random() * 900000) + 100000);

  // canvas setup
  let canvas = document.getElementById(CANVAS_ID);
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = CANVAS_ID;
    document.body.appendChild(canvas);
    Object.assign(document.body.style, {
      margin: "0",
      height: "100vh",
      background: "#fff",
      overflow: "hidden",
    });
  }
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // audio setup
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = new AudioCtx();

  function playBeep() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const freq = 436 + Math.random() * (988 - 436); // random 436–988 Hz
    osc.type = "sine";
    osc.frequency.value = freq;

    gain.gain.value = BEEP_VOLUME;
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + BEEP_DURATION);
  }

  // filename generator
  let slideIndex = 0;
  function filename(idx) {
    return `Video #sftp-gcs-pkg-${VIDEO_DATE}-${VIDEO_ID} - Slide ${String(idx).padStart(4, "0")}`;
  }

  // helper to maybe draw a thin bar instead of a full rectangle
  function randomRect(x, y, w, h) {
    const thinChance = Math.random();
    if (thinChance < 0.25) {
      // thin vertical bar
      w = Math.max(4, w * 0.1);
    } else if (thinChance < 0.5) {
      // thin horizontal bar
      h = Math.max(4, h * 0.1);
    }
    return { x, y, w, h };
  }

  // draw slide
  function drawSlide(idx) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);

    // red rectangle (left)
    let rectW1 = Math.random() * (w / 2.5);
    let rectH1 = Math.random() * (h / 2);
    let rectX1 = w * 0.1;
    let rectY1 = Math.random() * (h - rectH1);
    ({ x: rectX1, y: rectY1, w: rectW1, h: rectH1 } = randomRect(rectX1, rectY1, rectW1, rectH1));

    // blue rectangle (right)
    let rectW2 = Math.random() * (w / 2.5);
    let rectH2 = Math.random() * (h / 2);
    let rectX2 = w * 0.6;
    let rectY2 = Math.random() * (h - rectH2);
    ({ x: rectX2, y: rectY2, w: rectW2, h: rectH2 } = randomRect(rectX2, rectY2, rectW2, rectH2));

    ctx.fillStyle = "red";
    ctx.fillRect(rectX1, rectY1, rectW1, rectH1);
    ctx.fillStyle = "blue";
    ctx.fillRect(rectX2, rectY2, rectW2, rectH2);

    // filename text in bold monospace (smaller, exact style)
    const fontSize = Math.floor(h * 0.025); // smaller than before
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.fillStyle = "#000";
    ctx.textBaseline = "bottom";
    ctx.fillText(filename(idx), 20, h - 15);
  }

  // loop
  function nextSlide() {
    drawSlide(slideIndex);
    playBeep();
    slideIndex++;
    setTimeout(nextSlide, BEEP_DURATION * 1000);
  }

  nextSlide();
})();
