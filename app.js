var express    = require('express');      
var app        = express();                
var bodyParser = require('body-parser');
var config = require('./server/config/config.js');

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.set('views', __dirname + '/public/templates');
app.set('view engine','hjs');

app.engine('hjs', require('hogan-express'));


app.use(express.static(__dirname + '/public'));

//Setting the PORT
var port = process.env.PORT | config.port;  

var routers = require('./server/routes/routes');
routers.set(app);


app.listen(port);
console.log("Please access "+config.hostUrl+ " to view the app");

//Test Changes


