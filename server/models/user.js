class User {
    constructor(username, email, passwordHash, role) {
      this.username = username;
      this.email = email;
      this.passwordHash = passwordHash;
      this.role = role;
    }
  }
  
  module.exports = User;
  