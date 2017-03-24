var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwtAuth = require('./jwtAuth.js')

var ignore = function(path, path2, middleware) {
  return function(req, res, next) {
    if (path === req.path || path2 === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

module.exports = function(app, express) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  //app.use(express.static(__dirname + '/../../deploy/client'));
  app.use(express.static(__dirname + '/../../client'));
  app.use('/node_modules', express.static(__dirname + '/../../node_modules'));
  app.use(ignore('/api/users/signin', '/api/users/signup', jwtAuth.check));
}
