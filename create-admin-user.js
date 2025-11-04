// Script para criar usuário admin via Next.js API
// Execute: node create-admin-user.js

const bcrypt = require('bcryptjs');

const adminPassword = '101010';
const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync(adminPassword, salt);

console.log('=== CRIAR USUÁRIO ADMIN ===');
console.log('Nome: Danilo');
console.log('Email: danilocalves86@gmail.com');
console.log('Senha: 101010');
console.log('Password Hash:', passwordHash);
console.log('\nExecute este SQL no Supabase SQL Editor:\n');
console.log(`
INSERT INTO users (email, nome, username, password_hash)
VALUES ('danilocalves86@gmail.com', 'Danilo', 'danilo', '${passwordHash}')
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash,
    username = EXCLUDED.username;
`);
