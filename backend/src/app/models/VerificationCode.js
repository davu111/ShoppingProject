const codeStorage = {}; // { [email]: { code, expiresAt } }

module.exports = {
  saveCode(email, code, ttl = 120) {
    const expiresAt = Date.now() + ttl * 1000; // ttl (giây)
    codeStorage[email] = { code, expiresAt };
  },

  getCode(email) {
    const entry = codeStorage[email];
    if (!entry) return null;

    const now = Date.now();
    if (entry.expiresAt < now) {
      delete codeStorage[email]; // Hết hạn, tự xoá
      return null;
    }

    return entry.code;
  },

  deleteCode(email) {
    delete codeStorage[email];
  },
};
