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
			controller: function($scope, utils){
				var videoCntr, video, iOS = utils.isIOS();

				if(iOS){
					// fix for IOS 8 web app video embed playback issue
					videoCntr = document.getElementById("videoProgram");
					video = document.createElement("video");

					video.src = $scope.video.asset;
					video.id = "videoPlayer";
					video.style.width = "100%";
					video.autoplay = true;
					video.controls = true;

					document.getElementById("preloader").style.display = "none";

					videoCntr.appendChild(video);

				}else{

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
				}

				function showErrorScreen(){
					window.alert("Oops. Unable to playback video. Please try again or choose another video");
				}
			}
		});
		
});