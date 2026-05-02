// app.js — సినిమా క్రమం Game Logic

// ── State ──────────────────────────────────────────────────────────
const TODAY_IDX = Math.floor(Date.now() / 86400000);
const PUZZLE_IDX = TODAY_IDX % PUZZLES.length;
const movies = PUZZLES[PUZZLE_IDX];
const correctOrder = [...movies].sort((a, b) => a.year - b.year);

let slotMap = { 0: null, 1: null, 2: null };
let dragSrc = null;
let gameOver = false;
let timerInterval = null;
let elapsedMs = 0;
let finalMs = 0;

// ── Storage helpers ─────────────────────────────────────────────────
function saveState(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

function loadState(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}

// ── Formatting ──────────────────────────────────────────────────────
function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const tenth = Math.floor((ms % 1000) / 100);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${tenth}`;
}

function formatTimeShort(ms) {
  if (!ms) return '—';
  return formatTime(ms);
}

// ── Shuffle ─────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Chip creation ───────────────────────────────────────────────────
function createChip(movie) {
  const el = document.createElement('div');
  el.className = 'movie-chip';
  el.draggable = true;
  el.dataset.id = movie.name;
  el.innerHTML = `
    <div class="chip-name">${movie.name}</div>
    <div class="chip-director">dir. ${movie.director}</div>
  `;

  // Desktop drag
  el.addEventListener('dragstart', e => {
    dragSrc = el;
    el.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', movie.name);
  });
  el.addEventListener('dragend', () => el.classList.remove('dragging'));

  // Mobile touch drag
  el.addEventListener('touchstart', onTouchStart, { passive: true });
  el.addEventListener('touchmove', onTouchMove, { passive: false });
  el.addEventListener('touchend', onTouchEnd);

  return el;
}

// ── Desktop Drag & Drop ─────────────────────────────────────────────
document.querySelectorAll('.slot').forEach(slot => {
  slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
  slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
  slot.addEventListener('drop', e => handleDrop(e, slot));
});

document.getElementById('pool').addEventListener('dragover', e => {
  e.preventDefault();
  document.getElementById('pool').classList.add('drag-over');
});
document.getElementById('pool').addEventListener('dragleave', () => {
  document.getElementById('pool').classList.remove('drag-over');
});
document.getElementById('pool').addEventListener('drop', e => handleDrop(e, document.getElementById('pool')));

function handleDrop(e, target) {
  e.preventDefault();
  target.classList.remove('drag-over');
  if (!dragSrc) return;

  const name = e.dataTransfer.getData('text/plain');
  const movie = movies.find(m => m.name === name);
  if (!movie) return;

  const pool = document.getElementById('pool');

  if (target === pool) {
    // Return chip to pool
    for (const key in slotMap) {
      if (slotMap[key]?.name === name) {
        slotMap[key] = null;
        resetSlot(key);
      }
    }
    pool.appendChild(dragSrc);
  } else {
    const slotId = target.dataset.slot;
    const existing = slotMap[slotId];

    // Remove from previous slot if it was in one
    for (const key in slotMap) {
      if (slotMap[key]?.name === name && key !== slotId) {
        slotMap[key] = null;
        resetSlot(key);
      }
    }

    // Swap or place
    if (existing) {
      pool.appendChild(createChip(existing));
    } else {
      const inPool = pool.querySelector(`[data-id="${CSS.escape(name)}"]`);
      if (inPool) pool.removeChild(inPool);
    }

    slotMap[slotId] = movie;
    target.innerHTML = `<span class="slot-num">${['1st', '2nd', '3rd'][slotId]}</span>`;
    target.appendChild(createChip(movie));
    target.classList.add('filled');
  }

  updateSubmitBtn();
}

function resetSlot(key) {
  const slot = document.getElementById(`slot-${key}`);
  slot.innerHTML = `<span class="slot-num">${['1st', '2nd', '3rd'][key]}</span>`;
  slot.classList.remove('filled');
}

function updateSubmitBtn() {
  const allFilled = Object.values(slotMap).every(v => v !== null);
  document.getElementById('submitBtn').disabled = !allFilled;
}

// ── Mobile Touch Drag ────────────────────────────────────────────────
let touchChip = null;
let touchClone = null;
let touchOffX = 0;
let touchOffY = 0;

function onTouchStart(e) {
  touchChip = e.currentTarget;
  const touch = e.touches[0];
  const rect = touchChip.getBoundingClientRect();
  touchOffX = touch.clientX - rect.left;
  touchOffY = touch.clientY - rect.top;

  touchClone = touchChip.cloneNode(true);
  touchClone.style.cssText = `
    position: fixed; z-index: 9999; pointer-events: none;
    width: ${rect.width}px; opacity: 0.85;
    left: ${touch.clientX - touchOffX}px;
    top: ${touch.clientY - touchOffY}px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  `;
  document.body.appendChild(touchClone);
  touchChip.style.opacity = '0.3';
}

function onTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  if (touchClone) {
    touchClone.style.left = `${touch.clientX - touchOffX}px`;
    touchClone.style.top = `${touch.clientY - touchOffY}px`;
  }
  // Highlight drop target
  document.querySelectorAll('.slot, .pool').forEach(el => el.classList.remove('drag-over'));
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropTarget = el?.closest('.slot, .pool');
  if (dropTarget) dropTarget.classList.add('drag-over');
}

function onTouchEnd(e) {
  const touch = e.changedTouches[0];
  if (touchClone) { document.body.removeChild(touchClone); touchClone = null; }
  if (touchChip) touchChip.style.opacity = '';

  document.querySelectorAll('.slot, .pool').forEach(el => el.classList.remove('drag-over'));

  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropTarget = el?.closest('.slot, #pool');
  if (!dropTarget || !touchChip) return;

  const name = touchChip.dataset.id;
  const movie = movies.find(m => m.name === name);
  if (!movie) return;

  const pool = document.getElementById('pool');

  if (dropTarget === pool || dropTarget.id === 'pool') {
    for (const key in slotMap) {
      if (slotMap[key]?.name === name) {
        slotMap[key] = null;
        resetSlot(key);
      }
    }
    // Only add back if not already in pool
    if (!pool.querySelector(`[data-id="${CSS.escape(name)}"]`)) {
      pool.appendChild(createChip(movie));
    }
  } else {
    const slotId = dropTarget.dataset.slot;
    if (slotId === undefined) return;
    const existing = slotMap[slotId];

    for (const key in slotMap) {
      if (slotMap[key]?.name === name && key !== slotId) {
        slotMap[key] = null;
        resetSlot(key);
      }
    }

    if (existing) {
      pool.appendChild(createChip(existing));
    } else {
      const inPool = pool.querySelector(`[data-id="${CSS.escape(name)}"]`);
      if (inPool) pool.removeChild(inPool);
    }

    slotMap[slotId] = movie;
    dropTarget.innerHTML = `<span class="slot-num">${['1st', '2nd', '3rd'][slotId]}</span>`;
    dropTarget.appendChild(createChip(movie));
    dropTarget.classList.add('filled');
  }

  touchChip = null;
  updateSubmitBtn();
}

// ── Timer ────────────────────────────────────────────────────────────
function startTimer() {
  const startTime = Date.now();
  timerInterval = setInterval(() => {
    elapsedMs = Date.now() - startTime;
    document.getElementById('timerDisplay').textContent = formatTime(elapsedMs);
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
  finalMs = elapsedMs;
  const disp = document.getElementById('timerDisplay');
  disp.textContent = formatTime(finalMs);
  if (finalMs < 15000) disp.classList.add('done-fast');
  else if (finalMs > 45000) disp.classList.add('done-slow');
  document.getElementById('timerNote').textContent = 'finished';
}

// ── Game Start ────────────────────────────────────────────────────────
document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('readyScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';

  const pool = document.getElementById('pool');
  shuffle(movies).forEach(m => pool.appendChild(createChip(m)));

  startTimer();
});

// ── Submit Answer ─────────────────────────────────────────────────────
document.getElementById('submitBtn').addEventListener('click', () => {
  if (gameOver) return;
  gameOver = true;
  stopTimer();

  const userOrder = [slotMap[0], slotMap[1], slotMap[2]];
  const correct = userOrder.every((m, i) => m?.name === correctOrder[i].name);
  const partialCount = userOrder.filter((m, i) => m?.name === correctOrder[i].name).length;

  // Save result
  const result = {
    date: TODAY_IDX,
    correct,
    partialCount,
    timeMs: finalMs,
    puzzleIdx: PUZZLE_IDX,
  };
  saveResult(result);

  // Show result UI
  document.getElementById('submitBtn').style.display = 'none';
  const rb = document.getElementById('resultBox');
  rb.style.display = 'block';

  document.getElementById('resultEmoji').textContent =
    correct ? '🎉' : partialCount === 2 ? '👏' : '😅';
  document.getElementById('resultTitle').textContent =
    correct ? 'Perfect order!' : partialCount === 2 ? 'So close!' : 'Not quite!';
  document.getElementById('resultSub').textContent = correct
    ? 'You nailed the chronological order!'
    : `Correct order: ${correctOrder.map(m => m.name).join(' → ')}`;

  document.getElementById('finalTime').textContent = formatTime(finalMs);
  document.getElementById('finalRank').textContent = correct ? '#1 today' : '—';

  // Answer chips
  const ar = document.getElementById('answerRow');
  correctOrder.forEach((m, i) => {
    const isRight = userOrder[i]?.name === m.name;
    const chip = document.createElement('div');
    chip.className = `answer-chip ${isRight ? 'correct' : 'wrong'}`;
    chip.innerHTML = `<div class="answer-name">${m.name}</div><div class="answer-year">${m.year}</div>`;
    ar.appendChild(chip);
  });

  // Share blocks
  const sb = document.getElementById('shareBlocks');
  userOrder.forEach((m, i) => {
    const b = document.createElement('div');
    b.className = `share-block ${m?.name === correctOrder[i].name ? 'correct' : 'wrong'}`;
    sb.appendChild(b);
  });

  // Lock board
  document.querySelectorAll('.slot').forEach(s => s.style.pointerEvents = 'none');
  document.getElementById('pool').style.pointerEvents = 'none';

  // Update stats UI
  renderStats();
  renderLeaderboard();
});

// ── Share ─────────────────────────────────────────────────────────────
document.getElementById('shareBtn').addEventListener('click', () => {
  const userOrder = [slotMap[0], slotMap[1], slotMap[2]];
  const blocks = userOrder.map((m, i) =>
    m?.name === correctOrder[i].name ? '🟩' : '🟥'
  ).join('');
  const text = `సినిమా క్రమం #${PUZZLE_IDX + 1}\n${blocks} ${formatTime(finalMs)}\nPlay at: ${window.location.href}`;
  if (navigator.share) {
    navigator.share({ title: 'సినిమా క్రమం', text });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('shareBtn');
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Share result', 2000);
    });
  }
});

document.getElementById('copyLinkBtn').addEventListener('click', () => {
  navigator.clipboard?.writeText(window.location.href).then(() => {
    const btn = document.getElementById('copyLinkBtn');
    btn.textContent = 'Link copied!';
    setTimeout(() => btn.textContent = 'Copy game link', 2000);
  });
});

// ── Persist Results ──────────────────────────────────────────────────
function saveResult(result) {
  const history = loadState('cinemaa_history') || [];
  const existing = history.findIndex(r => r.date === result.date);
  if (existing >= 0) history[existing] = result;
  else history.push(result);
  // Keep last 90 days
  const trimmed = history.slice(-90);
  saveState('cinemaa_history', trimmed);
  saveState('cinemaa_streak', calcStreak(trimmed));
}

function calcStreak(history) {
  let streak = 0;
  let day = TODAY_IDX;
  while (true) {
    const found = history.find(r => r.date === day);
    if (found) { streak++; day--; }
    else break;
  }
  return streak;
}

// ── Stats rendering ───────────────────────────────────────────────────
function renderStats() {
  const history = loadState('cinemaa_history') || [];
  const streak = loadState('cinemaa_streak') || 0;
  const played = history.length;
  const wins = history.filter(r => r.correct).length;
  const winPct = played ? Math.round((wins / played) * 100) : 0;
  const times = history.filter(r => r.correct && r.timeMs).map(r => r.timeMs);
  const best = times.length ? Math.min(...times) : null;
  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;

  document.getElementById('statPlayed').textContent = played;
  document.getElementById('statWin').textContent = `${winPct}%`;
  document.getElementById('statStreak').textContent = streak;
  document.getElementById('statBest').textContent = best ? formatTime(best) : '—';
  document.getElementById('statAvg').textContent = avg ? formatTime(avg) : '—';
  document.getElementById('streakCount').textContent = streak;

  const rb = document.getElementById('recentBlocks');
  rb.innerHTML = '';
  history.slice(-14).forEach(r => {
    const b = document.createElement('div');
    b.className = `recent-block ${r.correct ? 'correct' : 'wrong'}`;
    rb.appendChild(b);
  });
}

// ── Leaderboard (demo — replace with real backend) ────────────────────
function renderLeaderboard() {
  const history = loadState('cinemaa_history') || [];
  const todayResult = history.find(r => r.date === TODAY_IDX);

  const demoFriends = [
    { name: 'Ravi Kumar', initials: 'RK', color: '#C9972A', bg: '#C9972A22', correct: true, timeMs: 8300 },
    { name: 'Sravya R', initials: 'SR', color: '#27a845', bg: '#27a84522', correct: true, timeMs: 14700 },
    { name: 'Anil M', initials: 'AM', color: '#D4537E', bg: '#D4537E22', correct: false, timeMs: 31200 },
    { name: 'Kavitha P', initials: 'KP', color: '#639922', bg: '#63992222', correct: null, timeMs: null },
  ];

  const you = {
    name: 'You',
    initials: 'You',
    color: '#378ADD',
    bg: '#378ADD22',
    correct: todayResult?.correct ?? null,
    timeMs: todayResult?.timeMs ?? null,
    isYou: true,
  };

  const all = [...demoFriends, you];

  // Sort: correct first, then by time
  all.sort((a, b) => {
    if (a.correct && !b.correct) return -1;
    if (!a.correct && b.correct) return 1;
    if (a.correct && b.correct) return (a.timeMs || 999999) - (b.timeMs || 999999);
    if (a.correct === null && b.correct !== null) return 1;
    if (b.correct === null && a.correct !== null) return -1;
    return 0;
  });

  const lb = document.getElementById('leaderboardList');
  lb.innerHTML = '';

  all.forEach((p, i) => {
    const isTop = p.correct && i < 3;
    const row = document.createElement('div');
    row.className = 'lb-row';
    const rankColor = i === 0 ? 'gold' : '';
    const timeClass = isTop ? 'best' : p.isYou ? 'you' : '';
    const resultIcon = p.correct === null ? '—' : p.correct ? '✓' : '✗';
    const resultClass = p.correct === null ? 'pending' : p.correct ? 'correct' : 'wrong';
    row.innerHTML = `
      <span class="lb-rank ${rankColor}">${p.correct !== null ? i + 1 : '—'}</span>
      <div class="lb-avatar" style="background:${p.bg};color:${p.color}">${p.initials}</div>
      <span class="lb-name ${p.isYou ? 'you' : ''}">${p.name}</span>
      <span class="lb-result ${resultClass}">${resultIcon}</span>
      <span class="lb-time ${timeClass}">${p.timeMs ? formatTime(p.timeMs) : p.correct === null ? 'waiting...' : '—'}</span>
    `;
    lb.appendChild(row);
  });
}

// ── Check if already played ───────────────────────────────────────────
function checkAlreadyPlayed() {
  const history = loadState('cinemaa_history') || [];
  const todayResult = history.find(r => r.date === TODAY_IDX);
  if (!todayResult) return false;

  const movies3 = PUZZLES[todayResult.puzzleIdx] || PUZZLES[PUZZLE_IDX];
  const correct3 = [...movies3].sort((a, b) => a.year - b.year);

  document.getElementById('readyScreen').style.display = 'none';
  document.getElementById('alreadyPlayed').style.display = 'block';

  const sub = document.getElementById('apSub');
  if (todayResult.correct) {
    sub.textContent = `You got it right in ${formatTime(todayResult.timeMs)}! Come back tomorrow.`;
  } else {
    sub.textContent = `Today's answer was: ${correct3.map(m => m.name).join(' → ')}. Better luck tomorrow!`;
  }

  return true;
}

// ── Countdown ─────────────────────────────────────────────────────────
function updateCountdown() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  const diff = tomorrow - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const str = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  document.getElementById('footerCountdown').textContent = str;
  const ap = document.getElementById('apCountdown');
  if (ap) ap.textContent = str;
}

// ── Suggest Form ──────────────────────────────────────────────────────
function livePreview() {
  const s1 = { name: document.getElementById('s1name').value.trim(), year: parseInt(document.getElementById('s1year').value) };
  const s2 = { name: document.getElementById('s2name').value.trim(), year: parseInt(document.getElementById('s2year').value) };
  const s3 = { name: document.getElementById('s3name').value.trim(), year: parseInt(document.getElementById('s3year').value) };
  const filled = [s1, s2, s3].filter(x => x.name && x.year && !isNaN(x.year));
  const prev = document.getElementById('suggestPreview');
  if (filled.length < 2) { prev.style.display = 'none'; return; }
  const sorted = [...filled].sort((a, b) => a.year - b.year);
  prev.style.display = 'block';
  document.getElementById('suggestPreviewContent').innerHTML =
    sorted.map((x, i) => `<span style="color:#aaa;font-size:12px">${i + 1}.</span> ${x.name} <span style="font-family:var(--mono);font-size:11px;color:#aaa">(${x.year})</span>`).join(' → ');
}

['s1name', 's1year', 's2name', 's2year', 's3name', 's3year'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', livePreview);
});

document.getElementById('subSubmitBtn').addEventListener('click', () => {
  const m = [
    { name: document.getElementById('s1name').value.trim(), director: document.getElementById('s1dir').value.trim(), year: parseInt(document.getElementById('s1year').value) },
    { name: document.getElementById('s2name').value.trim(), director: document.getElementById('s2dir').value.trim(), year: parseInt(document.getElementById('s2year').value) },
    { name: document.getElementById('s3name').value.trim(), director: document.getElementById('s3dir').value.trim(), year: parseInt(document.getElementById('s3year').value) },
  ];
  const err = document.getElementById('subError');

  if (!m[0].name || !m[1].name || !m[2].name || !m[0].year || !m[1].year || !m[2].year) {
    err.textContent = 'Please fill in all three movie titles and release years.';
    err.style.display = 'block'; return;
  }
  if (m[0].year === m[1].year || m[1].year === m[2].year || m[0].year === m[2].year) {
    err.textContent = 'All three movies must have different release years.';
    err.style.display = 'block'; return;
  }
  err.style.display = 'none';

  // In production: POST to your backend / Google Form / Supabase
  console.log('Submission:', {
    name: document.getElementById('subName').value,
    email: document.getElementById('subEmail').value,
    note: document.getElementById('subNote').value,
    movies: m,
  });

  document.querySelector('.suggest-intro').closest('.section').querySelectorAll('.form-group, #subSubmitBtn, .suggest-preview').forEach(el => el.style.display = 'none');
  document.getElementById('successBox').style.display = 'block';
});

// ── Tab switching ─────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  });
});

// ── Init ──────────────────────────────────────────────────────────────
document.getElementById('readyPuzzleNum').textContent = `Puzzle #${PUZZLE_IDX + 1}`;

renderStats();
renderLeaderboard();

if (!checkAlreadyPlayed()) {
  // Fresh game — ready to play
}

updateCountdown();
setInterval(updateCountdown, 1000);
