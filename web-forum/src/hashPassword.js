const bcrypt = require('bcrypt');

async function hashPassword() {
  const plaintextPassword = 'hashed_password1'; // Replace with your plaintext password
  const saltRounds = 10; // Recommended salt rounds for bcrypt
  const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
  console.log('Hashed Password:', hashedPassword);
}

hashPassword();
