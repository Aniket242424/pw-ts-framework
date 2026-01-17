import CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';

dotenv.config();

export class CryptoHelper {
  private static secretKey = process.env.ENCRYPTION_KEY || 'defaultKey';

  static encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  static decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
