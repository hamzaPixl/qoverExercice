function Repository () {
  this.MongoClient = require('mongodb').MongoClient;
  this.connect().then((db) => {this.db = db;}).catch(() => {});
}

Repository.prototype = {

  /**
   * Connect to the database
   * @returns {Promise}
   */
  connect: function connect () {
    return new Promise((resolve, reject) => {
      this.MongoClient.connect(`${process.env.DB_URL_START}${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}${process.env.DB_URL}`,
        (err, db) => {
          if (err) {
            reject(db);
          }
          resolve(db);
        });
    });
  },

  /**
   * Get all from a collection
   * @param collection
   * @returns {Promise}
   */
  getAll: function getAll (collection) {
    return new Promise((resolve, reject) => {
      this.db.collection(`${collection}`).find().toArray((err, docs) => {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
    });
  },

  /**
   * Insert the object into a collection
   * @param collection
   * @param object
   * @returns {Promise}
   */
  insert: function insert (collection, object) {
    this.db.collection(`${collection}`).insertOne(object);
  },

};

module.exports = Repository;