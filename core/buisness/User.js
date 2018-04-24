function User (repository) {
  this.repository = repository;
}

User.prototype = {
  /**
   * Get a user information
   * @param username
   * @returns {Promise}
   */
  getUser: function getUser (username) {
    return new Promise((resolve, reject) => {
      this.repository.getAll(process.env.USERS_COLLECTION).then((result) => {
        resolve(result.filter((item) => {
          return item.username === username;
        }));
      }).catch((err) => {
        reject(err);
      });
    });
  },
};

module.exports = User;