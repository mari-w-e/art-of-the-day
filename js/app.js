const App = {
  _imageCache: {}, 

    async loadImage(imgEl, filename) {
    if (!filename || !imgEl) return;


    if (this._imageCache[filename]) {
      imgEl.src = this._imageCache[filename];
      return;
    }

    try {
      const apiUrl = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
        action: 'query',
        titles: `File:${filename}`,
        prop: 'imageinfo',
        iiprop: 'url',
        iiurlwidth: '900',
        format: 'json',
        origin: '*'
      });

      const res = await fetch(apiUrl);
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const page = Object.values(pages)[0];
      const thumbUrl = page?.imageinfo?.[0]?.thumburl;

      if (thumbUrl) {
        this._imageCache[filename] = thumbUrl;
        imgEl.src = thumbUrl;
      }
    } catch (e) {
      console.warn('Не удалось загрузить изображение:', filename, e);
    }
  },


  getTodayPainting() {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return paintings[seed % paintings.length];
  },

  getPaintingById(id) {
    return paintings.find(p => p.id === id) || null;
  },


  recordView(userId, paintingId) {
    Storage.addToHistory(userId, paintingId);
  },

  getHistory(userId) {
    return Storage.getHistory(userId)
      .map(h => ({ ...App.getPaintingById(h.paintingId), viewedAt: h.viewedAt }))
      .filter(p => p.id !== undefined);
  },


  toggleFavorite(userId, paintingId) {
    return Storage.toggleFavorite(userId, paintingId);
  },

  isFavorite(userId, paintingId) {
    return Storage.isFavorite(userId, paintingId);
  },

  getFavorites(userId) {
    return Storage.getFavorites(userId)
      .map(id => App.getPaintingById(id))
      .filter(Boolean);
  },


  updateNav() {
    const user = Auth.getCurrentUser();
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
  },


  renderPaintingCard(painting, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || !painting) return;

    const user = Auth.getCurrentUser();
    const fav = user ? App.isFavorite(user.id, painting.id) : false;
    const favBtn = user
      ? `<button class="fav-btn ${fav ? 'active' : ''}" onclick="App.handleFavToggle(${painting.id}, this)">
           ${fav ? '★ В избранном' : '☆ В избранное'}
         </button>`
      : '';

    const imgId = `painting-img-${painting.id}`;

    container.innerHTML = `
      <img id="${imgId}" src="" alt="${painting.title}" style="background:#f0ede8; min-height:300px">
      <div class="painting-info">
        <div class="painting-title">${painting.title}</div>
        <div class="painting-artist">${painting.artist}, ${painting.year}</div>
        <span class="painting-topic">${painting.topic}</span>
        <div class="painting-description">${painting.description}</div>
        <div class="painting-story">${painting.story}</div>
        ${favBtn}
        ${options.guestNotice && !user
          ? '<div class="guest-notice">Войдите в аккаунт, чтобы сохранять историю и добавлять в избранное</div>'
          : ''}
      </div>
    `;

    const imgEl = document.getElementById(imgId);
    this.loadImage(imgEl, painting.filename);
  },

  handleFavToggle(paintingId, btn) {
    const user = Auth.getCurrentUser();
    if (!user) return;
    const added = App.toggleFavorite(user.id, paintingId);
    btn.textContent = added ? '★ В избранном' : '☆ В избранное';
    btn.classList.toggle('active', added);
  },


  renderGallery(containerId, items, emptyText) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (items.length === 0) {
      el.innerHTML = `<div class="empty-state">${emptyText}</div>`;
      return;
    }

    const cards = items.map(p => `
      <a href="painting.html?id=${p.id}" class="gallery-item">
        <img id="gallery-img-${p.id}" src="" alt="${p.title}" style="background:#f0ede8">
        <div class="gallery-item-info">
          <div class="gallery-item-title">${p.title}</div>
          <div class="gallery-item-artist">${p.artist}, ${p.year}</div>
        </div>
      </a>
    `).join('');

    el.innerHTML = `<div class="gallery">${cards}</div>`;

    items.forEach(p => {
      const imgEl = document.getElementById(`gallery-img-${p.id}`);
      this.loadImage(imgEl, p.filename);
    });
  }
};

function updateNav() { App.updateNav(); }
function logout() { Auth.logout(); }
