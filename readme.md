# Modern CSRF

Primary logic behind csrf tokens with modern javascript without dependencies.
Are you annoyed by csrf libraries with **old and illegible** code with many dependencies?
It's time to understand the logic behind csrf tokens with this library.

For example, the  [CSRF](https://www.npmjs.com/package/csrf) library generate its keys with uid-safe, and the uid-safe generates its keys with random-bytes which generate its keys by the crypto module. **It's so bad to understand what is going on behind the scene**.

## Install

```bash
npm install modern-csrf
# or with yarn
yarn add modern-csrf
```

## Should I refresh my csrf token per form request?
Definitely not!
You should read [this post to understand why not](http://security.stackexchange.com/questions/22903/why-refresh-csrf-token-per-form-request).
Managing CSRF tokens is straightforward. You should generate a token at the connection of your users then keep it in a memory storage like Redis or something else (file ? No it's too bad, it's slow like a donkey).
But to mitigate the BREACH attack, your tokens should change on every request, but this change must be quick **because they are changed on every request!**.

CSRF tokens are composed of a salt and a "secret". The secret is cryptographically secure (8 or 16 bits it's good, secure enough), and the salt is just a random string, which is very fast to generate (based on Math.radom).

So, on every request you must change the CSRF client token using the update function, which only updates the salt part, so it's very fast! You needn't update your tokens in the memory storage. Because two CSRF tokens without the same salt are equal using the verify function.

## API

### Options
Coming soon!

### csrf.create()
Create a new CSRF token.
This token is what you should add into HTML `<form>` blocks, or into a specific HTTP header, and expect the user's browser to provide back (prefer the HTTP header, especially to process AJAX requests).
```js
csrf.create().then(token => {
  console.log({ token });
});

/** Or using with async/await */
const something = async function () {
  const token = await csrf.create();
  /** Update the token, get a new version of this token */
  const updatedToken = csrf.update(token);
  // Do something...
  return updatedToken;
}
```

## csrf.update()
Update an existing token.
```js
/** no asynchronous code, because this process is very fast. It must be made on every request! */
const updatedToken = csrf.update(token);
// Then, send the new csrf token to the client, for exemple by cookie
```

## csrf.verify(token1, token2)
Check whether the CSRF tokens are equals, returning a Boolean.
```js
csrf.create().then(token => {fullname
  const updatedToken = csrf.update(token);
  csrf.verify(updatedToken, token); // -> true
});
```
## Security Vulnerabilities
It should never happens, but just in case.
If you discover a security vulnerability within this library, please send an e-mail to Maxime moreau at contact@maxime-moreau.fr.

## License
Modern csrf is released under the [MIT License](https://opensource.org/licenses/MIT).
