'use strict';
const expect 		= require('chai').expect;
const fs       		= require('fs');
const path 			= require('path');
const Geolocation 	= require('../../../../models/geoLocation');
const api 			= require('../../support/api');

describe('controllers.api.geolocations', () => {
	let locations; 
	beforeEach((done) => {
		Geolocation.remove({},done)
	});

	beforeEach( (done) => {
		let file = path.join(__dirname,'../../../../config/memberDB/locations.json')
		fs.readFile(file, "utf-8", (err,data) => {
			if (err)  throw err;
			locations = JSON.parse(data);
			Geolocation.create(locations,done);
		});
	});

	describe('GET /api/geolocations', () => {
		it('has 3 geolocations',  (done) => {
			api.get('/api/geolocations')
			.expect(200)
			.expect((res) => {
				expect(res.body).to.have.length(15);
			})
			.end(done);
		});

		it('each location has 6 properties',  (done) => {
			api.get('/api/geolocations')
			.expect(200)
			.expect((res) => {
				res.body.forEach((_location) => {
					expect(_location).to.have.property('id');
					expect(_location).to.have.property('corps');
					expect(_location).to.have.property('branch');
					expect(_location).to.have.property('lat');
					expect(_location).to.have.property('lng');
					expect(_location).to.have.property('address');
				})
			})
			.end(done)
		});
	});

	describe('GET /api/geolocations&coprs="第三救災救護大隊"', () => {
		it('has 14 geolocations in 第三救災救護大隊 1 in 第一救災救護大隊',  (done) => {
			api.get('/api/geolocations?corps=第三救災救護大隊')
			.expect(200)
			.expect((res) => {
				expect(res.body).to.have.length(locations.length-1)
			})
			.end(done);
		});
	});

	describe('POST /api/geolocations', () => {
		let geo = {
			id 			: 1,
		  	corps 		: "第三救災救護大隊",  
		  	branch		: "第三救災救護大隊",
		  	lat 		:  25.0927297,
		  	lng 		: 121.4608639,
		  	address 	: "新北市蘆洲區長榮路792號6樓"
		};
		
		beforeEach((done) => {
			api.post('/api/geolocations')
			.send(locations[0])
			.expect(200)
			.end(done)
		});

		it('added 1 new geolocation data', (done) => {
			Geolocation.findOne({ address : geo.address } (err,geo) => {
				expect(geo.address).to.deep.equal(geo.address)
				done(err)
			})
		});
	});

	afterEach((done) => {
		Geolocation.remove({},done)
	});
});

