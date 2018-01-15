var config     = require('./../config/config');

var weatherController  = require('./../controllers/weathercontroller');
  
module.exports.set = function(app) {
        
    app.get('/', function(req, res) {
        res.render('index'); 
		
    });
	
	app.post('/getWeather',function(req, resp){
        weatherController.weather(req, resp);
    }
	);
    app.post('/getAllWeather', function(req,resp){
        
        weatherController.getAllWeather(req,resp);
        
    })
    
}