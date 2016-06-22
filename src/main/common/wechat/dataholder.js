const util = require('../util');
const Promise = require('bluebird');

function DataHolder(db) {
	var self = this instanceof DataHolder ? this : Object.create(DataHolder.prototype);
	var collection = db.collection(DataHolder.COLLECTION);

	self.find = function (key) {
		return collection.findOne({
			[key]: {
				$ne: null
			}
		});
	};

	self.save = function (obj) {
		return collection.updateOne({
			key: {
				$ne: null
			}
		}, {
			$set: obj
		}, {
			upsert: true
		});
	};

	return self;
}

DataHolder.COLLECTION = 'config';

module.exports = DataHolder;