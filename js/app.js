function getTodayPainting() {
  const today = new Date().toISOString().split('T')[0];
  const painting = paintings.find(p => p.showDate === today);
  return painting || paintings[0];
}

function getViewHistory(userId) {
  const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
  return history.filter(h => h.userId === userId);
}

function saveToHistory(userId, paintingId) {
  const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
  const exists = history.find(h => h.userId === userId && h.paintingId === paintingId);
  if (!exists) {
    history.push({
      id: Date.now(),
      userId,
      paintingId,
      viewedAt: new Date().toISOString()
    });
    localStorage.setItem('viewHistory', JSON.stringify(history));
  }
}

function getPaintingById(id) {
  return paintings.find(p => p.id === id);
}

function updateNav() {
  const user = getCurrentUser();
  const navAuth = document.getElementById('nav-auth');
  const navUser = document.getElementById('nav-user');
  if (!navAuth || !navUser) return;
  if (user) {
    navAuth.style.display = 'none';
    navUser.style.display = 'flex';
    const nameEl = document.getElementById('nav-username');
    if (nameEl) nameEl.textContent = user.username;
  } else {
    navAuth.style.display = 'flex';
    navUser.style.display = 'none';
  }
}