'use strict';

const  _ 			= require('lodash');
const jwt 			= require('jsonwebtoken');
const socketio 		= require('socket.io');
const socketioJwt 	= require('socketio-jwt');
const User 			= require('./models/user');
const Member 		= require('./models/member');
const St 			= require('./models/strikeTeam');
const config 		= require('./config/config');
const sockets 		= [];
	
exports.connect = function(server){
	var io = socketio.listen(server);

	io.use(socketioJwt.authorize({
	  secret: config.secret,
	  handshake: true
	}));

	io.on('connection',function(socket){
		sockets.push(socket);	
		socket.on('disconnect', function(){
			_.remove(sockets,socket);
			User.findOneAndUpdate({
				username : socket.decoded_token.username
			},{
				$set : {
					online : false,
					caseId : null 
				}
			}, function(err){
				if (err) {
					return err
				} else{
					User.findOne({
						username : socket.decoded_token.username
					},function(err,user){
						socket.emit('userDisconnect',{ username : user.username , online : user.online});
						socket.broadcast.emit('userDisconnect',{ username : user.username , online : user.online});
					});
				};
			})
		});

		socket.on('login',function(){
			User.findOneAndUpdate({
				username : socket.decoded_token.username
			},{
				$set : {
					online : true
				}
			},function(err){
				if (err) {
					return err
				} else{
					User.findOne({
						username : socket.decoded_token.username
					},function(err,user){
						socket.emit('userLogin',{ username : user.username , online : user.online});
						socket.broadcast.emit('userLogin',{ username : user.username , online : user.online});
					});
				};
			})
		});

		socket.on('logout',function(){
			User.findOneAndUpdate({
				username : socket.decoded_token.username
			},{
				$set :{
					online : false
				}
			},function(err){
				if (err) {
					return err
				} else{
					User.findOne({
						username : socket.decoded_token.username
					},function(err,user){
						socket.emit('userLogout',{ username : user.username , online : user.online});
						socket.broadcast.emit('userLogout',{ username : user.username , online : user.online});
						socket.disconnect();
					});
				};
			})
		});

		socket.on('stateUpdate', function(data){
			socket.broadcast.emit('progressUpdate', data);
			St.findOneAndUpdate({
				_id : data.id
			},{
				$set : {
					progress : data.progress,
					state 	 : data.progressState
				}
			},function(err){
				if (err) {
					return err
				} else{
					return 
				};
			})
		});

		socket.on('timer',function(st){
			socket.broadcast.emit('timerRunning', st);
			St.findOneAndUpdate(function(){
				_id : st.stId
			},{
				$set :{
					timerRunning : st.timerRunning
				}
			},function(err){
				if (err) {
					return err
				} else{
					return 	
				};
			})
		});

		socket.on('createStrikeTeam', function(strikeTeam){
			var newSt = new St({
				id 				: strikeTeam.id, 
				caseId 			: strikeTeam.caseId, 
				branch  		: strikeTeam.branch, 
				director 		: strikeTeam.director, 
				position    	: strikeTeam.position, 
				positions 		: strikeTeam.positions, 
				group 			: strikeTeam.group, 
				groups			: strikeTeam.groups,
				area 			: strikeTeam.area,
				areas 			: strikeTeam.areas, 
				floor 			: strikeTeam.floor,
				floors 			: strikeTeam.floors,
				members 		: strikeTeam.memberIds, 
				workingTime 	: strikeTeam.workingTime,
				creator 		: strikeTeam.creator
			});

			// console.log(newSt)

			newSt.save(function(err,st){
				console.log(err)
				if (err) {return err};
				Member.populate(st,
					{path : "members", match : { onDuty : true }},
					function(err, st){
						if (err) {
							return err
						} else {
							io.sockets.emit('newSt', st);
						};
				})
			});

			strikeTeam.members.forEach(function(member){
				Member.findOneAndUpdate({
					_id : member._id
				},{
					$set : {
						isChecked : member.isChecked,
						group 	  : member.group
					}
				},function(err){
					if (err) {return err};
				});
			});
		})

		socket.on('dismissStrikeTeam',function(strikeTeam){
			socket.broadcast.emit('dismiss',{stId :strikeTeam.id});
			St.findOneAndUpdate({
				_id : strikeTeam.id 
			},{
				isDismissed : true 
			},function(err){
				if (err) { return err };
			});

			strikeTeam.members.forEach(function(member){
				Member.findOneAndUpdate({
					_id : member._id
				},{
					isChecked : false
				},function(err){
					if (err) { return err };
				});
			});
		});

		socket.on('updateStrikeTeam',function(st){
			
			socket.broadcast.emit('updateSt',st);
			St.findOneAndUpdate({
				_id : st.id
			},{
				$set : {
					position : st.position,
					area 	 : st.area, 
					floor 	 : st.floor,
					group 	 : st.group,
					members  : st.memberIds
				}
			},function(err){
				if (err) { return err }
				return
			});

			st.members.forEach(function(member){
				Member.findOneAndUpdate({
					_id : member._id
				},{
					$set : {
						isChecked : true,
						mission : member.mission,
						group : st.mission  
					}
				},function(err){
					if (err) { return err };
					return 
				})
			});
		});
	});
}

exports.broadcast = function( topic , data){
	sockets.forEach(function(socket){
		socket.emit(topic, data);
	})
};
