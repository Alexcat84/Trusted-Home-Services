import { describe, it, expect, afterEach } from 'vitest';
import { publicCors, adminCors } from '../cors.js';

function mockRes() {
  const headers = {};
  return {
    headers,
    setHeader(key, value) {
      headers[key] = value;
    },
  };
}

describe('publicCors', () => {
  const originalTrustedOrigins = process.env.TRUSTED_ORIGINS;

  afterEach(() => {
    process.env.TRUSTED_ORIGINS = originalTrustedOrigins;
  });

  it('allows a same-origin request', () => {
    const req = { headers: { origin: 'https://trustedhomeservices.ca', host: 'trustedhomeservices.ca' } };
    const res = mockRes();
    publicCors(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://trustedhomeservices.ca');
  });

  it('allows an origin listed in TRUSTED_ORIGINS', () => {
    process.env.TRUSTED_ORIGINS = 'https://trustedhomeservices.ca';
    const req = { headers: { origin: 'https://trustedhomeservices.ca', host: 'some-other-host.example' } };
    const res = mockRes();
    publicCors(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://trustedhomeservices.ca');
  });

  it('allows localhost during development', () => {
    const req = { headers: { origin: 'http://localhost:5173', host: 'localhost:3000' } };
    const res = mockRes();
    publicCors(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('http://localhost:5173');
  });

  it('does not set Access-Control-Allow-Origin for an untrusted origin', () => {
    delete process.env.TRUSTED_ORIGINS;
    const req = { headers: { origin: 'https://evil.example', host: 'trustedhomeservices.ca' } };
    const res = mockRes();
    publicCors(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('never reflects a wildcard origin', () => {
    delete process.env.TRUSTED_ORIGINS;
    const req = { headers: { origin: 'https://evil.example', host: 'trustedhomeservices.ca' } };
    const res = mockRes();
    publicCors(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).not.toBe('*');
  });
});

describe('adminCors', () => {
  it('reflects a known admin origin', () => {
    const req = { headers: { origin: 'https://trusted-home-services.vercel.app' } };
    const res = mockRes();
    adminCors(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://trusted-home-services.vercel.app');
    expect(res.headers['Access-Control-Allow-Credentials']).toBe('true');
  });

  it('falls back to the production domain for an unknown origin', () => {
    const req = { headers: { origin: 'https://evil.example' } };
    const res = mockRes();
    adminCors(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('https://trustedhomeservices.ca');
  });
});
