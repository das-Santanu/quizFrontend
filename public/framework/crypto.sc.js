function generatePrivateKey(e, t) {
    return CryptoJS.PBKDF2(e, t, { keySize: 8 }).toString();
  }
  function key() {
    let e = CryptoJS.lib.WordArray.random(16).toString(),
      t = generatePrivateKey("my-secret-passphrase", e);
    return t;
  }
  function encryption(e, t) {
    let r = CryptoJS.AES.encrypt(e, t).toString();
    return r;
  }
  function decryption(e, t) {
    let r = CryptoJS.AES.decrypt(e, t),
      n = r.toString(CryptoJS.enc.Utf8);
    return n;
  }