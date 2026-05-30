const Storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // Пользователи
  getUsers() {
    return this.get('users', []);
  },

  saveUsers(users) {
    this.set('users', users);
  },

  getCurrentUser() {
    return this.get('currentUser', null);
  },

  setCurrentUser(user) {
    if (user) {
      this.set('currentUser', user);
    } else {
      this.remove('currentUser');
    }
  },

  // История просмотров 
  getHistory(userId) {
    return this.get(`history_${userId}`, []);
  },

  addToHistory(userId, paintingId) {
    const history = this.getHistory(userId);
    const exists = history.some(h => h.paintingId === paintingId);
    if (!exists) {
      history.push({ paintingId, viewedAt: new Date().toISOString() });
      this.set(`history_${userId}`, history);
    }
  },

  // Избранное 

  getFavorites(userId) {
    return this.get(`favorites_${userId}`, []);
  },

  toggleFavorite(userId, paintingId) {
    const favs = this.getFavorites(userId);
    const idx = favs.indexOf(paintingId);
    if (idx === -1) {
      favs.push(paintingId);
      this.set(`favorites_${userId}`, favs);
      return true; // добавлено
    } else {
      favs.splice(idx, 1);
      this.set(`favorites_${userId}`, favs);
      return false; // удалено
    }
  },

  isFavorite(userId, paintingId) {
    return this.getFavorites(userId).includes(paintingId);
  }
};
