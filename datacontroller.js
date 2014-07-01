var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

DataController = function(host, port){
	console.log("conn"+host+"/"+port);
	this.Db = new Db('test', new Server(host, port, {auto_reconnect:true}), {safe:false});
	this.Db.open(function(err){
		if(!err){
			console.log('mongodb connected');
		}else{
			console.log("error occured\n");
			console.log(err);
		}
	});
}

DataController.prototype.getData = function(callback){
	this.Db.collection('article', function(err, data){
		if(err)
			callback(err);
		else
			if(!data)
				data = [];

			callback(null, data);
	});
};

DataController.prototype.findAll = function(callback){
	this.getData(function(err, data){
		if(err)
			callback(err);
		else{
			data.find().toArray(function(err, ret){
				if(err)
					callback(err);
				else
					callback(null, ret);
			});
		}
	});
};

DataController.prototype.findById = function(idCode, callback){
	this.getData(function(err, data){
		
		if(err)
			callback(err);
		else{
			data.findOne({ _id : Number(idCode) }, function(err, ret){
				console.log("ret : "+ret);
				console.log("id : "+idCode);
				if(err)
					callback(err);
				else
					callback(null, ret);
			});
		}
	});
};

DataController.prototype.modify = function(id, additionalData, callback){
	this.getData(function(err, data){
		if(err)
			callback(err);
		else{
			data.update({_id: ObjectID.createFromHexString(id)}, {"$push": {add: additionalData}}, function(err, ret){
				if(err)
					callback(err);
				else
					callback(null, ret);
			});
		}
	});
};

DataController.prototype.insert = function(records, callback){
	this.getData(function(err, db_records){
		if(err)
			callback(err);
		else{
			if(typeof(records.length) == "undefined")
				records = [records];

			for(var i=0;i<records.length;i++){
				record = records[i];
				record.create_at = new Date();

				if(record.add == undefined)
					record.add = [];

				for(var j=0;j<record.add.length;j++){
					record.add[j].created_at = new Date();
				}
			}

			db_records.insert(records, function(err, resultData){
				console.log("result: ");
				console.dir(resultData);
				callback(null, resultData);
			});
		}
	});
};

DataController.prototype.remove = function(id, callback){
	this.getData(function(err, db_records){
		if(err)
			callback(err);
		else{
			db_records.remove({_id: ObjectID.createFromHexString(id)}, function(err, num){
				callback(null, num);
			});
		}
	});
};

exports.DataController = DataController;


