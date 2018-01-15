const utils = require('../../lib/hashUtils');
const db = require('../../database-postgres');

class Users {
  static create({ name, username, password, email }) {
    const salt = utils.createRandom32String();
    const hash = utils.createHash(password, salt);
    return db.usersAuth.createUser({ password: hash, salt })
      .then(({ id }) => db.users.create({ userAuthId: id, name, username, email }));
  }

  static findById({ id }) {
    return db.users.findById({ id });
  }

  static findByUsername({ username }) {
    return db.users.findByUsername({ username });
  }

  static comparePassword({ username, pass }) {
    let user;
    return db.users.findByUsername({ username })
      .then((user) => {
        user = user;
        return user.user_auth_id;
      })
      .then((userAuthId) => {
        return db.usersAuth.findByUserAuthId({ userAuthId });
      })
      .then((userAuth) => {
        const { password, salt } = userAuth;
        if (utils.compareHash(pass, password, salt)) {
          return user;
        } else {
          return false;
        }
      })
      
  }

  static updatePassword({ userAuthId, password }) {
    const salt = utils.createRandom32String();
    const hash = utils.createHash(password, salt);
    return db.usersAuth.updatePassword({ userAuthId, password: hash, salt });
  }

  static getAllUsers() {
    return db.users.getAllUsers();
  }
}

module.exports = Users;
