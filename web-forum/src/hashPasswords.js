const bcrypt = require('bcrypt');

async function hashPasswords() {
  const users = [
    { username: 'regular_user', password: 'plaintext_user_password' },
    { username: 'admin_user', password: 'plaintext_admin_password' },
    { username: 'user2', password: 'plaintext_password2' },
    { username: 'guest_user', password: 'plaintext_guest_password' },
    { username: 'admin', password: 'plaintext_admin_password' },
    { username: 'user', password: 'plaintext_user_password' },
  ];

  const hashedUsers = [];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    hashedUsers.push({ username: user.username, hashedPassword });
  }

  console.log('Hashed Users:', hashedUsers);
}

hashPasswords();
