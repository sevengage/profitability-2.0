
/* Login Controller
-----------------------------------------------------------------*/
PRP.app.controller("LoginController", ["$scope", "$window", "api", function ($scope, $window, api){
	$scope.email = "";
	$scope.password = "";

	$scope.loginUser = function(){
		
		api.login($scope.email, $scope.password).then(function(response){
			if(Boolean(response.GroupName) && response.PasswordMatch){
				//emit when login is a success
				$scope.$emit("login", true);
			}else{
				$window.alert("Sorry about that.  Please try entering a good" + (typeof response.InfusionId !== "number" ? " email address" : "") + (response.PasswordMatch === null || !response.PasswordMatch ? (typeof response.InfusionId !== "number" ? " and password" : " password") : "") );
			}
		});

	};
	
}]);


/* Pages and Cagegories Controller
-----------------------------------------------------------------*/
PRP.app.controller("PagesController", ["$rootScope", "$scope", "$document", "$timeout", "$location", "$window", "api", "process", "utils", function ($rootScope, $scope, $document, $timeout, $location, $window, api, process, utils){
	
	jwplayer.key = PRP.properties.jwplayer_key;

	$scope.programLimit = 2;
	$scope.showPreloader = false;
	$scope.isLoggedIn = false;
	$scope.subCategoryPage = {};


	// login check on instantiation
	if(!$scope.isLoggedIn){
		$window.location.hash = "#/";
	}


	// fetches the project information then refactors the data into a more useable structure
	api.getProject().then(function(data){
		$scope.categories = process.buildPanelData(data);
	});


	// watches for the page DOM to be loaded before peforming additional tasks
	$rootScope.$on("$viewContentLoaded", function(event){
		calculatePageHeight();
	});

	//determiens the page height to set
	function calculatePageHeight(){
		$scope.pageHeight = $($window).height();
	}

	calculatePageHeight();





	/* 
		Listen for successful login
	-------------------------------------------------*/
	$scope.$on("login", function (e, data){
		if(data){
			$scope.isLoggedIn = data;
			$window.location.href = "#/categories";
		}
	});


	/* 
		View close menu
	-------------------------------------------------*/
	$scope.hideMenu = function(id){
		utils.closeMenu();
		$scope.revealMenu = false;

		//$scope.determineCategoryPrograms(id);
		utils.changePage({"page": id});
	};



	/* 
		Iterates though the Categoies to get the correct programs for each category
	----------------------------------------------------------------------------------*/
	$scope.determineCategoryPrograms = function(category_id){
		var i, j, catLength = $scope.hasOwnProperty("categories") ? $scope.categories.length : 0,
			hasCategoryId,
			programs;

		category_id = (typeof category_id === "string") ? category_id.replace("#", "") : category_id;

		for (i = 0; i < catLength; i++) {
			hasCategoryId = utils.objectHasProperty($scope.categories[i], category_id);

			// see if this cat has subcats otherwise get the programs for the cat
			if($scope.categories[i].subCategories.length !== 0){

				//check to see if this category matches the parent category passed in
				if(hasCategoryId){
					for (j = 0; j < $scope.categories[i].subCategories.length; j++) {
						
						//if this object has the passed in category id and doesnt already have programs
						if($scope.categories[i].subCategories[j].programs !== undefined){
							if($scope.categories[i].subCategories[j].programs.length === 0){
								getSubCategoryPrograms({
									category: $scope.categories[i].subCategories[j].categoryid,
									index: i,
									subindex: j
								});
							}
						}
						
					}
				}

			}else{

				// check to see if this category matches the parent category passed in
				if(hasCategoryId){
					getSubCategoryPrograms({
						category: $scope.categories[i].categoryid,
						index: i
					});
				}
			}
		}
	};


	// Gets Cat Programs Cleans and addes them to the Parent
	function getSubCategoryPrograms(args){
		$scope.showPreloader = true;

		api.getPrograms(args.category).then(function(data){
			programs = process.programs(data.response.getPrograms.programs);

			if(typeof args.subindex !== "undefined"){
				$scope.categories[args.index].subCategories[args.subindex].programs = programs;
			}else{
				$scope.categories[args.index].parentCategoryPrograms = programs;
			}

			$scope.showPreloader = false;
		});
	}



	/* Calls the video asset
	-----------------------------------------------------------------*/
	$scope.callVideo = function(program, subcategoryid, parentid){
		var videoCntr, video;

		$scope.video = {
			name: program.Title,
			description: program.Description,
			duration: program.duration,
			subcategoryid: subcategoryid, //subcategory
			parentid: parentid,
			asset: program.asset.m3u8AndroidURL
		};

		$window.location.href= "#/video";
	};



	/* Bakes & Appends Category Pages when the user reqeusts a subCat
	-----------------------------------------------------------------*/
	$scope.goToSubCategory = function(urldata){
		var i, j,
			videoCat = $(this).data(),
			catLength = $scope.categories.length;

			for (i = 0; i < catLength; i++) {
				if($scope.categories[i].categoryid === parseInt(urldata.parent, 10)){
					for (j = 0; j < $scope.categories[i].subCategories.length; j++) {
						if($scope.categories[i].subCategories[j].categoryid === parseInt(urldata.sub, 10)){
							$scope.subCategoryPage = $scope.categories[i].subCategories[j];
							break;
						}
					}
				}
			}
	};
	
}]);


/* Keeps template cache fresh
-----------------------------------------------------------------*/
PRP.app.run(function ($rootScope, $templateCache) {
    $rootScope.$on('$stateChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
        }
    });
});