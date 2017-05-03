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

Roll4Guild
.factory('UserService', function() {
    var user;
    return {
        getUser: function () {
            user = localStorage.getItem("Username");
            return user;
        },

        setUser: function (UID) {
            user = UID;
            localStorage.setItem("Username", user);
        }
    }
})
.factory('GroupService', function() {
    var group;
    return {
        getGroup: function () {
            group = localStorage.getItem("Groupname");
            return group;
        },

        setGroup: function (GID) {
            group = GID;
            localStorage.setItem("Groupname", group);
        }
    }
});


Roll4Guild.run(function($rootScope) {
	console.log('loading app');
	$rootScope.user = {};
	$rootScope.games = [
		"Dungeons and Dragons",
		"Magic the Gathering",
		"7 Wonders",
		"Coup",
		"Settlers of Catan",
		"Citadels",
		"Betrayal at the House on the Hill",
		"Secret Hitler"
	];
	$rootScope.uhid = "";
});

Roll4Guild
    .controller('loginCtrl', function($scope, $http, $rootScope, UserService, $window) {

    	// Posts to the database to login a hero.  Routes to their profile if user exists
       $scope.submit = function(){
           var data = {
               "hero": $scope.email,
               "key": $scope.password
           };
           $http.post("http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/login", JSON.stringify(data))
               .then(function successCallback(response){
                   $rootScope.uhid = response.uhid;
                   UserService.setUser($rootScope.uhid);
                   $window.location = "userProfile.html";
               }, function errorCallback(response){
               console.log("Credentials don't match known user!");
               $scope.reset();
               $window.location = "index.html";
           });
       };

        $scope.reset = function(){
            $scope.email="";
            $scope.password="";
        };
    })

    .controller('navCtrl', function($scope){
        $scope.openNav = function() {
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
    .controller('userProfCtrl', function($scope, $http, UserService, $rootScope) {

        $scope.init = function () {
        	$rootScope.uhid = UserService.getUser();
            console.log("http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/hero/" + $rootScope.uhid);
            $http.get("http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/hero/" + $rootScope.uhid)
                .then(function successCallback(response){
                    $scope.details = response.data;
					$scope.guilds = response.data.guilds;
                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };

		$scope.popups = {
			showMessagbox: false,
		}
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
				var users;
				$http.get("http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/search/"+resultType)
				.then(function successCallback(response){
					$scope.results = response.data;
				}, function errorCallback(response){
					console.log("Unable to perform get request");
					users = [
						{'_id': "1",
						'games': ["Dungeons and Dragons","7 Wonders", "Magic the Gathering", "Coup"],
						'heroname': "Gandalf",
						'backstory': "The Grey Pilgrim. That is what they used to call me. Three hundred lives of men I've walked this earth and now, I have no time."},
						{'_id': "2",
						'games': ["Betrayal at the House on the Hill", "X-Wing", "Settlers of Catan", "7 Wonders", "Dead of Winter", "Coup"],
						'heroname': "Bilbo",
						'backstory': "He was hired by Thorin and Company to be their burglar in the Quest of Erebor, and later fought in the Battle of the Five Armies. Bilbo was also one of the bearers of the One Ring, and the first to voluntarily give it up, although with some difficulty. He wrote many of his adventures in a book he called There and Back Again. Bilbo adopted Frodo Baggins as his nephew after his parents, Drogo Baggins and Primula Brandybuck, drowned in the Brandywine River."},
						{'_id': "3",
						'games': ["7 Wonders", "Magic the Gathering", "Coup"],
						'heroname': "Frodo",
						'backstory': "I wander Middle Earth"},
						{'_id': "4",
						'games': ["7 Wonders", "Magic the Gathering", "Coup"],
						'heroname': "Sam",
						'backstory': "I wander Middle Earth"},
						{'_id': "5",
						'games': ["7 Wonders", "Betrayal at the House on the Hill", "Coup"],
						'heroname': "Pippin",
						'backstory': "I wander Middle Earth"},
						{'_id': "6",
						'games': ["7 Wonders", "Settlers of Catan", "Secret Hitler"],
						'heroname': "Merriadoc",
						'backstory': "I wander Middle Earth"},
						{'_id': "7",
						'games': ["7 Wonders", "Citadels", "Coup"],
						'heroname': "Gimli",
						'backstory': "I wander Middle Earth"},
						{'_id': "8",
						'games': ["7 Wonders", "Settlers of Catan", "Coup"],
						'heroname': "Elrond",
						'backstory': "I wander Middle Earth"},
					];
				});
				return users;
			}

			switch($scope.searchCriteria.mode) {
				case 'users':
					$scope.results = this.updateResults('heros');
					// console.log($scope.results);
					break;
				case 'groups':
					$scope.results = this.updateResults('guilds');
					break;
			}

		}

		$scope.visitUserProfile = function(user){
			UserService.setUser(user);
			$window.location = 'userProfile.html';
        }

		$scope.visitGroupProfile = function(group){
			GroupService.setGroup(group);
			$window.location = 'groupProfile.html';
        }

    })
    .controller('passNewCtrl', function($scope, $http) {
        $scope.name = 'passNewCtrl';

    })
    .controller('passVerCtrl', function($scope, $http) {
        $scope.name = 'passVerCtrl';

    })
    .controller('inboxCtrl', function($scope, $http, $rootScope, message) {
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
	.controller('messagePopup', function($scope, $http, message) {
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
    .controller('groupProfCtrl', function($scope, $http, UserService, GroupService) {
        $scope.init = function () {
            $http.get("https://www.omdbapi.com/?t=Star+Wars")
                .then(function successCallback(response){
                    $scope.details = response.data;

                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
            $scope.results = this.getGroups();
            $scope.name = GroupService.getGroup();
        };

		$scope.group = {name: 'Troopers', ugid:1138};
		$scope.popups = {
			showMessagbox: false,
		};

		$scope.getCurrentUser = function(){
			$scope.name = localStorage.getItem("Username");
		}

        $scope.getGroups = function() {
            return [
                {
                    '_id': "001",
                    'games': ["Pathfinder"],
                    'name': "The Rebelz",
                    'charter': "What is a charter?",
                    'members': ["Luke Skywalker", "Princess Leia", "Han Solo"],
                    'last_session': {"ts": "<timestamp", "game": "<game>"}
                },
                {
                    '_id': "002",
                    'games': ["D&D 3.5"],
                    'name': "The Last Jedis",
                    'charter': "What is a charter?",
                    'members': ["Luke skywalker", "Rey"],
                    'last_session': {"ts": "<timestamp", "game": "<game>"}
                },
            ];
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
                url: 'http://citygate-1.mvmwp5wpkc.us-west-2.elasticbeanstalk.com/hero/create',
                data: $scope.send,
                headers : {
                    'Content-Type': 'text/plain'
                }
            }).then(function mySucces(response) {
                $rootScope.uhid = response.data.uhid;
                $window.location = 'userProfile.html';
                UserService.setUser($rootScope.uhid);
            }, function myError(response) {
                console.log("LOL");
            });
        };
    })


    .controller('editGuildCtrl', function($scope, $http, $rootScope) {
		window.onload = function() {
            $scope.games = $rootScope.games;
        };
    })

	// Services
	Roll4Guild
	.service('message', function() {
		this.send = function(newMessage) {
			if(!newMessage || !newMessage.body) { return; }

			// send message
			console.log("\""+ newMessage.body +"\" sent from", newMessage.sender, "to", newMessage.participants);
		}
	})

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
				return searchCriteria.maxDistance? numberFilter(result.distance, 1) <= numberFilter(searchCriteria.maxDistance, 4) : true;
			}
			function filterByTextualQuery(filteredResults) {
				return filterFilter(filteredResults, searchCriteria.textualQuery);
			}
			function meetsGroupSizeCriteria(result) {
				var meetsMin = !searchCriteria.minNumMembers || searchCriteria.minNumMembers <= result.members.length;
				var meetsMax = !searchCriteria.maxNumMembers || searchCriteria.maxNumMembers >= result.members.length;
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
