function Quote (repository) {
  this.repository = repository;
}

Quote.prototype = {

  /**
   * Create a quote
   * @param quote
   * @returns {UnorderedBulkOperation|*|OrderedBulkOperation|Promise}
   */
  createQuote: function createQuote (quote) {
    return this.repository.insert(process.env.QUOTES_COLLECTION, quote);
  },

  /**
   * Get all quotes
   * @returns {*|Object|Promise}
   */
  getAll: function getAll () {
    return this.repository.getAll(process.env.QUOTES_COLLECTION);
  },

  /**
   * Get alls quotes's user
   * @param username
   * @returns {Promise}
   */
  getAllByUser: function getAllByUser (username) {
    return new Promise((resolve, reject) => {
      this.getAll.then((result) => {
        resolve(result.filter((item) => {
          return item.username === username;
        }));
      }).catch((err) => {
        reject(err);
      });
    });
  },

};

module.exports = Quote;