const fs = require('fs');
const { JWK: { generateSync }, JWKS } = require('jose');
const uuidv4 = require('uuid').v4;


function rsaKeyGeneratorUtil() {
  let jwk1;
  let jwk2;
  let keystore;
  let jwksDirectory;
  let privateKeyDirectory1;
  let privateKeyDirectory2;

  function generateJWK() {
    return generateSync('RSA', 2048, { use: 'sig', alg: 'RS256' });
  }

  function generateJWKS() {
    jwk1 = generateJWK();
    jwk2 = generateJWK();

    keystore = new JWKS.KeyStore([jwk1, jwk2]);
  }

  function getFormattedJWKS(privateKey = false) {
    return keystore.toJWKS(privateKey);
  }

  function createDirectories() {
    jwksDirectory = `./${uuidv4()}`;
    if (!fs.existsSync(jwksDirectory)) {
      fs.mkdirSync(jwksDirectory);
    }

    privateKeyDirectory1 = `./${jwksDirectory}/0`;
    if (!fs.existsSync(privateKeyDirectory1)) {
      fs.mkdirSync(privateKeyDirectory1);
    }

    privateKeyDirectory2 = `./${jwksDirectory}/1`;
    if (!fs.existsSync(privateKeyDirectory2)) {
      fs.mkdirSync(privateKeyDirectory2);
    }
  }

  function createJWKSFile(jwks) {
    fs.writeFileSync(`${jwksDirectory}/jwks.json`, JSON.stringify(jwks));
  }

  function createPrivateKeySet() {
    const privateKey1 = jwk1.toPEM(true);
    const publicKey1 = jwk1.toPEM();
    const privateKey2 = jwk2.toPEM(true);
    const publicKey2 = jwk2.toPEM();

    fs.writeFileSync(`${privateKeyDirectory1}/private.key`, privateKey1);
    fs.writeFileSync(`${privateKeyDirectory1}/public.key`, publicKey1);
    fs.writeFileSync(`${privateKeyDirectory2}/private.key`, privateKey2);
    fs.writeFileSync(`${privateKeyDirectory2}/public.key`, publicKey2);
  }

  function generateNewKeySet() {
    createDirectories();
    generateJWKS();
    createJWKSFile(getFormattedJWKS());
    createPrivateKeySet();
  }

  return {
    generateNewKeySet
  };
}

module.exports = rsaKeyGeneratorUtil();
