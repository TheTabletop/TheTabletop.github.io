'use strict';

// Defining Angular app model with all other dependent modules
var Roll4Guild = angular.module('Roll4Guild',["ngRoute"]);

Roll4Guild
    .controller('loginCtrl', function($scope, $http) {

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
    .controller('userProfCtrl', function($scope, $http) {
        $scope.name = 'userProfCtrl';


        $scope.init = function () {
            $http.get("http://www.omdbapi.com/?t=Star+Wars")
                .then(function successCallback(response){
                    $scope.details = response.data;

                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };


    })
    .controller('searchCtrl', function($scope, $http) {
        $scope.name = 'searchCtrl';

    })
    .controller('passNewCtrl', function($scope, $http) {
        $scope.name = 'passNewCtrl';

    })
    .controller('passVerCtrl', function($scope, $http) {
        $scope.name = 'passVerCtrl';
        $scope.init = function () {
            $http.get("http://www.omdbapi.com/?t=Star+Wars")
                .then(function successCallback(response){
                    $scope.details = response.data;

                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };

    })
    .controller('inboxCtrl', function($scope, $http) {
        $scope.name = 'inboxCtrl';

		$scope.findPigeons = function(){
		}
		$scope.init = function(){
			$scope.conversation = ['Frodo'];
			// $scope.conversation = getConversations(['Frodo'])[0];
		}
		$scope.getConversations = function(conversants){

		}
		// $scope.conversation=['Frodo', 'Gimli'];
		$scope.listNames = function(){
			return $scope.conversation.join(', ');
		}
		$scope.messages=[
			{sender:'Frodo', body:'Over hill and under tree', date:'Mar. 15'},
			{sender:'Gimli', body:'Salted pork!!!', date:'Mar. 17'},
			{sender:'Gandalf', body:'Follow your nose', date:'Mar. 17'},
			{sender:'Legolas', body:'They\'re taking the hobbits to Isengard!', date:'Mar. 19'},
			{sender:'Legolas', body:'They\'re taking the hobbits to Isengard!', date:'Mar. 19'},
			{sender:'Bilbo', body:`Over The Misty Mountains Cold

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
			To hide in gems on hilt of sword.

			On silver necklaces they strung
			The flowering stars, on crowns they hung
			The dragon-fire, on twisted wire
			They meshed the light of moon and sun.

			Far over the Misty Mountains cold,
			To dungeons deep and caverns old,
			We must away, ere break of day,
			To claim our long-forgotten gold.

			Goblets they carved there for themselves,
			And harps of gold, where no man delves
			There lay they long, and many a song
			Was sung unheard by men or elves.

			The pines were roaring on the heights,
			The wind was moaning in the night,
			The fire was red, it flaming spread,
			The trees like torches blazed with light.

			The bells were ringing in the dale,
			And men looked up with faces pale.
			The dragon\'s ire, more fierce than fire,
			Laid low their towers and houses frail.

			The mountain smoked beneath the moon.
			The dwarves, they heard the tramp of doom.
			They fled the hall to dying fall
			Beneath his feet, beneath the moon.

			Far over the Misty Mountains grim,
			To dungeons deep and caverns dim,
			We must away, ere break of day,
			To win our harps and gold from him!

			The wind was on the withered heath,
			But in the forest stirred no leaf:
			There shadows lay be night or day,
			And dark things silent crept beneath.

			The wind came down from mountains cold,
			And like a tide it roared and rolled.
			The branches groaned, the forest moaned,
			And leaves were laid upon the mould.

			The wind went on from West to East;
			All movement in the forest ceased.
			But shrill and harsh across the marsh,
			Its whistling voices were released.

			The grasses hissed, their tassels bent,
			The reeds were rattling—on it went.
			O\'er shaken pool under heavens cool,
			Where racing clouds were torn and rent.

			It passed the Lonely Mountain bare,
			And swept above the dragon\'s lair:
			There black and dark lay boulders stark,
			And flying smoke was in the air.

			It left the world and took its flight
			Over the wide seas of the night.
			The moon set sale upon the gale,
			And stars were fanned to leaping light.

			Under the Mountain dark and tall,
			The King has come unto his hall!
			His foe is dead, the Worm of Dread,
			And ever so his foes shall fall!

			The sword is sharp, the spear is long,
			The arrow swift, the Gate is strong.
			The heart is bold that looks on gold;
			The dwarves no more shall suffer wrong.

			The dwarves of yore made mighty spells,
			While hammers fell like ringing bells
			In places deep, where dark things sleep,
			In hollow halls beneath the fells.

			On silver necklaces they strung
			The light of stars, on crowns they hung
			The dragon-fire, from twisted wire
			The melody of harps they wrung.

			The mountain throne once more is freed!
			O! Wandering folk, the summons heed!
			Come haste! Come haste! Across the waste!
			The king of friend and kin has need.

			Now call we over the mountains cold,
			\'Come back unto the caverns old!\'
			Here at the gates the king awaits,
			His hands are rich with gems and gold.

			The king has come unto his hall
			Under the Mountain dark and tall.
			The Worm of Dread is slain and dead,
			And ever so our foes shall fall!

			Farewell we call to hearth and hall!
			Though wind may blow and rain may fall,
			We must away, ere break of day
			Far over the wood and mountain tall.

			To Rivendell, where Elves yet dwell
			In glades beneath the misty fell.
			Through moor and waste we ride in haste,
			And whither then we cannot tell.

			With foes ahead, behind us dread,
			Beneath the sky shall be our bed,
			Until at last our toil be passed,
			Our journey done, our errand sped.

			We must away! We must away!
			We ride before the break of day!`, date:'Mar. 19'},
		];
		$scope.contacts=[
			{name:'Frodo', uhid:'000'},
			{name:'Legolas', uhid:'001'},
			{name:'Gimli', uhid:'002'},
			{name:'Gandalf', uhid:'003'},
		];
    })

   Roll4Guild
    .controller('userWallCtrl', function($scope, $http) {
        $scope.name = 'userWallCtrl';
        $scope.init = function () {
            $http.get("http://www.omdbapi.com/?t=Star+Wars")
                .then(function successCallback(response){
                    $scope.details = response.data;

                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };
    })
    .controller('groupProfCtrl', function($scope, $http) {
        $scope.name = 'groupProfCtrl';
        $scope.init = function () {
            $http.get("http://www.omdbapi.com/?t=Star+Wars")
                .then(function successCallback(response){
                    $scope.details = response.data;

                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };
    })
    .controller('groupWallCtrl', function($scope, $http) {
        $scope.name = 'groupWallCtrl';
        $scope.init = function () {
            $http.get("http://www.omdbapi.com/?t=Star+Wars")
                .then(function successCallback(response){
                    $scope.details = response.data;

                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };
    })
    .controller('editProfCtrl', function($scope, $http) {
        $scope.name = 'editProfCtrl';
        $scope.init = function () {
            $http.get("http://www.omdbapi.com/?t=Star+Wars")
                .then(function successCallback(response){
                    $scope.details = response.data;

                }, function errorCallback(response){
                    console.log("Unable to perform get request");
                });
        };
    })
