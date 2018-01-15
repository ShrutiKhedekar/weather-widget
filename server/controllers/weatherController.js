var config = require('../config/config');
var request = require('request');
var http = require('http');


module.exports.weather  = function(req,resp)
{
    //Innitialising host,port,path variables
    var options = {
        host: 'api.openweathermap.org',
        port: 80,
        path: '/data/2.5/forecast/daily?lat='+req.body.lat+'&lon='+req.body.lon+'&units=metric&cnt='+config.count+'&appid='+ config.key +''
  
    };
    
    var displayData ='';
    
    //HTTP Get request to open weather map API 
    
    http.get(options, function(res){


        console.log(options)
        res.setEncoding('utf8');
        res.on('data', function(data){

            var obj = JSON.parse(data);
            
            //DIsplay Name,country and Temp
            displayData+='<div class="col-sm-6"><div class="row"><h1 style="color:blue;margin-left:30%;margin-top:15%;position:relative">'+obj.city.name+','+obj.city.country+'</h1>';
            displayData+='<h3 style="color:white;margin-left:38%;">'+obj.list[0].temp.day+'&deg;C</h3>';
            
            //Converting Timestamp to readable date
            var unix_timestamp = obj.list[0].dt;
            var d = new Date(unix_timestamp*1000);
            var date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()

            displayData+='<h3 style="color:white;margin-left:35%;">'+date+'</h3>';
            
            //Displaying other weather details.(country/lat,lon/pressure/humidity)
            displayData+='<table style="margin-left:25%;margin-top:5%;position:relative"><tr><td>Country</td><td>'+obj.city.country+'</td></tr><tr><td>Geo coords</td><td>['+obj.city.coord.lat+','+obj.city.coord.lon+']</td></tr><tr><td>Pressure</td><td>'+obj.list[0].pressure+'hpa</td></tr><tr><td>Humidity</td><td>'+obj.list[0].humidity+'%</td></tr><tr><td>Rain</td><td>'+obj.list[0].weather[0].description+'</td></tr></table></div></div><div class="col-sm-6">';
            
            displayData+='<div id="myCarousel" class="carousel slide style="margin-top:10%;" data-ride="carousel"><ol class="carousel-indicators"><li data-target="#myCarousel" data-slide-to="0" class="active"></li><li data-target="#myCarousel" data-slide-to="1"></li><li data-target="#myCarousel" data-slide-to="2"></li><li data-target="#myCarousel" data-slide-to="3"></li><li data-target="#myCarousel" data-slide-to="4"></li><li data-target="#myCarousel" data-slide-to="5"></li><li data-target="#myCarousel" data-slide-to="6"></li><li data-target="#myCarousel" data-slide-to="7"></li><li data-target="#myCarousel" data-slide-to="8"></li><li data-target="#myCarousel" data-slide-to="9"></li><li data-target="#myCarousel" data-slide-to="10"></li><li data-target="#myCarousel" data-slide-to="11"></li><li data-target="#myCarousel" data-slide-to="12"></li><li data-target="#myCarousel" data-slide-to="13"></li><li data-target="#myCarousel" data-slide-to="14"></li></ol><div class="carousel-inner" role="listbox">';
            
            //Displaying weather information for next 14 days.
            var a=1;
            
            for(a=1;a<config.count;a++)
            {
                if(a==1){
                    displayData+='<div class="item active">';
                }
                else{
                    displayData+='<div class="item">';
                }

                var unix_timestamp = obj.list[a].dt;                       
                var d = new Date(unix_timestamp*1000);
                var date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()
                
                displayData+='<h3 style="color:white;margin-left:35%;margin-top:20%;">'+date+'</h3>';
                
                displayData+='<table style="margin-top:20%; margin-left:25%;margin-bottom:20%;margin-right:25%; border: 5px black"><tr><td>Average:'+obj.list[a].temp.day+'&deg;C</td><td></td><tr><td>min:'+obj.list[a].temp.min +'&deg;C</td><td>max:'+ obj.list[a].temp.max+'&deg;C</td></tr><tr><td>Rainfall:'+obj.list[a].weather[0].description +'<td></tr></tr></table></div>';
                       
            }
                
            displayData+='</div></div>';

            displayData+='<a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span></a><a class="right carousel-control" href="#myCarousel" role="button" data-slide="next"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span></a></div>';
            
            //render myweather.hjs file
            resp.render('myweather', {"displayData":displayData});
        });
        
    }).on("error", function(e){
        throw err;
    });
},

module.exports.getAllWeather  = function(req,resp)
{
    
    var cities = req.body.cities;
    cities=cities.trim() //will trim trailing spaces
    var arrayOfCities = cities.split(" ");//split entire string based on space
    var numberOfCities = arrayOfCities.length;
    
    for(var cityNo=0;cityNo<numberOfCities; cityNo++)
    {
        if(arrayOfCities[cityNo] == " " ||arrayOfCities[cityNo] == undefined )
        {
           arrayOfCities[cityNo]  = arrayOfCities[i].replace(" ", "");
        }
    }
    var error = false;
    var notfound = false;
    
    //Restricting user to enter only 10 cities at a time
    if(numberOfCities>10){
        error= true;
        resp.render('index',{error:error});
    }
    else{ 
        
        displayData='';
        displayData+='<div class="container-fluid"><div id="myCarousel" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators">';

        for(var m=0; m<numberOfCities; m++)
        {
            if(m==0)
            {
                 displayData+='<li data-target="#myCarousel" data-slide-to="0" class="active"></li>';
            }
            else
            {
                displayData+='<li data-target="#myCarousel" data-slide-to="'+m+'"></li>';
            }
        }

        displayData+='</ol><div class="carousel-inner" role="listbox">';

        var j=0;
        for(i=0; i<numberOfCities; i++)
        {
           var city=arrayOfCities[i];
             //Innitialising host,port,path variables
           var options = {
               host: 'api.openweathermap.org',
               port: 80,
               path: '/data/2.5/forecast/daily?q='+city+'&units=metric&cnt='+config.count+'&appid='+ config.key +''

            };
             //HTTP Get request to open weather map API
            http.get(options, function(res){
                res.setEncoding('utf8');
                res.on('data', function(data){
                    j++;
                    var obj =JSON.parse(data);
                    //If city found, API returns COD=200
                    if(obj.cod==200)
                    {
                        if(j==1)
                        {
                            displayData+='<div class="item active">';
                        }
                        else{
                            displayData+='<div class="item">';
                        }
                        
                        //Converting timestamp to Date
                        var unix_timestamp = obj.list[0].dt;                       
                        var d = new Date(unix_timestamp*1000);
                        var date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()

                        displayData+='<h1 style="color:white;margin-left:42%;margin-top:10%;">'+obj.city.name+','+obj.city.country+'</h1><h3 style="color:white;margin-left:45%;">'+obj.list[0].temp.day+'&deg;C</h3><h3 style="color:white;margin-left:44%;">'+date+'</h3>';

                        displayData+='<table style="margin-left:35%;margin-right:35%;position:relative;"><tr><td>Country</td><td>'+obj.city.country+'</td></tr><tr><td>Geo coords</td><td>['+obj.city.coord.lat+','+obj.city.coord.lon+']</td></tr><tr><td>Pressure</td><td>'+obj.list[0].pressure+'hpa</td></tr><tr><td>Humidity</td><td>'+obj.list[0].humidity+'%</td></tr><tr><td>Rain</td><td>'+obj.list[0].weather[0].description+'</td></tr></table>';

                        displayData+='<a href="#nextdays'+j+'" class="btn btn-info" data-toggle="collapse">Next Days</a><div id="nextdays'+j+'" class="collapse">';

                        //Display data for next 14 days.
                        for(var a=1;a<config.count;a++)
                        {
                            var unix_timestamp = obj.list[a].dt;                       
                            var d = new Date(unix_timestamp*1000);
                            var date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()

                            displayData+='<table style="margin-left:35%"><h3 style="color:blue;margin-left:39%;">'+date+'</h3>';


                            displayData+='<tr><td>Average:'+obj.list[a].temp.day+'&deg;C</td><td></td><tr><td>min:'+obj.list[a].temp.min +'&deg;C</td><td>max:'+ obj.list[a].temp.max+'&deg;C</td></tr><tr><td>Rainfall:'+obj.list[a].weather[0].description +'<td><tr></tr>';

                        }

                        displayData+='</table></div></div>';

                        if(j==numberOfCities)
                        {
                            displayData+=' <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span></a><a class="right carousel-control" href="#myCarousel" role="button" data-slide="next"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span></a></div></div></div>';

                            resp.render('myweather', {"displayData":displayData}); 

                        }
                    }
                    //City not found
                    else
                    {
                        notfound = "true";        
                        resp.render('index', {notfound:notfound});

                    }     
                }).on("error", function(e){
                    throw err;
                });
            });
            }
    }
}
