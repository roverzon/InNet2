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
	let io = socketio.listen(server);

	io.use(socketioJwt.authorize({
	  secret: config.secret,
	  handshake: true
	}));

	io.on('connection',(socket) => {
		sockets.push(socket);	
		socket.on('disconnect', () => {
			_.remove(sockets,socket);
			User.findOneAndUpdate({
				username : socket.decoded_token.username
			},{
				$set : {
					online : false,
					caseId : null 
				}
			}, (err) => {
				if (err) {
					return err
				} else{
					User.findOne({
						username : socket.decoded_token.username
					},(err,user) => {
						socket.emit('userDisconnect',{ username : user.username , online : user.online});
						return socket.broadcast.emit('userDisconnect',{ username : user.username , online : user.online});
					});
				};
			})
		});

		socket.on('login',() => {
			User.findOneAndUpdate({
				username : socket.decoded_token.username
			},{
				$set : {
					online : true
				}
			},(err) => {
				if (err) {
					return err
				} else{
					User.findOne({
						username : socket.decoded_token.username
					},(err,user) => {
						socket.emit('userLogin',{ username : user.username , online : user.online});
						return socket.broadcast.emit('userLogin',{ username : user.username , online : user.online});
					});
				};
			})
		});

		socket.on('logout',() => {
			User.findOneAndUpdate({
				username : socket.decoded_token.username
			},{
				$set :{
					online : false
				}
			},(err) => {
				if (err) {
					return err
				} else{
					User.findOne({
						username : socket.decoded_token.username
					},(err,user) => {
						socket.emit('userLogout',{ username : user.username , online : user.online});
						socket.broadcast.emit('userLogout',{ username : user.username , online : user.online});
						return socket.disconnect();
					});
				};
			})
		});

		socket.on('stateUpdate', (data) => {
			socket.broadcast.emit('progressUpdate', data);
			St.findOneAndUpdate({
				_id : data.id
			},{
				$set : {
					progress : data.progress,
					state 	 : data.progressState
				}
			},(err) => {
				if (err) {
					return err
				} else{
					return 
				};
			})
		});

		socket.on('timer',(st) => {
			socket.broadcast.emit('timerRunning', st);
			St.findOneAndUpdate(() => {
				_id : st.stId
			},{
				$set :{
					timerRunning : st.timerRunning
				}
			},(err) => {
				if (err) {
					return err
				} else{
					return 	
				};
			})
		});

		socket.on('createStrikeTeam', (strikeTeam) => {
			let newSt = new St({
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

			newSt.save((err,st) => {
				if (err) {return err};
				Member.populate(st,
					{path : "members", match : { onDuty : true }},
					(err, st) => {
						if (err) {
							return err
						} else {
							return io.sockets.emit('newSt', st);
						};
				})
			});

			strikeTeam.members.forEach((member) => {
				Member.findOneAndUpdate({
					_id : member._id
				},{
					$set : {
						isChecked : member.isChecked,
						group 	  : member.group
					}
				},(err) => {
					if (err) {return err};
				});
			});
		})

		socket.on('dismissStrikeTeam',(strikeTeam) => {
			socket.broadcast.emit('dismiss',{stId :strikeTeam.id});
			St.findOneAndUpdate({
				_id : strikeTeam.id 
			},{
				isDismissed : true 
			},(err) => {
				if (err) { return err };
			});

			strikeTeam.members.forEach((member) => {
				Member.findOneAndUpdate({
					_id : member._id
				},{
					isChecked : false
				},(err) => {
					if (err) { return err };
				});
			});
		});

		socket.on('updateStrikeTeam',(st) => {
			
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
			},(err) => {
				if (err) { return err }
				return
			});

			st.members.forEach((member) => {
				Member.findOneAndUpdate({
					_id : member._id
				},{
					$set : {
						isChecked : true,
						mission : member.mission,
						group : st.mission  
					}
				},(err) => {
					if (err) { return err };
					return 
				})
			});
		});
	});
}

exports.broadcast = ( topic , data) => {
	sockets.forEach((socket) => {
		socket.emit(topic, data);
	})
};
