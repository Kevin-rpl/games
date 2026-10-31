/* =====================================================
   APAKAH AKU — GAME LOGIC
   ===================================================== */

// ─── STATE ───────────────────────────────────────────
let currentPage       = 'page-home';
let currentLevel      = 'ez';
let currentQuestion   = 0;
let score             = 0;
let correctCount      = 0;
let wrongCount        = 0;
let timerInterval     = null;
let timeLeft          = 15;
let answered          = false;
let countdownTimer    = null;
let shuffledQuestions = [];  // soal yang sudah diacak

// ─── SHUFFLE ─────────────────────────────────────────
// Fisher-Yates shuffle — setiap mulai game urutannya beda
function shuffleArray(arr) {
  const a = [...arr]; // copy, jangan ubah aslinya
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── PAGE NAVIGATION ─────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.classList.add('fade-out');
  });
  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('fade-out'));
    const target = document.getElementById(pageId);
    target.classList.add('active');
    currentPage = pageId;
  }, 300);
}

// ─── LEVEL SELECTION ─────────────────────────────────
function selectLevel(level) {
  currentLevel      = level;
  currentQuestion   = 0;
  score             = 0;
  correctCount      = 0;
  wrongCount        = 0;
  shuffledQuestions = shuffleArray(GAME_CONFIG.questions); // acak soal setiap mulai

  const levelCard = document.querySelector(`.level-${level}`);
  if (levelCard) {
    levelCard.classList.add('selected');
    setTimeout(() => levelCard.classList.remove('selected'), 600);
  }

  setTimeout(() => startCountdown(), 400);
}

// ─── COUNTDOWN ───────────────────────────────────────
function startCountdown() {
  showPage('page-countdown');
  let count = 3;
  const numEl    = document.getElementById('countdown-number');
  const ringEl   = document.getElementById('countdown-ring-circle');
  const circumference = 2 * Math.PI * 85;

  ringEl.style.strokeDasharray  = circumference;
  ringEl.style.strokeDashoffset = 0;

  function tick() {
    numEl.textContent = count;
    numEl.classList.remove('countdown-pop');
    void numEl.offsetWidth;
    numEl.classList.add('countdown-pop');

    const ratio  = (count - 1) / 3;
    ringEl.style.strokeDashoffset = circumference * ratio;

    if (count === 0) {
      numEl.textContent = 'GO!';
      numEl.classList.add('countdown-go');
      clearInterval(countdownTimer);
      setTimeout(() => {
        numEl.classList.remove('countdown-go');
        startGame();
      }, 700);
      return;
    }
    count--;
  }

  tick();
  countdownTimer = setInterval(tick, 1000);
}

// ─── START GAME ───────────────────────────────────────
function startGame() {
  updateOptionLabels();
  showPage('page-game');
  loadQuestion(currentQuestion);
}

function updateOptionLabels() {
  document.getElementById('option1-text').textContent = GAME_CONFIG.option1Label;
  document.getElementById('option2-text').textContent = GAME_CONFIG.option2Label;

  const levelData = GAME_CONFIG.levels[currentLevel];
  const badge = document.getElementById('game-level-badge');
  badge.textContent = levelData.icon + ' ' + levelData.label;
  badge.className = 'game-level-badge level-badge-' + currentLevel;
}

// ─── LOAD QUESTION ────────────────────────────────────
function loadQuestion(index) {
  if (index >= shuffledQuestions.length) {
    endGame();
    return;
  }

  answered = false;
  const q = shuffledQuestions[index]; // pakai urutan yang sudah diacak

  // Update photo
  const photoEl = document.getElementById('game-photo');
  photoEl.src = '';
  photoEl.classList.remove('photo-loaded');

  photoEl.onload = () => {
    photoEl.classList.add('photo-loaded');
  };
  photoEl.onerror = () => {
    photoEl.src = generatePlaceholderSVG(index + 1);
    photoEl.classList.add('photo-loaded');
  };
  photoEl.src = q.photo;

  // Update UI
  document.getElementById('photo-number').textContent = `FOTO #${index + 1}`;
  document.getElementById('question-counter').textContent = `${index + 1} / ${shuffledQuestions.length}`;
  document.getElementById('score-display').textContent = score;

  // Progress bar
  const progressPct = (index / GAME_CONFIG.questions.length) * 100;
  document.getElementById('progress-bar').style.width = progressPct + '%';

  // Reset buttons
  const btn1 = document.getElementById('answer-btn-1');
  const btn2 = document.getElementById('answer-btn-2');
  btn1.classList.remove('correct', 'wrong', 'disabled');
  btn2.classList.remove('correct', 'wrong', 'disabled');
  btn1.disabled = false;
  btn2.disabled = false;

  // Hide feedback
  document.getElementById('feedback-overlay').classList.add('hidden');

  // Start timer
  startTimer();
}

// ─── TIMER ────────────────────────────────────────────
function startTimer() {
  clearInterval(timerInterval);
  const levelData = GAME_CONFIG.levels[currentLevel];
  timeLeft = levelData.time;

  const timerBar  = document.getElementById('timer-bar');
  const timerText = document.getElementById('timer-text');

  timerBar.style.transition = 'none';
  timerBar.style.width = '100%';
  timerBar.className = 'timer-bar';

  setTimeout(() => {
    timerBar.style.transition = `width ${levelData.time}s linear`;
    timerBar.style.width = '0%';
  }, 50);

  timerText.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = timeLeft;

    if (timeLeft <= 3) {
      timerBar.classList.add('danger');
      timerText.classList.add('timer-danger');
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) timeExpired();
    }
  }, 1000);
}

// ─── CHECK ANSWER ─────────────────────────────────────
function checkAnswer(choice) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  const q       = shuffledQuestions[currentQuestion];
  const isRight = (choice === q.correct);

  const btn1 = document.getElementById('answer-btn-1');
  const btn2 = document.getElementById('answer-btn-2');
  btn1.disabled = true;
  btn2.disabled = true;

  if (isRight) {
    score       += GAME_CONFIG.pointsPerCorrect;
    correctCount++;
    (choice === 1 ? btn1 : btn2).classList.add('correct');
    showFeedback(true);
  } else {
    (choice === 1 ? btn1 : btn2).classList.add('wrong');
    (q.correct === 1 ? btn1 : btn2).classList.add('correct');
    wrongCount++;
    showFeedback(false);
  }

  document.getElementById('score-display').textContent = score;

  setTimeout(() => {
    currentQuestion++;
    loadQuestion(currentQuestion);
  }, 1200);
}

// ─── TIME EXPIRED ─────────────────────────────────────
function timeExpired() {
  answered = true;
  wrongCount++;

  const q    = shuffledQuestions[currentQuestion];
  const btn1 = document.getElementById('answer-btn-1');
  const btn2 = document.getElementById('answer-btn-2');
  btn1.disabled = true;
  btn2.disabled = true;
  (q.correct === 1 ? btn1 : btn2).classList.add('correct');

  showFeedback(false, true);
  setTimeout(() => {
    currentQuestion++;
    loadQuestion(currentQuestion);
  }, 1200);
}

// ─── FEEDBACK ─────────────────────────────────────────
function showFeedback(correct, expired = false) {
  const overlay = document.getElementById('feedback-overlay');
  const icon    = document.getElementById('feedback-icon');
  const text    = document.getElementById('feedback-text');

  if (correct) {
    icon.textContent = '✓';
    text.textContent = '+' + GAME_CONFIG.pointsPerCorrect + ' POIN!';
    overlay.className = 'feedback-overlay feedback-correct';
  } else if (expired) {
    icon.textContent = '⏰';
    text.textContent = 'WAKTU HABIS!';
    overlay.className = 'feedback-overlay feedback-wrong';
  } else {
    icon.textContent = '✗';
    text.textContent = 'SALAH!';
    overlay.className = 'feedback-overlay feedback-wrong';
  }
}

// ─── END GAME ─────────────────────────────────────────
function endGame() {
  clearInterval(timerInterval);
  const levelData = GAME_CONFIG.levels[currentLevel];

  // Progress bar full
  document.getElementById('progress-bar').style.width = '100%';

  showPage('page-result');

  // Animate score
  const scoreEl = document.getElementById('result-score');
  animateCount(scoreEl, 0, score, 1200);

  document.getElementById('result-correct').textContent     = correctCount;
  document.getElementById('result-wrong').textContent       = wrongCount;
  document.getElementById('result-level-display').textContent = levelData.icon + ' ' + levelData.label;

  // Stars & emoji
  const ratio = score / (shuffledQuestions.length * GAME_CONFIG.pointsPerCorrect);
  let stars = '⭐', emoji = '😅', msg = 'Jangan menyerah, coba lagi!';
  if (ratio >= 0.9)      { stars = '⭐⭐⭐'; emoji = '🏆'; msg = 'LUAR BIASA! Kamu master!'; }
  else if (ratio >= 0.7) { stars = '⭐⭐'; emoji = '🎉'; msg = 'Bagus! Hampir sempurna!'; }
  else if (ratio >= 0.5) { stars = '⭐'; emoji = '😊'; msg = 'Lumayan! Terus berlatih!'; }

  document.getElementById('result-stars').textContent   = stars;
  document.getElementById('result-emoji').textContent   = emoji;
  document.getElementById('result-message').textContent = msg;
}

// ─── RESTART ──────────────────────────────────────────
function restartGame() {
  currentQuestion   = 0;
  score             = 0;
  correctCount      = 0;
  wrongCount        = 0;
  shuffledQuestions = shuffleArray(GAME_CONFIG.questions); // acak ulang saat main lagi
  startCountdown();
}

// ─── UTILITIES ────────────────────────────────────────
function animateCount(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function generatePlaceholderSVG(num) {
  const colors = ['#ff006e', '#00e5ff', '#39ff14', '#b600ff'];
  const color  = colors[(num - 1) % colors.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
    <rect width='400' height='400' fill='%23111827'/>
    <rect x='20' y='20' width='360' height='360' fill='none' stroke='${color}' stroke-width='2' stroke-dasharray='10,5'/>
    <text x='200' y='180' font-family='Orbitron,monospace' font-size='60' fill='${color}' text-anchor='middle'>🖼️</text>
    <text x='200' y='240' font-family='Orbitron,monospace' font-size='18' fill='%23ffffff' text-anchor='middle'>FOTO ${num}</text>
    <text x='200' y='270' font-family='Orbitron,monospace' font-size='12' fill='%23666' text-anchor='middle'>Taruh foto di folder /photos/</text>
  </svg>`;
  return 'data:image/svg+xml,' + svg;
}

// ─── PARTICLES ────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles-container');
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${Math.random() * 10 + 8}s;
      background: ${['#ff006e','#00e5ff','#39ff14','#b600ff'][Math.floor(Math.random() * 4)]};
    `;
    container.appendChild(p);
  }
})();
