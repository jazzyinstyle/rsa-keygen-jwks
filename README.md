# rsa-keygen-jwks

This library helps you to generate a new set of RSA public and private keys (in [PEM](https://knowledge.digicert.com/quovadis/ssl-certificates/ssl-general-topics/what-is-pem-format.html)) format together with the JWKS [(Json Web Key Set)](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets#:~:text=The%20JSON%20Web%20Key%20Set,using%20the%20RS256%20signing%20algorithm.) that are used for [JWT](https://jwt.io/) authentication implementation.

In a common use-case:

- the private PEM key would be used to sign the JWT token.
- the JWKS would be used to authenticate incoming request containing the access (or [refresh](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)) JWT token.

## Example of Use

```JS
const  generator = require('rsa-keygen-jwks');

/*
Step 1: Calling the generateNewKeySet() will generate a new set
of _<uuid>_ folder name with the following content:

- <uuid-xxx-xxx-xx folder>
  - [0]
    - private.key
    - public.key
  - [1]
    - private.key
    - public.key
  - jwks.json

Folder[0] and Folder[1] both represents 2 new set of PEM keys.
This is recommended to allow rotation of signing keys
in case the other has been compromised.
*/

generator.generateNewKeySet();

/*
Step 2: Signing the JWT token
*/

const  jwt = require('jsonwebtoken');
const  payload = "any payload";

/*
Read the private key that have been generated in Step 1.
You can choose the key from folder[0] or folder[1] above.
Remember to encode it in utf-8 format.
*/
const  privateKey = <content-of-the-private-key>

/*
The kid (key identifier) value is being stored
in the generated jwks.json.
This kid must correspond to the private key used above.
*/
const kidRef = <kid-value>

/*
Use the jsonwebtoken library to sign the payload
with the private key to generate the JWT access/refresh token.
*/
const accessToken = jwt.sign(payload, privateKey, {
	header: { kid:  kidRef },
	issuer: <some-issuer>,
	audience: <some-audience>,
	expiresIn: <some-expiry>,
	subject: <some-subject>,
	algorithm: 'RS256'
});

/*
Step 3: Authentication the JWT Token

You should have everything you need to perform the JWT authentication.
Please refer to the example in the library jwks-rsa (https://www.npmjs.com/package/jwks-rsa)
that describe how to reference the jwks.json for authentication (via the jwksUri property).
*/

```

## References

- [JSON Web Tokens](https://auth0.com/docs/secure/tokens/json-web-tokens)
- [JWT](https://jwt.io/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [jwks-rsa](https://www.npmjs.com/package/jwks-rsa)
- [jose](https://www.npmjs.com/package/jose)
