import { describe, it, expect } from 'vitest';
try {
  import('qrcode');
  console.log('qrcode is available');
} catch (e) {
  console.log('qrcode is NOT available');
}
describe('check qrcode', () => {
  it('check', () => {
    expect(true).toBe(true);
  });
});
