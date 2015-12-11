
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


/* Nav Panel Directive
-----------------------------------------------------------------*/
PRP.app.directive("panel", ["utils", function (utils){
	return{
		restrict: "AC",
		link: function($scope, element){
			element.click(function(){
				var id = element.attr("href");

				$scope.determineCategoryPrograms(id);
				utils.changePage(id);
			});
		}
	};
}]);




/* Bakes & Appends Category Pages when the user reqeusts a subCat
-----------------------------------------------------------------*/
PRP.app.directive("categoryPages", ["$compile", "utils", function ($compile, utils){
	return{
		restrict: "AC",
		link: function($scope, element){
			element.click(function(){
				var catData = $(this).data(),
					page, i, j,
					catLength = $scope.categories.length;


				for (i = 0; i < catLength; i++) {
					if($scope.categories[i].categoryid === catData.parentid){
						for (j = 0; j < $scope.categories[i].subCategories.length; j++) {
							if($scope.categories[i].subCategories[j].categoryid === catData.subcategoryid){
								$scope.$apply(function(){ $scope.subCategoryPage = $scope.categories[i].subCategories[j]; });
								break;
							}
						}
					}
				}
				
				// Dont add another if it already exists
				if(!document.getElementById(catData.subcategoryid)){

					//comple the freshly birthed page
					page = $compile(PRP.templates.subCategoryPage)($scope);
					$scope.$apply();
					
					// Append to Parent
					$(page).insertAfter("#"+catData.parentid);

					//swtich to that page
					utils.changePage("#"+catData.subcategoryid);

				}else{
					utils.changePage("#"+catData.subcategoryid);
				}
				
				
			});
		}
	};
}]);