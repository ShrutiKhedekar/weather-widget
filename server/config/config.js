var env = process.env.NODE_ENV || 'development';

var config = module.exports = {};

config.env = env;

config.port   = '5000';
config.hostUrl   = 'http://localhost:5000';
config.views     = './../../public/';
config.key  = '98510d3d034d256b4530cf2762e41259';
config.count = 15;

module.exports   = config;