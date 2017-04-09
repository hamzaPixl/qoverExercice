function Server (repository) {

  /**
   * Services
   */
  this.path = require('path');
  this.fs = require('fs');
  this.jwt = require('jsonwebtoken');
  this.express = require('express');
  this.morgan = require('morgan');
  this.app = this.express();
  this.server = require('http').Server(this.app);
  this.repository = repository;

  /**
   * Local services
   */
  this.Cars = require(this.path.resolve(__dirname, './../buisness/Cars'));
  this.cars = new this.Cars(this.repository);

  this.Quote = require(this.path.resolve(__dirname, './../buisness/Quote'));
  this.quote = new this.Quote(this.repository);

  this.User = require(this.path.resolve(__dirname, './../buisness/User'));
  this.user = new this.User(this.repository);

  this.Logger = require(this.path.resolve(__dirname, './../utils/Logger'));
  this.logger = new this.Logger();

  this.Mailer = require(this.path.resolve(__dirname, './../utils/Mailer'));
  this.mailer = new this.Mailer();

}

Server.prototype = {

  /**
   * This function start the server
   * and listen on port
   * @see Server::midelwares
   * @see Server::routes
   */
  start: function start () {
    this.midelwares();
    this.routes();
    this.server.listen(process.env.PORT);
    this.logger.log('Server started');
  },

  /**
   * This function will close the server
   */
  stop: function stop () {
    this.server.close();
  },

  /**
   * This function logger and error message
   * and send response 400 status code
   * @param req is request
   * @param res is response
   */
  errorMessage: function errorMessage (req, res, message) {
    this.logger.log(`Error on this request ${req.originalUrl}`);
    res.status(400).send({
      message: message || 'Error happend !',
      error: 400,
      request: req.originalUrl,
    });
  },

  /**
   * Check if the token is OK
   * @param request
   * @returns {boolean}
   */
  checkToken: function checkToken (request) {
    if (!request.params.token) {return false;}
    try {
      this.jwt.verify(request.params.token, process.env.JWT_SECRET);
      return true;
    } catch (err) {
      this.logger.log(err.message);
      return false;
    }
  },

  /**
   * Generate a token for the authentification
   * @param params
   */
  generateToken: function generateToken (params) {
    const exp = Math.floor(Date.now() / 1000) + (60 * 60);
    return this.jwt.sign({
      exp,
      data: {
        username: params.username,
        password: params.password,
        exp,
        created: Date.now(),
      },
    }, process.env.JWT_SECRET);
  },

  /**
   * This function handle all routes
   * that the server will use
   */
  routes: function routes () {

    /**
     * Authentification of the user
     */
    this.app.get('/login/:username/:password', (req, res) => {
      this.user.getUser(req.params.username).then((result) => {
        if (result.length === 0) {
          this.errorMessage(req, res, 'User does not exists !');
        } else {
          res.status(200).send({
            message: 'Authentification succeed !',
            user: {username: req.params.username, token: this.generateToken(req.params)}
          });
        }
      }).catch(() => {
        this.errorMessage(req, res, 'User does not exists !');
      });
    });

    /**
     * Get all brand of cars
     */
    this.app.get('/cars/:token', (req, res) => {
      if (this.checkToken(req)) {
        this.cars.getAll().then((result) => {
          res.status(200).send(result);
        }).catch((err) => {
          this.errorMessage(req, res, err);
        });
      } else {
        this.errorMessage(req, res, 'Acces denied because of no token valid');
      }
    });

    /**
     * Create a quote
     */
    this.app.get('/quote/:name/:car/:value/:username/:token', (req, res) => {
        if (this.checkToken(req)) {
          let response = {code: 200, message: 'The quote is confirmed an email will be send', price: 0};
          const value = parseInt(req.params.value);
          this.cars.getBrand(req.params.car)
            .then((result) => {
              let status = 'OK';
              let price = 0;
              if (value < 5000 || value > 75000) {
                this.logger.log(`${req.originalUrl}, Buisness rules require value between 5.000 € and 75.000 €`);
                status = 'REJECT';
                response.code = 400;
                response.message = 'Buisness rules require value between 5.000 € and 75.000 €';
              } else {
                price = (value * result[0].percentage) + result[0].base;
                response.price = price;
                this.mailer.sendEmail({
                  name: req.params.name,
                  value,
                  price,
                  username: req.params.username,
                  car: req.params.car
                }).then((info)=>{this.logger.log(info);}).catch((err)=>{this.logger.log(err);});
              }
              res.status(200).send(response);
              this.quote.createQuote({
                username: req.params.username,
                date: new Date().toTimeString(),
                name: req.params.name,
                make: req.params.car,
                value: value,
                status: status,
                price: price,
              }).catch(() => {});
            }).catch(() => {});
        } else {
          this.errorMessage(req, res, 'Acces denied because of no token valid');
        }
      }
    );

    /**
     * Get index
     */
    this.app.get('/', (req, res) => {
      res.status(200).send(this.fs.readFileSync(this.path.resolve(__dirname, './../www/index.html'), 'UTF8'));
    });

    /**
     * No route is found
     */
    this.app.use('*', (req, res) => {
      res.status(404).send('No route');
    });
  },

  /**
   * Initialize midelware that the server can use
   */
  midelwares: function midelwares () {
    this.app.use('/public', this.express.static(this.path.join(__dirname, '/..', '/www')));
    this.app.use(this.morgan('tiny'));
  },

};

module.exports = Server;
