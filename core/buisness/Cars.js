function Cars (repository) {
  this.repository = repository;
}

Cars.prototype = {

  /**
   * Get all cars
   * @returns {*|Object|Promise}
   */
  getAll: function getAll () {
    return this.repository.getAll(process.env.CARS_COLLECTION);
  },

  /**
   * Get information for one brand
   * @param brand
   * @returns {Promise}
   */
  getBrand: function getBrand (brand) {
    return new Promise((resolve, reject) => {
      this.getAll().then((result) => {
        resolve(result.filter((item) => {
          return item.name === brand;
        }));
      }).catch(() => {});
    });
  },
};

module.exports = Cars;