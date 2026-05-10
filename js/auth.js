function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function register(username, email, password) {
  const users = getUsers();
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
  saveUsers(users);
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return { success: true };
}

function login(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, message: 'Неверный email или пароль' };
  }
  localStorage.setItem('currentUser', JSON.stringify(user));
  return { success: true };
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}