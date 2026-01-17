import { test, expect } from '@playwright/test';
import { CryptoHelper } from '../utils/crypto';

test('crypto encryption/decryption', async () => {
  const original = 'admin123';
  const encrypted = CryptoHelper.encrypt(original);
  const decrypted = CryptoHelper.decrypt(encrypted);
  
  expect(decrypted).toBe(original);
  console.log('Encrypted password:', encrypted);  // Copy this to .env!
});
