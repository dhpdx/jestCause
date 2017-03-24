var clearDB = require('../../credentials/info.js');

// var db = require('knex')({
// 	client: 'mysql',
// 	connection: {
// 		host: clearDB.host,
// 		user: clearDB.user,
// 		password: clearDB.password,
// 		database: clearDB.database
// 	}
// });


var db = require('knex')({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database: 'hang'
	}
});

db.schema.hasTable('users').then(exists => {
	if (!exists) {
		return db.schema.createTable('users', function(table) {
			table.increments();
			table.string('name');
			table.string('email').unique();
			table.string('password');
			table.string('profile_url');
			table.boolean('hang').defaultTo(true);
		});
	}

	else {
		console.log('already exists')
	}
})

db.schema.hasTable('events').then(exists => {
	if (!exists) {
		db.schema.createTable('events', function(table) {
			table.increments();
			table.string('where');
			table.string('when');
			table.string('description');
			table.integer('host_id').unsigned().references('users.id');
			}).then(function() {
				console.log('added events');
			})
		}
		else {
			console.log('events already exists');
		}
	});

db.schema.hasTable('user_events').then(exists => {
	if (!exists) {
		db.schema.createTable('user_events',function(table) {
			table.increments();
			table.integer('user_id').unsigned().references('users.id');
			table.integer('event_id').unsigned().references('events.id');
			}).then(function() {
				console.log('added_user_events')
		})
	}
	else {
		console.log('user_events already exists');
	}
});

module.exports = db;

