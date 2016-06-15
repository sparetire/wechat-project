var MongoClient = require('mongodb')
	.MongoClient,
	co = require('co'),
	assert = require('assert');
// var mongoose = require('mongoose');

var url =
	'mongodb://lusir:xjs406@localhost:8588/wechat?minPollSize=5&maxPollSize=10';
// mongoose.connect(url);

// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));

// db.once('open', () => {
// 	console.log('Connected succesfully to server');
// });

// var personSchema = mongoose.Schema({
// 	name: String
// });

// var Person = mongoose.model('Person', personSchema);

// var tom = new Person({
// 	name: 'Tom'
// });

// tom.save((err, tom) => {
// 	if (err) {
// 		return console.error(err);
// 	}
// 	console.log(tom);
// });



// MongoClient.connect(url, (err, db) => {
// 	assert.equal(null, err);
// 	console.log('Connected succesfully to server');
// 	db.collection('config')
// 		.insertOne({
// 			name: 'hello'
// 		}, (err, r) => {
// 			console.log(err);
// 			console.log(r.insertedCount);
// 			db.close();
// 		});
// });



MongoClient.connect(url)
	.then((db) => {
		// assert.equal(null, err);
		console.log('Connected succesfully to server');
		db.collection('config')
			.insertOne({
				name: 'hello'
			}, (err, r) => {
				console.log(err);
				console.log(r.insertedCount);
				db.close();
			});
	});

// co(function* () {
// 		var url = 'mongodb://lusir:xjs406@localhost:8588/wechat';
// 		var db = yield MongoClient.connect(url);
// 		console.log('Connected succesfully to server');
// 		db.close();
// 	})
// 	.catch(function (err) {
// 		console.log(err.stack);
// 	});