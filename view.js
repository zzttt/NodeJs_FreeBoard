var http = require('http');
var url = require('url');
var path = require("path");
var DataController = require('./datacontroller').DataController;
var DataController = new DataController('127.0.0.1', 27017);
var fs = require('fs');

http.createServer(function(req, res) {

  var parsedUrl = url.parse(req.url, true);

  var uri = parsedUrl.pathname, filename = path.join(process.cwd(), uri);
  var query = parsedUrl.query;

  console.log(parsedUrl);

  var isValidUrl = true;
  var respString = "";
  console.log("===========");
  console.log("uri: " + uri);
  console.log("== query ==");
  for(var data in query)
  	console.log(data+": "+query[data]);
  console.log("===========");


  var record = {};
  		for(var key in query)
  			record[key] = query[key];

  switch(uri){
  	case "/create":
  		DataController.insert(record, function(err, records){
  			respString = "craete method";
  			res.writeHead(200, {'Content-Type': 'text/html'});
  			res.end(respString);
  		});
  	break;
  	
  	case "/read":
  		var ret;

		console.log("read!");
		
  		DataController.findAll(function(err, records){
			console.log(records.length);
  			for(var i=0;i<records.length;i++){
				var artTitle;
				var artIdx;
				respString += "<div style='width:600px;height:40px;border: 2px black solid;margin-bottom:1px;'>";			
				console.log(respString);
	

				var tmpKey , tmpRecords;	
  				for(var key in records[i]){
					if(key == "_id" || key == "title"){
					
					if( key == "title"){
						artTitle = records[i][key];
						artTitle = artTitle.trim();
						respString += "<div class='row' id="+artIdx+" style='float:left;width:140px;height:38px;'>"+tmpKey + ": " + tmpRecords+"</div>";


						respString += "<div class='row' id="+artIdx+" style='float:left;width:195px;height:38px;'>"+key + ": " + records[i][key]+"</div>";
					}else{
						tmpKey = key;
						tmpRecords = records[i][key];	
						artIdx = tmpRecords;
					}
					}

  				}
				respString += "</div>";
  			}

			 fs.readFile('./html/list.html', function(err,data){

                	      //req.params[1] 의 idx에 해당하는 글을 긁어와서 부어준다.
        	                res.writeHead(200, {'Content-Type': 'text/html'});
                       		 var htmlString = data.toString();
	                       	 htmlString = htmlString.replace('{{nodecontent}}', respString);
	                        console.log(typeof(htmlString));

        	                console.log("\n\n\n\n\n\n---------------_RESP::: "+respString);

                	        res.write(htmlString);
	                        res.end();
	                });


  		});
		


  	break;

  	case "/findArticle":
		console.log(query.search);
		DataController.findById(query.search ,function(err , ret){
			
			res.writeHead(200, {'Content-Type': 'text/html'});
			var htmlString = ret.toString();
			
			console.log(ret.title);
			if(ret.contents != null){
				console.log(ret.contents);
				res.write(ret.contents);
			}else{
				res.write(ret.title);
			}
			res.end();

		});


  	break;

  	case "/delete":
  		DataController.remove(record.dataid, function(err, ret){
  			
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(respString);
  		});
  	break;

  	default:
  		respString = "page not found :(";
  		isValidUrl = false;
  	break;

  }

  if(!isValidUrl){
  	res.writeHead(404, {'Content-Type': 'text/html'});
  	res.end(respString);
  }


}).listen(1337, '127.0.0.1');
