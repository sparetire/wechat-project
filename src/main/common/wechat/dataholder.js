function DataHolder(db) {
	var self = this instanceof DataHolder ? this : Object.create(DataHolder.prototype);
	var collection = db.collection(DataHolder.COLLECTION);

	// 可能抛出异常，需要被捕获
	self.find = function (key) {
		return collection.findOne({
			[key]: {
				$ne: null
			}
		});
	};

	// 可能抛出异常，需要被捕获
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