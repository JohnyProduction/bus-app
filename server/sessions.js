const sessions = new Set();

const isLoggedIn = token => sessions.has(token);

const addSession = token => sessions.add(token);

const removeSession = token => sessions.delete(token);

module.exports = { isLoggedIn, addSession, removeSession };