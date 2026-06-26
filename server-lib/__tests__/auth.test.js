import { describe, it, expect } from 'vitest';
import { signJWT, verifyJWT, safeStringEqual } from '../auth.js';

describe('safeStringEqual', () => {
  it('returns true for identical strings', () => {
    expect(safeStringEqual('admin', 'admin')).toBe(true);
  });

  it('returns false for different strings', () => {
    expect(safeStringEqual('admin', 'wrong')).toBe(false);
  });

  it('returns false for different-length strings', () => {
    expect(safeStringEqual('short', 'a-much-longer-string')).toBe(false);
  });

  it('returns false for non-string inputs', () => {
    expect(safeStringEqual(null, 'admin')).toBe(false);
    expect(safeStringEqual('admin', undefined)).toBe(false);
    expect(safeStringEqual(123, 123)).toBe(false);
  });
});

describe('signJWT / verifyJWT', () => {
  const secret = 'test-secret';

  it('round-trips a valid token', () => {
    const token = signJWT({ admin: true }, secret, 3600);
    const payload = verifyJWT(token, secret);
    expect(payload).not.toBeNull();
    expect(payload.admin).toBe(true);
  });

  it('rejects a token signed with a different secret', () => {
    const token = signJWT({ admin: true }, secret, 3600);
    expect(verifyJWT(token, 'other-secret')).toBeNull();
  });

  it('rejects a tampered payload', () => {
    const token = signJWT({ admin: true }, secret, 3600);
    const [header, , sig] = token.split('.');
    const tamperedPayload = Buffer.from(JSON.stringify({ admin: true, evil: true }))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(verifyJWT(`${header}.${tamperedPayload}.${sig}`, secret)).toBeNull();
  });

  it('rejects an expired token', () => {
    const token = signJWT({ admin: true }, secret, -10);
    expect(verifyJWT(token, secret)).toBeNull();
  });

  it('rejects malformed tokens', () => {
    expect(verifyJWT('not-a-jwt', secret)).toBeNull();
    expect(verifyJWT('', secret)).toBeNull();
    expect(verifyJWT(null, secret)).toBeNull();
  });
});
