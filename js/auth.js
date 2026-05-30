const Auth = {
  register(username, email, password) {
    const users = Storage.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Пользователь с таким email уже существует' };
    }
    const newUser = {
      id: Date.now(),
      username,
      email,
      password
    };
    users.push(newUser);
    Storage.saveUsers(users);
    Storage.setCurrentUser(newUser);
    return { success: true };
  },

  login(email, password) {
    const users = Storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Неверный email или пароль' };
    }
    Storage.setCurrentUser(user);
    return { success: true };
  },

  logout() {
    Storage.setCurrentUser(null);
    window.location.href = 'index.html';
  },

  getCurrentUser() {
    return Storage.getCurrentUser();
  }
};

// Глобальный алиас для onclick-атрибутов в HTML
function logout() {
  Auth.logout();
}
