import crypto from 'crypto';
import QRCode from 'qrcode';

export function generateVerificationToken(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function generateQRCode(data: object): Promise<string> {
  const qrData = JSON.stringify(data);
  return QRCode.toString(qrData, { type: 'svg' });
}
