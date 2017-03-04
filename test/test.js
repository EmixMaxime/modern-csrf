const chai = require('chai');
const expect = chai.expect;

const Csrf = require('../Csrf');
const csrf = Csrf();

/**
 * Validates a string if it is URL Safe Base64 encoded.
 *
 * @param {String}
 * @return {Boolean}
 */

const validateUrlSafeBase64 = function (base64) {
  return /^[A-Za-z0-9\-_]+$/.test(base64);
}



describe('Csrf', () => {

  describe('#create', () => {

    it('It should returns a base64 url token', (done) => {
      csrf.create().then(token => {
        expect(token).to.be.a('string');
        expect(validateUrlSafeBase64(token)).to.be.true;
        done();
      });
    });

    it('It should create a token with secret-salt', (done) => {
      csrf.create().then(token => {
        const [secret, salt] = token.split('-');

        expect(secret).to.be.a('string');
        expect(salt).to.be.a('string');

        done();
      });
    });

  });

  describe('#update', () => {
    it('It should update my salt part of token', () => {

      return csrf.create().then(token => {
        const [secret, salt] = token.split('-');
        expect(secret).to.be.a('string');
        expect(salt).to.be.a('string');

        const newToken = csrf.update(token)
        const [newSecret, newSalt] = newToken.split('-');

        expect(secret, 'The secret part shouldn\'t change').to.be.equal(newSecret);
        expect(newSalt, 'The salt have to change').to.be.not.equal(salt);

      });
    })
  });

  describe('#verify', () => {

    it('It should returns false', () => {
      return Promise.all([ csrf.create(), csrf.create() ]).then(([token1, token2]) => {
        expect(csrf.verify(token1, token2)).to.be.false;
      });
    });

    it('It should returns true with the same secret part', () => {
      return csrf.create().then(token => {
        const sameToken = csrf.update(token);
        expect(csrf.verify(sameToken, token)).to.be.true;
      });
    });

  });

});