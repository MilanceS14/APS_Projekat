import { Template } from 'meteor/templating';

TopTen = new Mongo.Collection('top_10');
Rooms = new Mongo.Collection('rooms');
Words = new Mongo.Collection('words');
SaveRooms = new Mongo.Collection('save_rooms');

const messages = new Mongo.Collection(null);
import { ReactiveVar } from 'meteor/reactive-var';

countdown = new ReactiveCountdown();

var canvas, canvas1, ctx, flag = false,		
	        prevX = 0,		
	        currX = 0,		
	        prevY = 0,		
	        currY = 0,
			lineBeginX=0,
			lineBeginY=0,
			onlyInsert=false,
	        dot_flag = false;	
			
	 var position;

	 var interval;

	 var arrya_points_draw = [];		
			
	    var x = "black",		
	        y = 2;		

//definisem stream
const streamer = new Meteor.Streamer('chat');

Session.set("firstTimeOnSite",0);

Session.set("numberOfPoints",0);

Session.set("gameStatus", "");

Session.set("numberRounds", 0); //nijedna runda nije odigrana

uradioFunkciju = false;


returnRooms = new ReactiveVar(Rooms.find({gameStatus: "0"}));
var tipSobe = "Public";

var id_room;
var id_rly_1;
var id_room_url;
var currentUser;
var currentRoom;
var UserInformation;
Meteor.startup(function () {

    sAlert.config({
        effect: '',
        position: 'top-right',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
       
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        
        onClose: _.noop
    });


});


Router.route('/register',{
	name: 'register',
	template: 'register',

	onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(!currentUser){
            this.next();

        } else {

            Router.go('loby');
        }
    }
});
Router.route('/guess/:_id',{
	name: 'guess',
	template: 'guess',


	onBeforeAction: function(){

        var currentUser = Meteor.userId();


        if(currentUser)
        {
           id_room_url = this.params._id;

   	 		Session.set("id_room_url",id_room_url);
   	 		this.next();
        } 

        else 
        {
            Router.go('home');
        }
    }
});


Router.route('/', {
	name: 'home',
	template: 'home',


	onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(!currentUser){
            this.next();
        } else {
            Router.go('loby');
        }
    }
});
Router.configure({
	layoutTemplate: 'main'
});
Router.route('/forgot',{
  name: 'forgot'
});
Router.route('/loby',{
	name: 'loby',
	template: 'loby',

	onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser){

        	this.next();

        } else {
            Router.go('home');
        }
    }
});

	$("select.image-picker").imagepicker({});
		
			sendMessage = function(text) {
				streamer.emit('message', {
					type: 'user',
					user: Meteor.user() ? Meteor.user().username : 'anonymous',
					text: text,
					name: currentUser,
					img: UserInformation.profile.avatar

				});
				messages.insert({
					type: 'self',
					user:  Meteor.user().username,
					text: text,
					name: currentUser,
					img: UserInformation.profile.avatar
				});
				
			};

			streamer.on('message', function(message) {
				messages.insert(message);
				var messageBody = document.querySelector('#chatlog');
				messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
			});
if(Meteor.isClient)
{
	//Forma za registraciju
	Template.register.events({
		//zabranjujem space karaktere
		'keypress .registerForm': function(event){
			var code = event.charCode || event.keyCode;
		  	if(code == 32)
		    	return false;
		},
	    'submit .registerForm': function(event){
	        event.preventDefault();
	        var username = event.target.username.value;
	        var email = event.target.email.value;
	        var password = event.target.password.value;
	        var password_confirm = event.target.password_confirm.value;
	        var points = 0;

	        if(password == password_confirm)
	        {
		        Accounts.createUser({
		        	username: username,
		            email: email,
		            profile: {
				        points: points,
				        avatar: "/images/user.png",
				        in_game: false
				    },
		            password: password
		            
		        }, function(error){
					    // code goes here    
					    if(error){
					    	$("#errorRegister").html("<p style='color:red;'>"+error.reason+"</p>");
					        console.log(error.reason); // Output error if registration fails
					    }

					    else
					    {
					    	Meteor.logout();
					    	Router.go('home');
					    }
				});
	       	}

	       	else
	       	{
	       		$("#errorRegister").html("<p style='color:red;'>Password no match</p>");
	       	}
	    }
	});

	Template.home.events({
		//zabranjujem space karaktere
		'keypress .loginForm': function(event){
			var code = event.charCode || event.keyCode;
		  	if(code == 32)
		    	return false;
		},
	    'submit .loginForm': function(event){
	        event.preventDefault();
	        var username = event.target.username.value;
	        var password = event.target.password.value;

	        Meteor.loginWithPassword(username, password, function(error){
			    if(error)
			    {
			        $("#errorLogin").html("<p style='color:red;'>"+error.reason+"</p>");
			    } 
			    else 
			    {
			        Router.go('loby');
			    }
			});
	    }

	});

	Template.loby.events({
		'click .logout': function(event){
	    	Meteor.logout();
	    	Router.go('home');
	    },

	    'click .changeAvatar': function(event){
	    	var avatar_tmp = $(".selectAvatar").val();
	    	Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": avatar_tmp}});
	    },

	    'click .savePassword': function(event){

	    	var oldPassword = $("#oldPassword").val();
	    	var newPassword = $("#newPassword").val();
	    	var confirmNewPassword = $("#confirmNewPassword").val();

	    	if( (oldPassword.length >= 6 && oldPassword.length <= 15) && (newPassword.length >= 6 && newPassword.length <= 15) )
	    	{

		    	if(newPassword == confirmNewPassword)
		    	{
		    		Accounts.changePassword(oldPassword, newPassword, function(error){

					    if(error)
					    {

							sAlert.error(error.reason, {timeout: 2000, position: 'top'});
					    } 

					    else
					    {
					    	sAlert.success('Change password successfuly', {timeout: 2000, position: 'top'});
					    	$("#oldPassword").val("");
					    	$("#newPassword").val("");
					    	$("#confirmNewPassword").val("");
					    }
				    
					});
		    	}

		    	else
		    	{
		    		//ne podudaraju se sifre
		    		sAlert.error('Password mismatch', {timeout: 2000, position: 'top'});
		    	}
		    }
		    else
		    {
		    	sAlert.error('Password must be between 6 and 15 characters', {timeout: 2000, position: 'top'});
		    	//previse karaktera
		    }
	    	
	    },

	    'click .createRoom': function(event){
	    	var roomName = $(".roomName").val();
	    	var roomImage = $(".roomImage").val();
	    	var maxPlayer = $(".maxPlayer").val();
	    	var numberRounds = $(".numberRounds").val();
	    	var timeRound = $(".timeRound").val();
	    	var passwordRoom = $(".passwordRoom").val();

	    	if(roomName.length >= 6 && roomName.length <= 30)
	    	{
	    		if(maxPlayer >= 2 && maxPlayer <= 8)
	    		{
	    			if(numberRounds >= 1 && numberRounds <= 20)
	    			{
	    				if((passwordRoom.length >= 6 && passwordRoom.length <= 15) || passwordRoom.length == 0)
	    				{
					    	$("#closeModal").click();

					    	//gameStatus oznacava da li je igra pocela ili ne 0-igra nije statovana 1-igra startovana

					    	//roomType oznacava da li je soma private ili publuc, false-public, true-private

					    	if(passwordRoom.length > 0)
					    	{
					    		id_rly_1 = Rooms.insert({ name: roomName, image: roomImage, maxPlayer: maxPlayer, numberRounds: numberRounds, timeRound: timeRound, passwordRoom: passwordRoom, player_ids: [Meteor.userId()], pointsArray: [], player_points: [0], gameStatus: "0", roomType: true, drawIdPlayer: Meteor.userId(), currentWord: "", winPlayer: 0, currentRound: 0, player_ids_now: []});
					    	}

					    	else
					    	{
					    		id_rly_1 = Rooms.insert({ name: roomName, image: roomImage, maxPlayer: maxPlayer, numberRounds: numberRounds, timeRound: timeRound, passwordRoom: passwordRoom, player_ids: [Meteor.userId()], pointsArray: [], player_points: [0], gameStatus: "0", roomType: false, drawIdPlayer: Meteor.userId(), currentWord: "", winPlayer: 0, currentRound: 0, player_ids_now: []});
					    	}

					    	Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": true}});

					    	Session.set("id_room",id_rly_1);
					    	window.location.href = "/guess/"+id_rly_1;
					    }

					    else
					    {
					    	sAlert.error('Password must be between 6 and 15 characters OR no password', {timeout: 2000, position: 'top'});
					    }
					}

					else
					{
						sAlert.error('Number of Rounds must be between 1 and 20 characters', {timeout: 2000, position: 'top'});
					}
			    }

			    else
			    {
			    	sAlert.error('Max player must be between 2 and 8 characters', {timeout: 2000, position: 'top'});
			    }
		    }

		    else
		    {
		    	sAlert.error('Room name must be between 6 and 30 characters', {timeout: 2000, position: 'top'});
		    }

	    },

	    'click #closeModal': function(event){
	    	$("#closeModal").modal('hide');
	    },

	    'change #sel1': function(event){

	    	var tipSobe = $("#sel1").val();

	    	if(tipSobe == "All")
	    	{
	    	}

	    	else if(tipSobe == "Saved")
	    	{
	    		returnRooms.set(SaveRooms.find({player_ids: Meteor.userId()}));
	    	}

	    	else
	    	{
	    		returnRooms.set(Rooms.find({gameStatus: "0"}));
	    	}

	    },

	    'click .imgClick': function(event){

	    	var id_element = event.target.id;

	    	var id_element_arr = id_element.split('.');

	    	var id_rly = id_element_arr[1];

	    	var room_tmp = Rooms.findOne({_id: id_rly});

	    	if(room_tmp)
	    	{

		    	var max_player = room_tmp.maxPlayer;

		    	var trenutno_player = room_tmp.player_ids.length;


		    	if( max_player == (trenutno_player + 1) )
		    	{

		    		Rooms.update({_id: id_rly}, {$addToSet: {player_ids: Meteor.userId()}});
		    		Rooms.update({_id: id_rly}, {$push: {player_points: 0}});

		    		Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": true}});

		    		Session.set("id_room",id_rly);
			    	window.location.href = "/guess/"+id_rly;
		    	}

		    	else if( max_player > trenutno_player)
		    	{
		    		Rooms.update({_id: id_rly}, {$addToSet: {player_ids: Meteor.userId()}});
		    		Rooms.update({_id: id_rly}, {$push: {player_points: 0}});

		    		Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": true}});

		    		Session.set("id_room",id_rly);

			    	window.location.href = "/guess/"+id_rly;
		    	}
		    }

		    else
		    {
		    	var room_tmp = SaveRooms.findOne({_id: id_rly});

		    	if(room_tmp)
		    	{
		    		SaveRooms.update({_id: id_rly}, {$addToSet: {player_ids_now: Meteor.userId()}});

		    		Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": true}});

		    		Session.set("id_room",id_rly);

			    	window.location.href = "/guess/"+id_rly;

			    }
		    }
	    }


	});

	//promenjive koja pamti da li je user regsitrovan ili ne
	Template.loby.helpers({
		user_id: function(){
			var user_login;
			if(Meteor.userId())
			{
				user_login = true;
			}

			else
			{
				user_login = false;
			}

			return user_login;
		},

		topUsers: function(){
			
			return TopTen.find();
		},

		playerUsername: function(){
	    	var user_tmp = Meteor.users.findOne({_id: Meteor.userId()});
			return user_tmp && user_tmp.username;
		},

		playerAvatar: function(){
			var user_tmp = Meteor.users.findOne({_id: Meteor.userId()});
			return user_tmp && user_tmp.profile.avatar;
		},

		rooms: function(){
			return returnRooms.get();
		},

		id_room_rly: function(){
			return id_rly_1;
		}

		
	});

	Template.home.helpers({
		user_id: function(){
			var user_login;
			if(Meteor.userId())
			{
				user_login = true;
			}

			else
			{
				user_login = false;
			}

			return user_login;
		}
	});

	Template.register.helpers({
		user_id: function(){
			var user_login;
			if(Meteor.userId())
			{
				user_login = true;
			}

			else
			{
				user_login = false;
			}

			return user_login;
		}
	});

	Template.forgot.helpers({
		user_id: function(){
			var user_login;
			if(Meteor.userId())
			{
				user_login = true;
			}

			else
			{
				user_login = false;
			}

			return user_login;
		}
	});

	var i = 0;

	Template.guess.helpers({

	
		checkRoomName: function(name1, name2)
				{
					for(i=0; i < name1.length; i++)
					{
					if(name1[i] === name2)
					{
						return true;
						
					}
					}
					return false;
				},
	roomName(){
			var room = Rooms.findOne({_id: Session.get("id_room_url")});
			return room.player_ids;
		},
		messages() {
			return messages.find();
		},

		playersInfoInRoom: function(){
			var jsonObj = [];

			var allUsersInRoom = Rooms.findOne({_id: Session.get("id_room_url")});

			i++;

			if(allUsersInRoom)
			{
				for(var j = 0; j < allUsersInRoom.player_ids.length; j++)
				{
					var item = {};

					var usersInfo = Meteor.users.findOne({_id: allUsersInRoom.player_ids[j]});

					if(usersInfo)
					{
						item["username"] = usersInfo.username;
				        item["image"] = usersInfo.profile.avatar;
				        item["points"] = allUsersInRoom.player_points[j];

				        jsonObj.push(item);
				    }
				}

				return jsonObj;
			}

			else
			{
				var allUsersInRoom = SaveRooms.findOne({_id: Session.get("id_room_url")});

				i++;

				if(allUsersInRoom)
				{
					if(allUsersInRoom.player_ids.length == allUsersInRoom.player_ids_now.length)
				    {
				    	if(allUsersInRoom.drawIdPlayer == Meteor.userId())
				    	{
				    		SaveRooms.update({_id: Session.get("id_room_url")}, {$set: {gameStatus: "2", player_ids_now: []}});
					    	Rooms.insert(SaveRooms.findOne({_id: Session.get("id_room_url")}));
					    	SaveRooms.remove({_id: Session.get("id_room_url")});
					    }

				    }

					for(var j = 0; j < allUsersInRoom.player_ids_now.length; j++)
					{
						var item = {};

						var usersInfo = Meteor.users.findOne({_id: allUsersInRoom.player_ids_now[j]});

						if(usersInfo)
						{
							item["username"] = usersInfo.username;
					        item["image"] = usersInfo.profile.avatar;
					        item["points"] = allUsersInRoom.player_points[j];

					        jsonObj.push(item);
					    }

					}

					return jsonObj;
				}
			}

			return null;

		},

		test: function(){

			if(Meteor.userId() != Session.get("drawIdPlayer") || Session.get("firstTimeOnSite") == 0)
	    	{
	    		var p = Session.get("numberOfPoints");

				var query = Rooms.findOne({_id: Session.get("id_room_url")});

				if(query)
				{
					if(query.pointsArray.length == 0)
					{
						arrya_points_draw = [];
						erase();
					}

					var boja;
					var canvas = document.getElementById('can');
					var ctx = canvas.getContext("2d");

					for( p; p < query.pointsArray.length; p++ )
			    	{
			    		switch(query.pointsArray[p])
			    		{
			    			case 0:
			    				boja = query.pointsArray[++p];
			    			break;

			    			case 1:

			    			break;

			    			case 2:
								ctx.strokeStyle = boja;	
			    				ctx.beginPath();
			    				ctx.moveTo(query.pointsArray[p - 2],query.pointsArray[p - 1]);	
								if(boja=="white")
								{
									ctx.lineWidth=15;
								}
								else
								{
									ctx.lineWidth=y;
								}
			    				ctx.lineTo(query.pointsArray[++p],query.pointsArray[++p]);
				       			ctx.stroke();
			    				ctx.closePath();
			    			break;

			    			case 3:
								ctx.strokeStyle = boja;
			    				ctx.beginPath();
			    				//ctx.fillRect(query.pointsArray[++p],query.pointsArray[++p],2,2);							
			    				ctx.closePath();
			    			break;
			    		}
			    	}
			    	Session.set("numberOfPoints", query.pointsArray.length);

			    	Session.set("firstTimeOnSite",1);
			    }
		    }

			return true;
		},

		keyWord: function(){

			var keyWord = "";

			var id_room_url_new = Session.get("id_room_url");

			var his_room = Rooms.findOne({_id: id_room_url_new, player_ids: Meteor.userId()});

			if(his_room)
				Session.set("drawIdPlayer",his_room.drawIdPlayer);

			if(Meteor.userId() == Session.get("drawIdPlayer"))
			{
				var id_room_url_new = Session.get("id_room_url");

				if(id_room_url_new)
				{
					var his_room = Rooms.findOne({_id: id_room_url_new, player_ids: Meteor.userId()});
					if(his_room)
					{
						keyWord = his_room.currentWord;
					}
				}
			}

			return keyWord;
		},

		drawIdPlayer: function(){
			var id_room_url_new = Session.get("id_room_url");

			var his_room = Rooms.findOne({_id: id_room_url_new, player_ids: Meteor.userId()});

			if(his_room)
				Session.set("drawIdPlayer",his_room.drawIdPlayer);

			return his_room.drawIdPlayer;
		},

		haveStartButton: function(){
			//ispitujemo da li igra nije startovana i da li je igrac admin
			var room_query = Rooms.findOne({_id: id_room_url});

			if(room_query)
			{

				if(room_query.drawIdPlayer == Meteor.userId() && (room_query.gameStatus == "0" || room_query.gameStatus == "2") && room_query.player_ids.length >= 2 )
				{
					return true;
				}
				else
				{
					return false;
				}
			}
		},

		isDrawUser: function(){
			var room_query = Rooms.findOne({_id: id_room_url});

			if(room_query)
			{

				if(room_query.drawIdPlayer == Meteor.userId())
				{
					return true;
				}

				else
				{
					var pen = document.getElementById("can");
					pen.style.cursor = "default";
					return false;
				}
			}
		},


		isGameStarted: function(){
			var room_query = Rooms.findOne({_id: id_room_url});

			if(room_query)
			{
				if(Session.get("gameStatus") != "" && Session.get("gameStatus") != room_query.gameStatus)
				{
					Session.set("gameStatus", room_query.gameStatus);
					if(room_query.gameStatus == "1")
					{

						countdown = new ReactiveCountdown(room_query.timeRound,
						{
							//posle svakog tika radi nesto
							tick: function() 
							{
								var firstquad = room_query.timeRound/4;
								var secnd = room_query.timeRound/2;
								var thirdquad = (room_query.timeRound*3)/4;
								crtanje(room_query.timeRound, firstquad, secnd, thirdquad);
							}

						});
						//startujem tajmer

						countdown.start(function() {


					        $(".data-progress").removeAttr("style");

					        $(".quad1").removeAttr("style");
					        $(".quad2").removeAttr("style");
					        $(".quad3").removeAttr("style");
					        $(".quad4").removeAttr("style");

					        $(".data-progress").attr("data-progress","0");

							$('#myModal').modal({
							    backdrop: 'static',
							    keyboard: false
							});

							setTimeout( function(){ $('#closeMyModal').click(); FinishRound("-1"); }, 10000);


						});
						return true;
					}

					else if(room_query.gameStatus == "-1")
					{
						if(Meteor.userId() == Session.get("drawIdPlayer"))
						{
							if(!uradioFunkciju)
							{
								uradioFunkciju = true;
								setTimeout(function(){
									Meteor.call('updateusersPointsNoDelete', room_query.player_points, room_query.player_ids, id_room_url ,function(err, response) {
										console.log(response);

										var tmp = Rooms.findOne({_id: id_room_url});
										Rooms.remove({_id: id_room_url});
										SaveRooms.insert(tmp);
										erase();
										Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

										Router.go('loby');
									});
								}, 1000);
							}
						}

						else
						{
							//status u User da kazem da nije u sobu

							Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

							//redirektujem igrace u loby
							
							Router.go('loby');
						}
						
					}

					else
					{
						return false;
					}
				}

				else if(Session.get("gameStatus") == "")
				{
					Session.set("gameStatus", room_query.gameStatus);

					if(room_query.gameStatus == "1")
					{
						countdown = new ReactiveCountdown(room_query.timeRound,
						{
							//posle svakog tika radi nesto
							tick: function() 
							{
								var firstquad = room_query.timeRound/4;
								var secnd = room_query.timeRound/2;
								var thirdquad = (room_query.timeRound*3)/4;
								crtanje(room_query.timeRound, firstquad, secnd, thirdquad);
							}

						});

						//startujem tajmer

						countdown.start(function() {
							
							//kada istekne vreme sta se radi
							

					        $(".data-progress").removeAttr("style");

					        $(".quad1").removeAttr("style");
					        $(".quad2").removeAttr("style");
					        $(".quad3").removeAttr("style");
					        $(".quad4").removeAttr("style");

					        $(".data-progress").attr("data-progress","0");

					        $('#myModal').modal({
							    backdrop: 'static',
							    keyboard: false
							});

							setTimeout( function(){ $('#closeMyModal').click(); FinishRound("-1"); }, 10000);

						});
						return true;
					}

					else if(room_query.gameStatus == "-1")
					{

						if(Meteor.userId() == Session.get("drawIdPlayer"))
						{
							if(!uradioFunkciju)
							{
								uradioFunkciju = true;
								setTimeout(function(){
									Meteor.call('updateusersPointsNoDelete', room_query.player_points, room_query.player_ids, id_room_url ,function(err, response) {
										var tmp = Rooms.findOne({_id: id_room_url});
										Rooms.remove({_id: id_room_url});
										SaveRooms.insert(tmp);
										erase();
										Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

										Router.go('loby');
									});
								}, 1000);
							}
						}

						else
						{
							//status u User da kazem da nije u sobu

							Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

							//redirektujem igrace u loby
							
							Router.go('loby');
						}
						
					}

					else
					{
						return false;
					}
				}

				else
				{
					if(room_query.gameStatus == "1"){
						return true;
					}

					else if(room_query.gameStatus == "-1")
					{
						if(Meteor.userId() == Session.get("drawIdPlayer"))
						{
							if(!uradioFunkciju)
							{
								uradioFunkciju = true;
								setTimeout(function(){

									Meteor.call('updateusersPointsNoDelete', room_query.player_points, room_query.player_ids, id_room_url ,function(err, response) {
										var tmp = Rooms.findOne({_id: id_room_url});
										Rooms.remove({_id: id_room_url});
										SaveRooms.insert(tmp);
										erase();
										Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

										Router.go('loby');
									});
								}, 1000);
							}
						}

						else
						{
							//status u User da kazem da nije u sobu

							Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

							//redirektujem igrace u loby
							
							Router.go('loby');
						}

						return false;
						
					}

					else{
						return false;
					}
				}
			}
		},

		gameFinishWon: function() {
			var room_query = Rooms.findOne({_id: id_room_url});

			if(room_query)
			{
				if(room_query.gameStatus == "3")
				{
					countdown.stop();

					clearInterval();

					$(".data-progress").removeAttr("style");

			        $(".quad1").removeAttr("style");
			        $(".quad2").removeAttr("style");
			        $(".quad3").removeAttr("style");
			        $(".quad4").removeAttr("style");

			        $(".data-progress").attr("data-progress","0");

					$('#myModal').modal({
					    backdrop: 'static',
					    keyboard: false
					});

					setTimeout( function(){ $('#closeMyModal').click(); FinishRound("1"); }, 10000);
				}
			}
		},

		returnTypeScreen: function () {
			var room_query = Rooms.findOne({_id: id_room_url});

			if(room_query)
			{
				if(room_query.gameStatus == "3")
				{
					//znaci da je pogodjena rec
					return true;
				}

				else
				{
					//znaci da je vreme isteklo i da rec nije pogodjena
					return false;
				}
			}
		},

		returnWinPlayer: function(){
			var room_query = Rooms.findOne({_id: id_room_url});

			if(room_query)
			{
				id_player_won = room_query.winPlayer;

				var query = Meteor.users.findOne({_id: id_player_won});

				return query.username;
				
			}
		},

		returnNumberOfRounds: function(){
			var room_query = Rooms.findOne({_id: id_room_url});

			if(room_query)
			{
				return room_query.numberRounds;
			}
		},

		retunrNumberOfCurrentround: function(){
			var room_query = Rooms.findOne({_id: id_room_url});

			if(room_query)
			{
				return room_query.currentRound + 1;
			}
		},

		retunrIsLastroundFinish: function(){
			var room_query = Rooms.findOne({_id: id_room_url});

			if(room_query)
			{
				if(room_query.numberRounds == room_query.currentRound + 1)
				{
					return true;
				}

				else
				{
					return false;
				}
			}
		},

		keyWord_all_see: function(){

			var keyWord = "";


			var his_room = Rooms.findOne({_id: id_room_url});

			if(his_room)
			{
				keyWord = his_room.currentWord;
			}
			

			return keyWord;
		},

		canDeleteRoom: function(){
			var his_room = Rooms.findOne({_id: id_room_url});

			if(his_room)
			{
				if(his_room.player_ids.length == 1)
				{
					return true;
				}

				else
				{
					return false;
				}
			}
		}
		
	});

	function FinishRound(type)
	{
		Session.set("numberRounds", Session.get("numberRounds") + 1);

		var id_room_url_new = Session.get("id_room_url");
		var his_room = Rooms.findOne({_id: id_room_url_new, player_ids: Meteor.userId()});

		if(Meteor.userId() == Session.get("drawIdPlayer"))
		{
			/*MOZE DA SE PROSLEDJUJE STATUS U FUNKCIJU I U ZAVISNOSTI OD TOGA DA SE DODAJU ILI BRISU POENI*/
			$("#can").off();

			var array_tmp = [];

			if(type == "1")
			{

				var player_win_id = his_room.winPlayer;

				var time_rest = countdown.get();

				var points_for_draw_player = Math.round(time_rest * 0.2);

				var points_for_win_player = Math.round(time_rest * 1);

				for(var i = 0; i < his_room.player_ids.length; i++)
	    		{
	    			if(Session.get("drawIdPlayer") == his_room.player_ids[i])
	    			{
	    				array_tmp.push(his_room.player_points[i] + points_for_draw_player);
	    			}

	    			else if(player_win_id == his_room.player_ids[i])
	    			{
	    				array_tmp.push(his_room.player_points[i] + points_for_win_player);
	    			}

	    			else
	    			{
	    				array_tmp.push(his_room.player_points[i]);
	    			}
	    		}
	    	}

	    	else if(type == "-1")
	    	{
	    		var time_all = his_room.timeRound;

    			var points_for_draw_player = Math.round(time_all * 0.2);

    			var points_for_other_plater = Math.round(time_all * 0.1);

    			

    			for(var i = 0; i < his_room.player_ids.length; i++)
	    		{
	    			if(Session.get("drawIdPlayer") == his_room.player_ids[i])
	    			{
	    				array_tmp.push(his_room.player_points[i] - points_for_draw_player);
	    			}

	    			else
	    			{
	    				array_tmp.push(his_room.player_points[i] - points_for_other_plater);
	    			}
	    		}
	    	}


    		if(his_room.numberRounds == his_room.currentRound + 1)
    		{
    			//brisem sve iz baze za tu sobu
    			setTimeout(function(){
	    			Meteor.call('updateusersPoints', array_tmp, his_room.player_ids, id_room_url_new ,function(err, response) {
						console.log(response);
						erase();
						Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

						Router.go('loby');
					});	}, 1000);

    			/*update poene u user acc */
    		}

    		else
    		{

    			var currentRound_tmp = his_room.currentRound + 1;

    			if(type == "-1")
    			{
		    		var index_next_player = 0;

		    		for(var i = 0; i < his_room.player_ids.length; i++)
		    		{
		    			if(Session.get("drawIdPlayer") == his_room.player_ids[i])
		    			{
		    				index_next_player = i + 1;

		    				if(index_next_player == his_room.player_ids.length)
		    				{
		    					index_next_player = 0;
		    				}

		    				break;
		    			}
		    		}

		    		Rooms.update({_id: id_room_url_new}, {$set: {"gameStatus": "2", "pointsArray": [], "drawIdPlayer": his_room.player_ids[index_next_player], "currentRound": currentRound_tmp , "currentWord": ""} } );
		    	}

		    	else if(type == "1")
		    	{
		    		Rooms.update({_id: id_room_url_new}, {$set: {"gameStatus": "2", "pointsArray": [], "drawIdPlayer": his_room.winPlayer, "currentRound": currentRound_tmp, "currentWord": "" } } );
		    	}

	    		arrya_points_draw = [];

	    		/*update poene */
	    		Rooms.update({ _id: id_room_url_new },{ $pullAll: { player_points: his_room.player_points } } );

    			Rooms.update({ _id: id_room_url_new },{ $pushAll: { player_points: array_tmp } } );

	    		Session.set("drawIdPlayer",his_room.player_ids[index_next_player]);
	    	}
    	}

    	else
    	{

	        erase();
	        if(his_room.numberRounds == his_room.currentRound + 1)
			{
				//status u User da kazem da nije u sobu

				Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

				//redirektujem igrace u loby
				
				Router.go('loby');
			}
		}
		
	}
		
	Template.guess.rendered = function() {		
	    if(!this._rendered) {		
	      this._rendered = true;		
	    }		
	}

	Template.guess.events({

		'click #start': function(event){

			Meteor.call('startGame',Session.get("id_room_url") ,function(err, response) {
				console.log(response);
				Session.set("drawIdPlayer",response);

				//stavljam da ima pen u ruku da se ne bi desio bug
				$("#penblack").click();
				init();
			});


		},

		'click #deleteRoom': function(event){

			var id_room_url_new = Session.get("id_room_url");
			var his_room = Rooms.findOne({_id: id_room_url_new, player_ids: Meteor.userId()});

			Meteor.call('updateusersPoints', his_room.player_points, his_room.player_ids, id_room_url_new ,function(err, response) {
				console.log(response);
				erase();
				Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

				Router.go('loby');
			});
		},

		'click #saveGame': function(event){
			SaveRooms.remove({_id: id_room_url});
			
			Rooms.update({_id: id_room_url}, {$set: {"gameStatus": "-1", "roomType": true } } );
		},

		'click #closeMyModal': function(event){
			event.preventDefault();

			$('#closeMyModal').modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		},

		'click #clearCanvas': function(event) {

			Rooms.update({_id: id_room_url}, {$set: {"pointsArray": [] } } );
		    
	    	arrya_points_draw = [];
			erase();
			
		},

		'click #leaveRoom': function(event) {
			var his_room = Rooms.findOne({_id: id_room_url});

			if(his_room)
			{
				var index;

				for(var i = 0; i < his_room.player_ids.length; i++)
				{
					if(his_room.player_ids[i] == Meteor.userId())
					{
						index = i;
						break;
					}
				}
				var query = Meteor.users.findOne({_id: Meteor.userId()});

				var ukupno = query.profile.points + his_room.player_points[index];

				Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.points": ukupno}});

				var tmp = his_room.player_points;

				var pomocni_niz = tmp.splice(index, 1);

				var all_users = Meteor.users.find({}).fetch();

				all_users.sort(function(a, b) {
				  return b.profile.points - a.profile.points;
				});

				if(all_users.length > 10)
					all_users.length = 10;

				for(var i = 0; i < all_users.length; i++)
				{
					TopTen.remove({_id: all_users[i]._id});
					TopTen.insert({_id: all_users[i]._id, mesto: i + 1, username: all_users[i].username, points: all_users[i].profile.points});
				}

				Rooms.update({ _id: id_room_url },{ $pull: { player_ids:  his_room.player_ids[index] } });
				Rooms.update({ _id: id_room_url },{ $pullAll: { player_points: his_room.player_points } } );

    			Rooms.update({ _id: id_room_url },{ $pushAll: { player_points: pomocni_niz } } );

    			//status u User da kazem da nije u sobu

				Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

				//redirektujem igrace u loby
				
				Router.go('loby');
			}

			else
			{
				var his_room = SaveRooms.findOne({_id: id_room_url});

				if(his_room)
				{
					var index;

					for(var i = 0; i < his_room.player_ids_now.length; i++)
					{
						if(his_room.player_ids_now[i] == Meteor.userId())
						{
							index = i;
							break;
						}
					}


					Rooms.update({ _id: id_room_url },{ $pull: { player_ids:  his_room.player_ids_now[index] } });

	    			//status u User da kazem da nije u sobu

					Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.in_game": false}});

					//redirektujem igrace u loby
					
					Router.go('loby');
				}
			}
		},

			'click #chatsend': function(event){

			var message = $('#sendMessageChat').val();


						currentUser = Meteor.userId();
						 currentRoom = Rooms.findOne({_id: id_room_url, player_ids: currentUser});
						 UserInformation = Meteor.users.findOne({_id: currentUser})

					sendMessage(message);
					$("#sendMessageChat").val("");
					var messageBody = document.querySelector('#chatlog');
				messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

		},
		'keypress #sendMessageChat': function(event){
			var code = event.charCode || event.keyCode;
		  	if(code == 13){
		  		if($("#chatsend").length > 0)
		    		$("#chatsend").click();
		  	}
		},

		'click #guessButton': function(event){

			var message_client = $("#sendMessage").val().toLowerCase();

			if(message_client != "")
			{

				$(".rowmessage-bubble").append("<p class='text-muted'>" + message_client + "</p>");

				var id_room_url_new = Session.get("id_room_url");
				var his_room = Rooms.findOne({_id: id_room_url_new, player_ids: Meteor.userId()});

				var rec = his_room.currentWord.toLowerCase();

				if(rec == message_client)
				{
					//pogodjena rec, obavesti server
					
					$(".rowmessage-bubble").append("<p class='text-muted' style='color:green;'>Correct word!</p>");

					Rooms.update({_id: id_room_url_new}, {$set: { "gameStatus": "3", "winPlayer": Meteor.userId() } } );
				}

				else
				{
								$(".rowmessage-bubble").append("<p class='text-muted' style='color:red;'>!Incorrect word!</p>");
				}

				$("#sendMessage").val("");
			}

			else
			{
			}
		},

		'keypress #sendMessage': function(event){
			var code = event.charCode || event.keyCode;
		  	if(code == 13){
		  		if($("#guessButton").length > 0)
		    		$("#guessButton").click();
		  	}
		},

		'click #penred': function(event)
		{
			var pen = document.getElementById("can");
 			pen.style.cursor = "url('/room/red.cur'), auto"
 			x="red";
 			y = 2;
 			arrya_points_draw.push(0);//naredba za boju
	        arrya_points_draw.push(x);

		},

		'click #penblue': function(event)
		{
			var pen = document.getElementById("can");
 			pen.style.cursor = "url('/room/blue.cur'), auto"
 			x="blue";
 			y = 2;
 			arrya_points_draw.push(0);//naredba za boju
	        arrya_points_draw.push(x);

		},

		'click #penyellow': function(event)
		{
			var pen = document.getElementById("can");
 			pen.style.cursor = "url('/room/yellow.cur'), auto"
 			x="yellow";
 			y = 2;
 			arrya_points_draw.push(0);//naredba za boju
	        arrya_points_draw.push(x);

		}
		,

		'click #pengreen': function(event)
		{
			var pen = document.getElementById("can");
 			pen.style.cursor = "url('/room/green.cur'), auto";
 			x="green";
 			y = 2;
 			arrya_points_draw.push(0);//naredba za boju
	        arrya_points_draw.push(x);

		},

		'click #penblack': function(event)
		{
			var pen = document.getElementById("can");
 			pen.style.cursor = "url('/room/black.cur'), auto";
 			x="black";
 			y = 2;
 			arrya_points_draw.push(0);//naredba za boju
	        arrya_points_draw.push(x);

		},

		'click #eraser': function(event)
		{
			var pen = document.getElementById("can");
 			pen.style.cursor = "url('/room/eraser.cur'), auto";
 			x="white";
 			y = 15;
 			arrya_points_draw.push(0);//naredba za boju
	        arrya_points_draw.push(x);
		}

	});

}

	//-----------------FUNKCIJA ZA ISPITIVANJE ULASKA U SOBU--------------

	function checkValidateData()
	{
			//ispitujem da li je igrac u nekoj sobi
			var currentUser = Meteor.userId();
			var is_in_room = Meteor.users.findOne({_id: Meteor.userId()});

			if(is_in_room && is_in_room.profile.in_game)
			{
				//ako jeste ispitujem da li je on u toj sobi
				var his_room = Rooms.findOne({_id: id_room_url, player_ids: currentUser});

				if(his_room)
				{
					//ako jeste super
					Session.set("id_room_url",id_room_url);

					Session.set("drawIdPlayer",his_room.drawIdPlayer);
				}

				else
				{
					var his_room = Rooms.findOne({player_ids: currentUser});
					//ako nije vracam ga u njegovu sobu
					Router.go('/guess/'+his_room._id);
				}
			}

			else
			{
				//ako igrac nije u ovoj sobi, ispitujem da li je igra pocela

				var his_room = Rooms.findOne({_id: id_room_url});

				if(his_room && his_room.gameStatus == "0")
				{
					//igra nije pocela ispitujemo br igraca

					if(his_room.maxPlayer > his_room.player_ids.length)
					{
						//ima slobodnih mesta

						if(his_room.passwordRoom.length == 0)
						{
							//nema sifru samo ga ubacujemo
							Rooms.update({_id: id_room_url}, {$addToSet: {player_ids: Meteor.userId()}});
							Rooms.update({_id: id_room_url}, {$push: {player_points: [0]}});
							Meteor.users.update({_id: currentUser}, {$set: {"profile.in_game": true}});
						}

						else
						{
							//ima sifra moramo da mu izbacim polje da unese
						}
					}

					else
					{
						//max igraca je u sobi
						Router.go('loby');
					}
				}

				else
				{
					//igra je pocela
					Router.go('loby');
				}
			}
		//}
	}

	//-----------------FUNKCIJA ZA CRTANJE---------------------
	    		
	    function init() 
	    {
	    	y = 2;		
	        canvas = document.getElementById('can');		
	        canvas1 = $( "#can" );		
	        ctx = canvas.getContext("2d");	
	        Session.set("ctx",ctx);	
	        w = canvas.width;		
	        h = canvas.height;		
			
	        position =  canvas1.offset();		
			
	    	if(Meteor.userId() == Session.get("drawIdPlayer"))
	    	{	
	    		$('#can').on("mousemove", function(event) {
	    			findxy('move', event)
	    		});

	    		$('#can').on("mousedown", function(event) {
	    			findxy('down', event)
	    		});

	    		$('#can').on("mouseup", function(event) {
	    			findxy('up', event)
	    		});

	    		$('#can').on("mouseout", function(event) {
	    			findxy('out', event)
	    		});
		    }

		    else
		    {
		    	$("#can").off();
		    }

		    	if(Session.get("firstTimeOnSite") == 0)
		    	{
		    		var p = Session.get("numberOfPoints");

					var query = Rooms.findOne({_id: Session.get("id_room_url")});

					var boja;

					if(query)
					{

						for( p; p < query.pointsArray.length; p++ )
				    	{
				    		switch(query.pointsArray[p])
				    		{
				    			case 0:
				    				boja = query.pointsArray[++p];
				    			break;

				    			case 1:

				    			break;

				    			case 2:
				    				ctx.beginPath();
				    				ctx.moveTo(query.pointsArray[p - 2],query.pointsArray[p - 1]);
				    				ctx.lineTo(query.pointsArray[++p],query.pointsArray[++p]);
				    				ctx.lineWidth = y;
				    				ctx.strokeStyle = boja;	
					       			ctx.stroke();
				    				ctx.closePath();
				    			break;

				    			case 3:
								
				    				ctx.beginPath();
				    				ctx.strokeStyle = boja;
				    				ctx.fillRect(query.pointsArray[++p],query.pointsArray[++p],2,2);		    							
				    				ctx.closePath();
				    			break;
				    		}

				    	}

				    	Session.set("numberOfPoints", query.pointsArray.length);

				    	Session.set("firstTimeOnSite",1);
				    }
		    	
		    	}
	    }		
	
	    		
	    function draw() {		
	        ctx.beginPath();		
			ctx.strokeStyle = x;		
	        ctx.moveTo(prevX, prevY);		
	        ctx.lineTo(currX, currY);

	        ctx.lineWidth = y;		
			ctx.stroke();		
	        ctx.closePath();		
	    }		
	    		
	    function erase() {		

	        	canvas = document.getElementById('can');		
	        canvas1 = $( "#can" );		
	        ctx = canvas.getContext("2d");	
	        Session.set("ctx",ctx);	
	        w = canvas.width;		
	        h = canvas.height;
	            ctx.clearRect(0, 0, w, h);		
	    }		
	    		
	    function save() {		
	        document.getElementById("canvasimg").style.border = "2px solid";		
	        var dataURL = canvas.toDataURL();		
	        document.getElementById("canvasimg").src = dataURL;		
	        document.getElementById("canvasimg").style.display = "inline";		
	    }		
	    

	    function findxy(res, e) {	
	        if (res == 'down') {
	        	
	            prevX = currX;		
	            prevY = currY;		
	            currX = e.clientX - position.left;		
	            currY = e.clientY - position.top;		
	    		
	            flag = true;		
	            dot_flag = true;		
	            if (dot_flag) {
	            	interval = setInterval(insertPointsInToDB(), 1000);
	                ctx.beginPath();		
	                ctx.fillStyle = x;		
	                ctx.fillRect(currX, currY, 2, 2);		
	                ctx.closePath();		
	                dot_flag = false;

					lineBeginX=currX;
					lineBeginY=currY
	                //Dot
	                arrya_points_draw.push(3);
	                arrya_points_draw.push(currX);
	                arrya_points_draw.push(currY);

	            }		
	        }		
	        if (res == 'up' || res == "out") {		
				if(flag)
				{
	                currX = e.clientX - position.left;		
	                currY = e.clientY - position.top;
					arrya_points_draw.push(currX);
					arrya_points_draw.push(currY);
				}
	            flag = false;
	            clearInterval(interval);
	            insertPointsInToDB();		
	        }		
	        if (res == 'move') {		
	            if (flag) 
				{		
	                prevX = currX;		
	                prevY = currY;		
	                currX = e.clientX - position.left;		
	                currY = e.clientY - position.top;

					var y=(prevX-lineBeginX)*(currY-lineBeginY)/(currX-lineBeginX) + lineBeginY;
					y=Math.round(y*100);
					if(Math.round(prevY*100)==y)
					{
						//lineBegin -- previous dot -- current dot
						//previous dot is on the current line, removing previous dot
						//LineTo
						if(onlyInsert==false)
						{
							arrya_points_draw.pop();
							arrya_points_draw.pop();
							arrya_points_draw.pop();
						}
						arrya_points_draw.push(2);
						arrya_points_draw.push(currX);
						arrya_points_draw.push(currY);
					}
					else
					{
						//previous dot isn't on the current line
						//LineTo
						arrya_points_draw.push(2);
						arrya_points_draw.push(currX);
						arrya_points_draw.push(currY);
						lineBeginX=currX;
						lineBeginY=currY;
						onlyInsert=true;
					}

	                draw();		
	            }		
	        }		
	    }

	    function insertPointsInToDB()
	    {
	    	Rooms.update({ _id: Session.get("id_room_url") },{ $push: { pointsArray: { $each: arrya_points_draw } } });
	    	arrya_points = [];
	    }

//------------------------------END---------------------------------------

crtanje = function(maxcounter, firstquad, secnd, thirdquad){

	var progressbar = document.querySelector('div[data-progress]'),
	quad1 = document.querySelector('.quad1'),
	quad2 = document.querySelector('.quad2'),
	quad3 = document.querySelector('.quad3'),
	quad4 = document.querySelector('.quad4'),
	timer = document.querySelector('timeout'),

			progress = progressbar.getAttribute('data-progress'); //uzimam trenutnu vrednost
			progress++;
			progressbar.setAttribute('data-progress',progress);
			setPie(progress);
		  function setPie(progress) {
	//prva cetvrtina
	if (progress <= firstquad) {
	  quad1.setAttribute('style', 'transform: skew(' + progress * (-90 / firstquad) + 'deg)'); //iscrtava prvi luk
	}

	//izmedju prve i druge, pravi drugu cetvrtinu
	else if (progress > firstquad && progress <= secnd) {
	  quad1.setAttribute('style', 'transform: skew(-90deg)'); // krije prvi luk
	  quad2.setAttribute('style', 'transform: skewY(' + (progress - firstquad) * (90 / firstquad) + 'deg)'); //iscrtava drugi luk
	  progressbar.setAttribute('style', 'box-shadow: inset 0px 0px 0px 20px yellow');
	   //timer.setAttribute('style', 'color: yellow;');
	}

	//izmedju druge i trece, pravi trecu cetvrtinu
	else if (progress > secnd && progress <= thirdquad) {
	  quad1.setAttribute('style', 'transform: skew(-90deg)'); // krije prvi luk
	  quad2.setAttribute('style', 'transform: skewY(90deg)'); // krije drugi luk
	  quad3.setAttribute('style', 'transform: skew(' + (progress - secnd) * (-90 / firstquad) + 'deg)'); // iscrtava treci
	  progressbar.setAttribute('style', 'box-shadow: inset 0px 0px 0px 20px orange');
	 // timer.setAttribute('style', 'color: orange;');
	}

	//izmedju trece i cetvrte, pravi cetvrtu cetvrtinu
	else if (progress > thirdquad && progress <= maxcounter) {
	  quad1.setAttribute('style', 'transform: skew(-90deg)'); // krije prvi luk
	  quad2.setAttribute('style', 'transform: skewY(90deg)'); // krije drugi luk
	  quad3.setAttribute('style', 'transform: skew(-90deg)'); // krije treci luk
	  quad4.setAttribute('style', 'transform: skewY(' + (progress - thirdquad) * (90 / firstquad) + 'deg)'); //iscrtava cetvrti
	  progressbar.setAttribute('style', 'box-shadow: inset 0px 0px 0px 20px red');
	//  timer.setAttribute('style', 'color: red;');
	}
	}


};

if(Meteor.isServer)
{
	streamer.allowRead('all');
    streamer.allowWrite('all');
}
