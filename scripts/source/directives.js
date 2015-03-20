
/* emits "onRepeatLast" when the last item in a ngRepeat has loaded
------------------------------------------------------------------------- */
PRP.app.directive('onLastRepeat', ["$timeout", function ($timeout) {
	return {
		restrict: "EA",
		replace: false,
		link: function ($scope, element, attrs) {
			if ($scope.$last) $timeout(function(){
				$scope.$emit('onRepeatLast', element, attrs);
			}, 1);
		}
	};
}]);


/* Logout Directive
-----------------------------------------------------------------*/
PRP.app.directive("logout", ["$window", "utils", function ($window, utils){
	return{
		restrict: "AC",
		link: function($scope, element){
			element.click(function(){
				$scope.isLoggedIn = false;
				$window.location.href = "#/";
				utils.closeMenu();
			});
		}
	};
}]);


/* Back Button
-----------------------------------------------------------------*/
PRP.app.directive("back", ["$window", function ($window){
	return{
		scope: {},
		restrict: "AC",
		link: function (scope, element) {
			element.click(function(){
				$window.history.back();
			});
		}
	};
}]);


/* 
	Load More Videos Button Directive
	---------------------------------------------------------------------------------------

	Attribute		Type		Description
	--------------	--------	-------------------------------
	total=""		Number		Total Number of Videos
	current=""		Number		Current Number of Videos
	category=""		Number		Category ID of the Sub Category
	catindex=""		Number		Index of its parent category in the $scope.category Array
	subcatindex=""	number		Index of the sub category in the parent category array

------------------------------------------------------------------------------------------*/
PRP.app.directive("loadMoreButton", ["$rootScope", "api", "process", function ($rootScope, api, process){
	return{
		scope: {
			total: "=total",
			current: "=current",
			category: "=category",
			catindex: "=catindex",
			subcatindex: "=subcatindex"
		},
		restrict: 'E',
		template: [	'<div class="span-1 no-pad top-space hide">',
						'<p><a href="" class="btn btn-first full-width-btn blue">Load More</a></p>',
					'</div>'].join(""),
		replace: true,
		link: function($scope, element){
			var thisSubCategory = $scope.$parent.$parent.categories[$scope.catindex].subCategories[$scope.subcatindex],
				loadStart = 0,
				loadEnd = 0;

			// when instanciated, show button and decrement the first batch
			if($scope.total > $scope.current){
				element.removeClass("hide");
				decrementTotal();
			}


			//when tapped, determine remainder, get more programs and decrement
			element.click(function(){
				if($scope.total > 0){

					$scope.$parent.$parent.showPreloader = true;
					
					//we have to add and remove 1 to accomdate for 0 as a valid position
					loadStart = (loadStart + ($scope.current -1)) + 1;
					loadEnd = (loadStart + $scope.current) - 1;

					api.getPrograms({
						category: $scope.category,
						start: loadStart,
						end: loadEnd
					}).then(loadPrograms);
				}

				decrementTotal();

				if($scope.total < 0){ element.addClass("hide"); }

			});


			// process the response and loads the programs in to the subcategory program array
			function loadPrograms(data){
				var i, programs = process.programs(data.response.getPrograms.programs);

				for (i = 0; i < programs.length; i++) {
					thisSubCategory.programs.push(programs[i]);
				}

				$scope.$parent.$parent.showPreloader = false;
			}


			// decrements the total number of videos until we've viewed them all
			function decrementTotal(){ $scope.total = $scope.total - $scope.current; }
		}
	};

}]);