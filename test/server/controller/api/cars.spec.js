'use strict';

const expect 	= require('chai').expect;
const fs       	= require('fs');
const path 		= require('path');
const Car	   	= require('../../../../models/car');
const api 		= require('../../support/api');

describe('controllers.api.cars', () => {
	let cars,
		targetCorps 	= [ '第一救災救護大隊', '第三救災救護大隊'], 
		targetBranchs 	= [ '蘆洲分隊' ] 

	beforeEach((done) => {
		Car.remove({},done)
	});

	beforeEach((done) => {
		let file = path.join(__dirname,'../../../../config/memberDB/vehicleList.json')
		fs.readFile(file, 'utf8', (err, data) => {
			if (err)  throw err ;
			cars = JSON.parse(data);
			Car.create(cars,done);
		});
	});	

	describe('GET /api/cars',  () => {
		it('it has 219 vehicles', (done) => {
			api.get('/api/cars')
			.expect(200)
			.expect((res){
				expect(res.body).to.have.length(cars.length);
			})
			.end(done)
		});

		it('it matchs the number of cars belonged to the corps', (done) => {
			targetCorps.forEach((corps){
				let targetCorpsCars =  cars.filter((_car) => {
					return _car.corps == corps  
				});
				api.get('/api/cars?corps=' + corps)
				.expect(200)
				.expect((res) => {
					expect(res.body).to.have.length(targetCorpsCars.length);
				})
			});
			done()
		});

		it('it match the number of cars belonged to the branch', (done) => {
			targetBranchs.forEach((branch) => {
				let targetBranchCars =  cars.filter((_car) =>  {
					return _car.branch == branch  
				});
				api.get('/api/cars?branch=' + branch)
				.expect(200)
				.expect((res){
					expect(res.body).to.have.length(targetBranchCars.length);
				})
			});
			done()
		});

		it('it has 219 vehicles on duty', (done) => {
			api.get('/api/cars?onDuty=true')
			.expect(200)
			.expect((res) => {
				expect(res.body).to.have.length(219)
			})
			.end(done)
		});
	});

	let testCar = {
	  type 		: "測試車輛",
	  corps 	: "第一救災救護大隊",
	  branch 	: "第一救災救護大隊",
	  radioCode	: "第一000",
	  code 		: 000,
	  functions : "測試資料"
	}

	describe('POST /api/cars', () => {
		beforeEach( (done) => {
			api.post('/api/cars')
			.send(testCar)
			.end(done)
		})

		it('it adds a new car',(done) => {
			Car.findOne({
				type : testCar.type
			},(err,_car) => {
				if (err) { return err };
				expect(_car).to.have.deep.not.equals(testCar);
				expect(_car.id).to.be.a('number');
				expect(_car.id).to.be.equals(cars.length + 1)
				expect(_car.onDuty).to.be.equals(true)
				expect(_car.isChecked).to.be.equals(false)
				done()
			})
		});
	});

	describe('PUT /api/cars/:id', () => {

		let carId;

		beforeEach( (done) => {
			api.post('/api/cars')
			.send(testCar)
			.expect(200)
			.end(done)
		})

		beforeEach( (done) => {
			Car.findOne({
				radioCode : testCar.radioCode
			},(err,_car) => {
				if (err) { return err };
				api.put('/api/cars/' + _car._id )
				.send({
					isChecked : true
				})
				.expect(200)
				.end(done)
			})
		});

		it('it has a car isChecked changed to true',  (done) => {
			Car.findOne({
				radioCode : testCar.radioCode 
			},(err,_car) => {
				if (err) { return err };
				expect(_car.isChecked).to.be.equals(true)
				done();
			});	
		});	
	});

	afterEach( (done) => {
		Car.remove({},done)
	});
});