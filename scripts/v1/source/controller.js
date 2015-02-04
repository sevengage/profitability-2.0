
/* Login Controller
-----------------------------------------------------------------*/
PRP.app.controller("LoginController", ["$scope", function ($scope){
	//emit when login happens
	$scope.loginUser = function(){
		$scope.$emit("login", true);
	};
	
}]);


/* Pages and Cagegories Controller
-----------------------------------------------------------------*/
PRP.app.controller("PagesController", ["$scope", "api", "process", "utils", function ($scope, api, process, utils){

	$scope.programLimit = 2;
	$scope.showPreloader = false;
	$scope.isLoggedIn = false;
	$scope.subCategoryPage = {};
	

	jwplayer.key = PRP.properties.jwplayer_key;

	//fetches the project information then refactors the data into a more useable structure
	api.getProject().then(function(data){
		$scope.categories = process.buildPanelData(data);
	});



	//this will be set once the login happens. *remove timout*
	$scope.$on("login", function (e, data){
		if(data){
			$scope.isLoggedIn = data;
			
			// var categoryid = $scope.categories[0].categoryid;
			// $scope.determineCategoryPrograms(categoryid);

			//then show the first page in the category
			utils.changePage("#categories");
		}
	});

	

	// Itterates though the Categoies to get the correct programs for each category
	$scope.determineCategoryPrograms = function(category_id){
		var i, j, catLength = $scope.categories.length,
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
						if($scope.categories[i].subCategories[j].programs.length === 0){
							getSubCategoryPrograms({
								category: $scope.categories[i].subCategories[j].categoryid,
								index: i,
								subindex: j
							});
						}
					}
				}

			}else{

				//check to see if this category matches the parent category passed in
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



	// Calls the video asset
	$scope.callVideo = function(program, page){
		$scope.video = {
			name: program.Title,
			description: program.Description,
			duration: program.duration,
			parentPage: page
		};

		utils.changePage("#video");

		jwplayer("videoProgram").setup({
			androidhls: true,
			autostart: true,
			file: program.asset.m3u8AndroidURL,
			title: program.Title,
			width: "100%",
			flashplayer: "scripts/jwplayer.flash.swf",
			aspectratio: "16:9"
		});

		jwplayer().onError(showErrorScreen);

		function showErrorScreen(){
			window.alert("Oops. Unable to playback video. Please try again or choose another video");
		}

	};


	
}]);