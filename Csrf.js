const crypto = require('crypto');

const base62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const length = Buffer.byteLength(base62);

const Csrf = function (opts) {

  const createSalt = function (size) {
    let salt = '';
    for (let i = 0; i < size; i++) {
      salt += base62[Math.floor(length * Math.random())]
    }
    return salt;
  };


  /**
   * Generate an URI safe base64 encoded string that does not contain "+",
   * "/" or "=" which need to be URL encoded and make URLs unnecessarily longer.
   * And does not contain "-" which used to separate the secret and salt
   * Inspired by https://github.com/symfony/security-csrf/blob/master/TokenGenerator/UriSafeTokenGenerator.php
   */
  const safeBase64Buffer = function (buffer) {
    return buffer
      .replace(/\+/g, '')
      .replace(/-/g, '')
      .replace(/=/g, '')
      .replace(/\//g, '');
  }

  const createSecret = function (size) {
    return new Promise(resolve => {

      crypto.randomBytes(size, (err, buffer) => {
        if (err) console.log(err);
        resolve(buffer.toString('base64'));
      });

    });
  };

  const create = async function () {
    const salt = createSalt(4);
    const secret = await createSecret(32);

    const hash = crypto
      .createHash('sha256')
      .update(secret, 'ascii')
      .digest('base64');

    const safeSecret = safeBase64Buffer(hash);
    const token = `${safeSecret}-${salt}`;
    return token;
  };

  const update = function (token) {
    const [ secret, salt ] = token.split('-');
    const newSalt = createSalt(4);
    return `${secret}-${newSalt}`;
  };

  const verify = function (token1, token2) {
    const [ secret1, salt1 ] = token1.split('-');
    const [ secret2, salt2 ] = token2.split('-');
    
    return secret1 === secret2;
  };

  return {
    create, update, verify
  };
};

module.exports = Csrf;