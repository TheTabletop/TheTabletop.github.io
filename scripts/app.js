'use strict';

// Defining Angular app model with all other dependent modules
var Roll4Guild = angular.module('Roll4Guild',["ngRoute"]);

Roll4Guild.config(['$httpProvider', function ($httpProvider) {
    //Reset headers to avoid OPTIONS request (aka preflight)
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}]);

// This executes every time the app loads
Roll4Guild.run(function($rootScope, UserService, GroupService, CurrUserService) {
	console.log('loading app');
	$rootScope.root = "http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com";
	$rootScope.user = {};
	$rootScope.games = [
		"Dungeons and Dragons",
		"7th Sea",
		"Iron Kingdoms",
		"GURPS",
		"Shadowrun",
		"Pathfinder",
	];

	$rootScope.UserService = UserService;
	$rootScope.GroupService = GroupService;
	$rootScope.CurrUserService = CurrUserService;

	$rootScope.uhid = "";
	$rootScope.ugid = "";

	$rootScope.days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
});

Roll4Guild
.factory('UserService', ['$window', function($window) {

	var key = 'Username';
	return {
		getUser: function () {
			console.log(localStorage.getItem(key));
			return localStorage.getItem(key);
		},

		setUser: function (UID) {
			console.log(UID);
			localStorage.setItem(key, UID);
		},

		visitUserProfile: function(user){
			console.log('here at visitUserProfile()');
			this.setUser(user);
			$window.location = 'userProfile.html';
		},
	}
}])
.factory('GroupService', ['$window', function($window) {
    var key = 'Groupname';
    return {
        getGroup: function () {
            return localStorage.getItem(key);
        },

        setGroup: function (GID) {
            localStorage.setItem(key, GID);
        },

		visitGroupProfile: function(group){
			console.log('here at visitGroupProfile()');
			this.setGroup(group);
			$window.location = 'groupProfile.html';
        },
    }
}])


.factory('CurrUserService', function() {
	var key = 'CurrUser';
    return {
        getUser: function () {
			console.log('here at getUser()');
            return localStorage.getItem(key);
        },
        setUser: function (user) {
            localStorage.setItem(key, user);
        },
		getUhid: function () {
			console.log('here at getUhid()');
			return localStorage.getItem(key).uhid;
		},
        setUhid: function (uhid) {
			var user = this.getUser();
			user.uhid = uhid;
            this.setUser(user);
        },
		getSessionId: function () {
			return localStorage.getItem(key).uhid;
		},
        setSessionId: function (sessionId) {
			var user = this.getUser();
			user.sessionId = sessionId;
			this.setUser(user);
        },
    };
})
.factory('LocalStorageService', function() {
    return {
        get: function (key) {
            return localStorage.getItem(key);
        },

        set: function (key, data) {
            localStorage.setItem(key, data);
        },
    };
})

.service('MessageService', function() {
	this.send = function(newMessage) {
		if(!newMessage || !newMessage.body) { return; }

		// send message
		console.log("\""+ newMessage.body +"\" sent from", newMessage.sender, "to", newMessage.participants);
	}
});

Roll4Guild
.filter('SearchFilter', function(filterFilter, numberFilter) {
	return function(results, searchCriteria) {
		function meetsGameCriteria(result) {
			var games = searchCriteria.getGames();
			var gamesMatch = true;
			for(var j in games){
				var game = games[j];
				if(searchCriteria.games[game] && !result.games.includes(game)){
					gamesMatch = false;
					return false;
				}
			}
			return true;
		}
		function meetsDistanceCriteria(result) {
			return searchCriteria.maxDistance? parseFloat(result.distance) <= parseFloat(searchCriteria.maxDistance) : true;
		}
		function filterByTextualQuery(filteredResults) {
			return filterFilter(filteredResults, searchCriteria.textualQuery);
		}
		function meetsGroupSizeCriteria(result) {
			var meetsMin = searchCriteria.minNumMembers == undefined || searchCriteria.minNumMembers <= result.members.length;
			var meetsMax = searchCriteria.maxNumMembers == undefined || searchCriteria.maxNumMembers >= result.members.length;
			return meetsMin && meetsMax;
		}

		var filteredResults = [];
		for(var i in results){
			var result = results[i];

			// All filtering that applies to Groups and Users:
			var meetsCriteria = true
			&& meetsGameCriteria(result)
			&& meetsDistanceCriteria(result);

			// Filtering that applies only to Groups or Users
			switch(searchCriteria.mode) {
				case 'users':
					break;
				case 'groups':
					meetsCriteria = meetsCriteria
					&& meetsGroupSizeCriteria(result);
					break;
			}

			if(meetsCriteria) {
				filteredResults.push(result);
			}
		}

		filteredResults = filterByTextualQuery(filteredResults);

		return filteredResults;
		// return undefined;
	}
})
.filter('RemoveEmpty', function() {
	return function(array) {
		var clean = [];
		angular.forEach(array, function(element) {
			if( (element != "") && (element) || (element === 0) ) {
				clean.push(element);
			}
		});
		return clean;
	}
})

Roll4Guild
    .controller('loginCtrl', function($scope, $http, $rootScope, UserService, CurrUserService, $window) {

    	// Posts to the database to login a hero.  Routes to their profile if user exists
       $scope.submit = function(){
           var data = {
               "email": $scope.send.email,
               "key": $scope.send.password
           };
           $scope.send = JSON.stringify(data);
           $http({
               method: 'POST',
               url: 'http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/login',
               data: $scope.send,
               headers : {
                   'Content-Type': 'text/plain'
               }
           }).then(function mySucces(response) {
			   CurrUserService.setUser({
				   uhid: response.data.uhid,
				   sessionId: response.data.session_hash,
			   });
			   UserService.setUser(response.data.uhid);
               $window.location = 'components/views/userProfile.html';
           }, function myError(response) {
               console.log("LOL");
           });
       };

        $scope.reset = function(){
            $scope.email="";
            $scope.password="";
        };
    })

    .controller('navCtrl', function($scope, $rootScope, GroupService, UserService, CurrUserService){
        $scope.openNav = function() {
			$scope.user = CurrUserService.getUser();
			if($scope.user) {
				$scope.uhid = $scope.user.uhid;
				$scope.sessionId = $scope.user.sessionId;
			}
			$scope.guilds = [{name:'Redwall'},];
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
        }
    })

    .controller('aboutCtrl', function($scope, $http) {
        $scope.name = 'aboutCtrl';

    })
    .controller('contactCtrl', function($scope, $http) {
        $scope.name = 'contactCtrl';


    })
    .controller('userProfCtrl', function($scope, $http, UserService, CurrUserService, $rootScope, GroupService) {
        $scope.playerGuilds = [];
        var j = 0;
    	$scope.init = function () {
        	$rootScope.uhid = UserService.getUser();
            $http.get("http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/hero/" + $rootScope.uhid)
                .then(function successCallback(response){
                   	var d = response.data;
					$scope.uhid = d._id;
					$scope.playername = d.playername;
					$scope.heroname = d.heroname;
					$scope.games = d.games;
					$scope.companions = d.companions;
					$scope.guilds = d.guilds;
                    for(var i = 0; i < $scope.guilds.length; i++){
                    	$http.get("http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/guild/" + $scope.guilds[i].ugid)
                            .then(function successCallback(response){
                               $scope.playerGuilds[j] = response.data;
                               $scope.playerGuilds[j].ugid = $scope.guilds[j].ugid;
                               j++;
                            }, function errorCallback(response){
                                console.log("Unable to perform get request");
                            });
                    }
					$scope.backstory = d.backstory;
					// if(CurrUserService.get('CurrUser') === d._id) {
					// 	$scope.email = d.email;
					// 	$scope.invitesFromGuilds = d.guild_invites;
					// 	$scope.requestsToGuilds = d.requested_guilds;
					// 	$scope.ucid = d.ucid;
					// }
                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };

    	$scope.toGuild = function(ugid){
			GroupService.visitGroupProfile(ugid);
		};

		$scope.popups = {
			showMessagbox: false,
		};
    })


	.controller('searchCtrl', function($scope, $http, $window, $rootScope, UserService, GroupService) {
        $scope.name = 'searchCtrl';

		$scope.searchCriteria = {
			experienceLevel: undefined,
			games: {},
			lastSessionDate: undefined,
			maxDistance: undefined,
			maxNumMembers: undefined,
			meetingTime: undefined,
			minNumMembers: undefined,
			mode: undefined,
			name: undefined,
			regularity: undefined,
			textualQuery: undefined,
			getGames: function() {
				return Object.keys(this.games);
			},
		}

        $scope.init = function () {
			// console.log("$rootScope.user.name", $rootScope.user.name);
			$scope.searchCriteria.mode = 'users';
			for(var i in $rootScope.games) {
				$scope.searchCriteria.games[$rootScope.games[i]] = false;
			}
			$scope.search();
		}

		$scope.search = function() {
			// get search results (i.e. relevant groups) from back-end
			// get search results (i.e. relevant users) from back-end
			this.updateResults = function(resultType) {
				$http.get($rootScope.root+"/search/"+resultType)
				.then(function successCallback(response){
					$scope.results = response.data;
				}, function errorCallback(response){
					console.log("Unable to GET "+ $rootScope.root+"/search/"+resultType);
				});
			}

			switch($scope.searchCriteria.mode) {
				case 'users':
					this.updateResults('heros');
					// console.log($scope.results);
					break;
				case 'groups':
					this.updateResults('guilds');
					break;
			}

		}

    })
    .controller('passNewCtrl', function($scope, $http) {
        $scope.name = 'passNewCtrl';

    })
    .controller('passVerCtrl', function($scope, $http) {
        $scope.name = 'passVerCtrl';

    })
    .controller('inboxCtrl', function($scope, $http, $rootScope, MessageService) {
        $scope.name = 'inboxCtrl';
		$scope.uncontactedContacts = [];

		$scope.newMessage = {};
		$scope.contacts = [];
		$scope.conversations = [];
		$scope.default = {
			profilePic: 'https://pbs.twimg.com/profile_images/724556438241181696/0tQ-pyo_.jpg',
			groupPic: 'https://bigtallwords.files.wordpress.com/2015/04/lord-of-the-rings-two-towers-orc-gathering.png?w=256&h=256&crop=1'
		};
		// Called when page first loads
		$scope.init = function(conversation, newMessage){
			conversation = (conversation? conversation : $scope.getMostRecentConversation())
			$scope.myUserName = 'Frodo';
			$scope.updateInbox();
			if(conversation.upid) {
				$scope.setCurrConversation(conversation);
			}
			else if(conversation.uhid) {
				// add participant to new conversation with 1 other person
				$scope.setCurrConversation({
					body:undefined,
					sender:$scope.myUserName,
					participants:conversation.participants,
					messages:[{body:undefined}],
				});
			}
			else if(conversation.ugid) {
				$scope.setCurrConversation(conversation);
			}
			else{
				// create a new conversation, will choose participants
				$scope.setCurrConversation(conversation);
			}
			document.getElementById("msgText").focus();
			$scope.newMessage = newMessage? newMessage : {};
		}
		$scope.getNewConversation = function() {
			this.NewConversation = function(){
				// prototype:$scope.Conversation,
				this.body = undefined;
				this.sender = $scope.myUserName;
				this.participants = [];
				this.messages = [{body:undefined}];
				this.isNew = true;
				this.removeParticipant = function(nameToRemove){
					// console.log('remove', nameToRemove);
					$scope.currConversation.participants = $scope.currConversation.participants.filter(function(name) {
						return name !== nameToRemove;
					});
				}
				this.includeParticipants = function(participants) {
					// console.log('include', participants);
					var currParticipants = $scope.currConversation.participants;
					$scope.currConversation.participants = [...new Set(participants.concat(currParticipants))];
				}
			}
			return new this.NewConversation();
		}
		$scope.updateInbox = function() {
			$scope.updateContactBrowser();
		}

		$scope.getMostRecentConversation = function() {
			$scope.updateConversations();
			return $scope.conversations[0];
		}

		// Chooses the conversation displayed
		$scope.setCurrConversation = function(conversation) {
			$scope.currConversation = conversation;
			$scope.updateMessages();
		}

		$scope.updateContactBrowser = function() {
			$scope.updateGroups();
			$scope.updateContacts();
			$scope.updateConversations();
			$scope.updateUncontactedContacts();
		}

		// Does HTTP request, updates list of conversations
		$scope.updateConversations = function() {
			// fake data for now, by definition all conversations
			// don't list self in participants on page
			$scope.conversations = [
				{upid: '100', participants: ['Sam','Pippin','Merriadoc'], profilePic: 'https://at-cdn-s01.audiotool.com/2011/08/18/documents/concerning_hobbits/1/cover256x256-530088cd58af464ebb208af0944f6f02.jpg', messages:[
					{date:'10.21.2016', sender:'Pippin', body:'Mushrooms!!'},
					{date:'3.04.2017', sender:'Pippin', body:`Maybe Treebeard's right. We don't belong here, Merry. It's too big for us. What can we do in the end? We've got the Shire. Maybe we should go home. `},
					{date:'3.04.2017', sender:'Merriadoc', body:`The fires of Isengard will spread. And the woods of Tuckborough and Buckland will burn. And... and all that was once green and good in this world will be gone. There won't be a Shire, Pippin.`},
				],},
				{upid: '101', participants: ['Sam'], messages:[
					{date:'11.29.2016', sender:'Sam', body:'Over hill and under tree'},
				]},
				{upid: '103', participants: ['Gandalf','Aragorn son of Arathorn'], messages:[
					{date:'04.14.2017', sender:'Gandalf', body:'Follow your nose'},
					{date:'05.4.2017', sender:'Aragorn', body:`! see in your eyes the same fear that would take the heart of me. A day may come when the courage of men fails, when we forsake our friends and break all bonds of fellowship, but it is not this day. An hour of woes and shattered shields, when the age of men comes crashing down! But it is not this day! This day we fight! By all that you hold dear on this good Earth, I bid you *stand, Men of the West!* `},
				]},
			];
		}

		// Does HTTP request, updates list of contacts (may not have messaged each other yet)
		$scope.updateContacts = function() {
			// fake data for now
			$scope.contacts=[
				{uhid:'005', participants:['Aragorn son of Arathorn']},
				{uhid:'000', participants:['Frodo'], profilePic:'https://68.media.tumblr.com/avatar_d0ed961c17e0_128.png'},
				{uhid:'001', participants:['Sam'], profilePic:'http://orig15.deviantart.net/0503/f/2011/089/9/1/samwise_gamgee_avatar_by_angelprincess101-d3ctyz9.png'},
				{uhid:'002', participants:['Pippin']},
				{uhid:'003', participants:['Merriadoc']},
				{uhid:'004', participants:['Gandalf']},
				{uhid:'006', participants:['Legolas']},
				{uhid:'007', participants:['Gimli']},
				{uhid:'008', participants:['Bilbo']},
			];
		}

		// Looks at lists of conversations and lists of contacts
		// and updates list of contacts that have not yet been contacted
		$scope.updateUncontactedContacts = function() {
			var contactedContacts = {};
			for(var i in $scope.conversations) {
				var conv = $scope.conversations[i];
				if(conv.participants.length === 1) {
					contactedContacts[conv.participants[0]] = undefined;
				}
			}
			$scope.uncontactedContacts = $scope.contacts.filter(function(contact) {
				return !(contact.participants in contactedContacts);
			})
		}

		// Does HTTP request, gets list of groups user is a member of
		$scope.updateGroups = function() {
			// fake data fro now
			$scope.groups = [
				{ugid:'201', participants:['Shirelings'], messages:[
					{date:'01.17.2017', sender:'Frodo', body:'The Road goes ever on and on Down from the door where it began. Now far ahead the Road has gone, And I must follow, if I can.'}, {date:'04.25.2017', sender:'Bilbo', body:`Over The Misty Mountains Cold

					Far over the Misty Mountains cold,
					To dungeons deep and caverns old,
					We must away, ere break of day,
					To seek our pale enchanted gold.

					The dwarves of yore made mighty spells,
					While hammers fell like ringing bells,
					In places deep, where dark things sleep,
					In hollow halls beneath the fells.

					For ancient king and elvish lord
					There many a gleaming golden hoard
					They shaped and wrought, and light they caught,
					To hide in gems on hilt of sword.`},
				]},
				{ugid:'200', participants:['Wizards'], messages:[
					{date:'03.27.2017', sender:'Gandalf', body:'Do you wish me a good morning, or mean that it is a good morning whether I want it or not; or that you feel good this morning; or that it is a morning to be good on?'},
					{date:'02.05.2017', sender:'Gandalf',  body:'I will not say, do not weep, for not all tears are an evil.'},
					{date:'02.02.2017', sender:'Gandalf',  body:'All we have to decide is what to do with the time that is given us.'},
				]},
				{ugid:'202', participants:['Fellowship'], messages:[
					{date:'03.03.2017', sender:'Gimli', body:'Salted pork!!!'},
				]},
			];
		}

		// Check for new messages based on current conversation
		$scope.updateMessages = function() {
			// check for unread messages, append to front of queue
			$scope.currConversation.messages = $scope.getMessages($scope.currConversation, Date());
			// update "unread messages" indicators
		}

		// Update displayed messages for the given conversation
		$scope.getMessages = function(currConversation, timestamp){
			// temporary
			var noMessages = [{date:undefined, body:"(no messages)"}];
			var conversations = $scope.conversations.concat($scope.groups);
			var conversation = undefined;
			var isUser = currConversation.upid;
			var isGroup = currConversation.ugid;
			if( !currConversation || (!isUser && !isGroup)){
				return noMessages;
			}
			for(var i = 0; i < conversations.length; i++){
				conversation = conversations[i];
				if( (isUser && conversation.upid === currConversation.upid) || (isGroup && conversation.ugid === currConversation.ugid) ){
					// console.log(conversation.participants, conversation.messages);
					return conversation.messages;
				}
			}
			return noMessages;

		}

		$scope.sendMessage = function() {
			// send message
			message.send($scope.newMessage);

			// reset state
			if($scope.currConversation.isNew) {
				$scope.init(undefined, undefined);
			}
			else {
				$scope.newMessage = undefined;
			}

			$scope.updateInbox();
		}

		$scope.getMessageBody = function(msg, messages) {
			return $last;
			// return ($index == messages.length? "beginning of message history" : "");
		}

		// Go deeper into message backlog, appending older ones to back of queue
		$scope.getNextNolderMessages = function(numMessagesToGet) {

		}

		$scope.listNames = function(names){
			return names.join(', ');
		}
    })
	.controller('messagePopup', function($scope, $http, MessageService) {
		$scope.init = function() {
			document.getElementById("msgText").focus();
			$scope.newMessage = $scope.getNewMessage();
		}
		$scope.getNewMessage = function() {
			this.message = function() {
				this.sender = undefined;
				this.body = undefined;
			}
			return new this.message();
		}

		$scope.closeMessage = function() {
			// access parent scope's "popups" object
			$scope.popups.showMessagbox = false;
		}

		$scope.sendMessage = function() {
			message.send($scope.newMessage);
			// access parent scope's "popups" object
			$scope.popups.showMessagbox = false;
		}

	})

   Roll4Guild
    .controller('userWallCtrl', function($scope, $http) {
        $scope.name = 'userWallCtrl';
        $scope.init = function () {
            $http.get("https://www.omdbapi.com/?t=Star+Wars")
                .then(function successCallback(response){
                    $scope.details = response.data;

                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };
    })
    .controller('groupProfCtrl', function($scope, $http, UserService, GroupService, $rootScope) {
        $scope.init = function () {
            $rootScope.ugid = GroupService.getGroup();
            $scope.players = [];
            var j = 0;
            $http.get("http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/guild/" + $rootScope.ugid)
                .then(function successCallback(response){
                   $scope.guildData = response.data;
                   $scope.playerGuild = $scope.guildData.members;
                    for(var i = 0; i < $scope.playerGuild.length; i++){
                        $http.get("http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/hero/" + $scope.playerGuild[i].uhid)
                            .then(function successCallback(response){
                                $scope.players[j] = response.data;
                                $scope.players[j].uhid = $scope.playerGuild[j].uhid;
                                j++;
                            }, function errorCallback(response){
                                console.log("Unable to perform get request");
                            });
                    }
                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };

        $scope.toUser = function(uhid){
        	UserService.visitUserProfile(uhid);
		}

	})

    .controller('groupWallCtrl', function($scope, $http) {
        $scope.name = 'groupWallCtrl';
        $scope.init = function () {
            $http.get("https://www.omdbapi.com/?t=Star+Wars")
                .then(function successCallback(response){
                    $scope.details = response.data;

                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };
    })

    .controller('editProfCtrl', function($scope, $http, $rootScope, UserService, $window) {

    	// On Load we want to grab the array of games for the checkbox list, then initialize some scope variables
		// to be used later
    	window.onload = function() {
            $scope.games = $rootScope.games;
            $scope.send = {
            	"email": "",
				"key": "",
				"playername": "",
				"heroname": "",
				"games":[],
				"backstory":""
			};
            $scope.played = [];
        };

        $scope.onTest = function() {
            var i = 0;
            for (var j = 0; j < $scope.played.length; j++) {
                if ($scope.played[j] != null) {
                	console.log($scope.played[j]);
                    $scope.send.games[i] = $scope.played[j];
                    i++;
                }
            }
        }


		// Creates the array of games then Posts to the Database.  If the hero is created successfully
		// then route to that users newly minted profile
        $scope.onSubmit = function(){
			var i = 0;
        	for(var j = 0; j < $scope.played.length; j++){
				if($scope.played[j] != null){
					$scope.send.games[i] = $scope.played[j];
					i++;
				}
			}


            $http({
                method: 'POST',
                url: 'http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/hero/create',
                data: $scope.send,
                headers : {
                    'Content-Type': 'text/plain'
                }
            }).then(function mySucces(response) {
                $rootScope.uhid = response.data.uhid;
                //$window.location = 'userProfile.html';
                UserService.setUser($rootScope.uhid);
            }, function myError(response) {
                console.log("LOL");
            });
        };
    })

	.controller('editGroupCtrl', function($scope, $http, $rootScope, UserService, GroupService, $window) {

		// On Load we want to grab the array of games for the checkbox list, then initialize some scope variables
		// to be used later
		$scope.init = function() {
			$scope.games = $rootScope.games;
			$scope.send = {
				guildname: "",
				charter: "",
				location: "",
				games:[],
				creator: "",
				session: {
					date: "31-05-2017 19:00",
					game: 'Coup',
					location: 'Memorial Union',
				},
				invite: [],
			};
			$scope.played = [];
			$scope.days = $rootScope.days;
		};


		// Creates the array of games then Posts to the Databse.  If the hero is created successfully
		// then route to that users newly minted profile
		$scope.onSubmit = function(){
			var i = 0;
			for(var j = 0; j < $scope.played.length; j++){
				if($scope.played[j] != null){
					$scope.send.games[i] = $scope.played[j];
					i++;
				}
			}
			$scope.data = JSON.stringify($scope.send);

			$http({
				method: 'POST',
				url: $rootScope.root+'/guild/formguild',
				data: $scope.send,
				headers : {
					'Content-Type': 'text/plain'
				}
			}).then(function mySucces(response) {
				GroupService.setGroup(response.ugid);
				// $window.location = 'groupProfile.html';
			}, function myError(response) {
				console.log("LOL");
			});
		};
	})


	// Roll4Guild
	// .config(function($routeProvider, $locationProvider) {
	// 	$routeProvider
	// 	.when('components/views/searchScreen', {
	// 		templateUrl: '/components/views/searchScreen.html',
	// 		controller: 'searchCtrl'
	// 	})
	// 	.when('components/views/aboutUs', {
	// 		templateUrl: '/components/views/aboutUs.html',
	// 		controller: 'aboutCtrl'
	// 	})
	// 	.when('components/views/contactUs', {
	// 		templateUrl: '/components/views/contactUs.html',
	// 		controller: 'contactCtrl'
	// 	})
	// 	.when('components/views/editProfile', {
	// 		templateUrl: '/components/views/editProfile.html',
	// 		controller: 'editProfCtrl'
	// 	})
	// 	.when('components/views/groupProfile', {
	// 		templateUrl: '/components/views/groupProfile.html',
	// 		controller: 'groupProfCtrl'
	// 	})
	// 	.when('components/views/groupWall', {
	// 		templateUrl: '/components/views/groupWall.html',
	// 		controller: 'groupWallCtrl'
	// 	})
	// 	.when('components/views/resetPasswordNew', {
	// 		templateUrl: '/components/views/restPasswordNew.html',
	// 		controller: 'passNewCtrl'
	// 	})
	// 	.when('components/views/resetPasswordVerify', {
	// 		templateUrl: '/components/views/resetPasswordVerify.html',
	// 		controller: 'passVerCtrl'
	// 	})
	// 	.when('components/views/userProfile', {
	// 		templateUrl: '/components/views/userProfile.html',
	// 		controller: 'userProfCtrl'
	// 	})
	// 	.when('components/views/userWall', {
	// 		templateUrl: '/components/views/userWall.html',
	// 		controller: 'userWallCtrl'
	// 	})
	// })
