# Modern CSRF

Primary logic behind csrf tokens with modern javascript without dependencies.
Are you annoyed by csrf librairies with old and illegible code with many dependencies ?
It's time to understand the logic behind csrf tokens with this library.

For example, the library [CSRF](https://www.npmjs.com/package/csrf) generate it's keys with uid-safe, and the uid-safe generate it's keys with random-bytes which generate it's keys by the crypto module. It's so bad to understand what is going on behind the scene.

## Install

```bash
npm install modern-csrf
# or with yarn
yarn add modern-csrf
```

## Should I refresh my csrf token per form request ?
Definitely not!
You should read [this post to understand why](http://security.stackexchange.com/questions/22903/why-refresh-csrf-token-per-form-request)

## API

### Options
Coming soon!

### csrf.create()
Create a new CSRF token.
This token is what you should add into HTML <form> blocks, or into a specific HTTP header, and expect the user's browser to provide back.
```js
csrf.create().then(token => {
  console.log({ token });
});

/** Or using with async/await */
const token = csrf.create();
```

## csrf.update()
```js
const updatedToken = csrf.update(token);
```

## csrf.verify(token1, token2)
Check whether the CSRF tokens are equals, returning a Boolean.
```js
csrf.create().then(token => {fullname
  const updatedToken = csrf.update(token);
  csrf.verify(updatedToken, token); // -> true
});
```

## License
Modern csrf is released under the [MIT License](https://opensource.org/licenses/MIT).