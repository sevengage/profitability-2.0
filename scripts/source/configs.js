PRP.app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state("home", {
			url: "/",
			templateUrl: "templates/login.html"
		})
		.state("categories", {
			url: "/categories",
			templateUrl: "templates/categories.html"
		})
		.state("subcategoryList", {
			url: "/subcategory",
			templateUrl: "templates/sub-categories.html",
			controller: function($scope, $location, utils){
				var id = $location.search();
				$scope.determineCategoryPrograms(id.page);
				utils.changePage(id);
			}
		})
		.state("categoryVideos",{
			url: "/category-videos",
			templateUrl: "templates/subcat-videos.html",
			controller: function($scope, $location){
				var data = $location.search();
				$scope.determineCategoryPrograms(data.sub);
				$scope.goToSubCategory(data);
			}
		})
		.state("videos", {
			url: "/video",
			templateUrl: "templates/video.html",
			controller: function($scope){
				var videoCntr, video;
/*
				if(buildVideoPromise){
					videoCntr = document.getElementById("videoProgram");
					videoCntr.innerHTML = "<video id='videoPlayer'></video>";

					video = document.getElementById("videoPlayer");
					video.src = $scope.video.asset;

					video.addEventListener('loadedmetadata', function() {
						video.play();
						//video.pause();
					});
				}
*/
				
				jwplayer("videoProgram").setup({
					androidhls: true,
					autostart: true,
					file: $scope.video.asset,
					title:  $scope.video.name,
					width: "100%",
					flashplayer: "scripts/jwplayer.flash.swf",
					aspectratio: "16:9"
				});

				jwplayer().onError(showErrorScreen);
				

				function showErrorScreen(){
					window.alert("Oops. Unable to playback video. Please try again or choose another video");
				}
			}
		});
		
});