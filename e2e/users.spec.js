const url = require('url');
const qs = require('querystring');
const config = require('../config');

const {
  fetch,
  fetchAsTestUser,
  fetchAsAdmin,
  fetchWithAuth,
} = process;

const parseLinkHeader = (str) => str.split(',')
  .reduce((memo, item) => {
    const [, value, key] = /^<(.*)>;\s+rel="(first|last|prev|next)"/.exec(item.trim());
    return { ...memo, [key]: value };
  }, {});

describe('GET /users', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/users').then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 403 when not admin', () => (
    fetchAsTestUser('/users')
      .then((resp) => expect(resp.status).toBe(403))
  ));

  it('should get users', () => (
    fetchAsAdmin('/users')
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(Array.isArray(json)).toBe(true);
        expect(json.length > 0).toBe(true);
      })
  ));

  describe('GET /users/:id', () => {
    it('should fail with 401 when no auth', () => (
      fetch('/users/foo@bar.baz').then((resp) => expect(resp.status).toBe(401))
    ));

    it('should fail with 403 when not owner nor admin', () => (
      fetchAsTestUser(`/users`)
        .then((resp) => expect(resp.status).toBe(403))
    ));

    it('should fail with 404 when admin and not found', () => (
      fetchAsAdmin('/users/abc@def.ghi')
        .then((resp) => expect(resp.status).toBe(404))
    ));

    it('should get other user as admin', () => (
      fetchAsAdmin('/users/653fc8b9e457b5f6e2a4b05d')
        .then((resp) => {
          expect(resp.status).toBe(200);
          return resp.json();
        })
        .then((json) => expect(json.email).toBe('admin@localhost'))
    ));
  });

  describe('POST /users', () => {
    it('should respond with 400 when email and password missing', () => (
      fetchAsAdmin('/users', { method: 'POST' })
        .then((resp) => expect(resp.status).toBe(400))
    ));

    it('should respond with 400 when email is missing', () => (
      fetchAsAdmin('/users', { method: 'POST', body: { email: '', password: 'xxxx' } })
        .then((resp) => expect(resp.status).toBe(400))
    ));

    it('should respond with 400 when password is missing', () => (
      fetchAsAdmin('/users', { method: 'POST', body: { email: 'foo@bar.baz' } })
        .then((resp) => expect(resp.status).toBe(400))
    ));

    it('should fail with 400 when invalid email', () => (
      fetchAsAdmin('/users', { method: 'POST', body: { email: 'failemail', password: '123456' } })
        .then((resp) => expect(resp.status).toBe(400))
    ));

    it('should fail with 400 when invalid password', () => (
      fetchAsAdmin('/users', { method: 'POST', body: { email: 'email@test.tes', password: '12' } })
        .then((resp) => expect(resp.status).toBe(400))
    ));
    it('should create new user', () => (
      fetchAsAdmin('/users', {
        method: 'POST',
        body: {
          email: 'testee@test.test',
          name: 'test',
          password: '12345',
          role: 'waiter',
        },
      })
        .then((resp) => {
          expect(resp.status).toBe(201);
          return resp.json();
        })
    ));

    it('should create new admin user', () => (
      fetchAsAdmin('/users', {
        method: 'POST',
        body: {
          email: 'admintestee@test.test',
          name: 'admin',
          password: '12345',
          role: 'admin',
        },
      })
        .then((resp) => {
          expect(resp.status).toBe(201);
          return resp.json();
        })
    ));

    it('should fail with 403 when user is already registered', () => (
      fetchAsAdmin('/users', {
        method: 'POST',
        body: { email: 'test@test.com', name: 'other', password: '123456', role: 'waiter' },
      })
        .then((resp) => expect(resp.status).toBe(403))
    ));
  });

  describe('PUT /users/:id', () => {
    it('should fail with 401 when no auth', () => (
      fetch('/users/foo@bar.baz', { method: 'PUT' })
        .then((resp) => expect(resp.status).toBe(401))
    ));

    it('should fail with 403 when not owner nor admin', () => (
      fetchAsTestUser(`/users/${config.adminEmail}`, { method: 'PUT' })
        .then((resp) => expect(resp.status).toBe(403))
    ));

    it('should fail with 403 when not admin tries to change own roles', () => (
      fetchAsTestUser('/users/test@test.test', {
        method: 'PUT',
        body: { role: 'admin' },
      })
        .then((resp) => expect(resp.status).toBe(403))
    ));
  });

  describe('DELETE /users/:id', () => {
    it('should fail with 401 when no auth', () => (
      fetch('/users/foo@bar.baz', { method: 'DELETE' })
        .then((resp) => expect(resp.status).toBe(401))
    ));

    it('should fail with 403 when not owner nor admin', () => (
      fetchAsTestUser(`/users/${config.adminEmail}`, { method: 'DELETE' })
        .then((resp) => expect(resp.status).toBe(403))
    ));

    it('should fail with 404 when admin and not found', () => (
      fetchAsAdmin('/users/abc@def.ghi', { method: 'DELETE' })
        .then((resp) => expect(resp.status).toBe(404))
    ));
  });
});
