
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