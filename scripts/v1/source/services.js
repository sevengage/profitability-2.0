/* Backend Service
-----------------------------------------------------------------*/
PRP.app.service("Backend", ['$http', function ($http){
	this.fetch = function(url){
		var promissory = $http.get(url).then(function (response){ return response.data; });
		return promissory;
	};
}]);



/* API Services
-----------------------------------------------------------------*/
PRP.app.service("api", ["Backend", "base", function (Backend, base){
	var promise;

	// get project details: including categories in this project
	this.getProject = function(){
		// https://player.piksel.com/ws/get_project/p/ +project_uuid+ /api/ +key+ /apiv/4.0/mode/json
		promise = Backend.fetch(base.api.get_project);
		return promise;
	};
	
	// get programs: used to get categories: category_id in the getProjectDetails resonse
	this.getPrograms = function (category_id){
		// https://player.piksel.com/ws/get_programs/p/ +project_uuid+ /api/ +key+ /catid/ +category_id+ /start/0/end/14/apiv/4.0/mode/json
		promise = Backend.fetch(base.api.get_programs + "/catid/" + category_id +"/start/0/end/14/apiv/4.0/mode/json");
		return promise;
	};

	// get program details: used to fetch the video to play and show video details video UUID in the getPrograms response
	this.getProgramDetails = function (video_uuid){
		// https://player.piksel.com/ws/get_program_details/p/ +video_uuid+ /api/ +key+ /mode/json
		promise = Backend.fetch(base.api.get_program_details + video_uuid + "/api/" + PRP.properties.key + "/mode/json");
		return promise;
	};
}]);



/* Data processing and structuring
-----------------------------------------------------------------*/
PRP.app.service("process", ["api", "utils", function (api, utils){

	// builds Processes the project category information in to a more usable structure
	// useful for our page's view itterations and panel categories
	this.buildPanelData = function(data){
		var i, j, rawCategoryArray = data.response.getProjectResponse.vodProject.categories,
			categories = [],
			rawCatLength = rawCategoryArray.length,
			categoryLength;
		
		//build the parent categories
		for (i = 0; i < rawCatLength; i++) {
			if(rawCategoryArray[i].parentid === 0 && rawCategoryArray[i].name !== ""){
				categories.push(rawCategoryArray[i]);
				rawCategoryArray[i].subCategories = [];
				rawCategoryArray[i].parentCategoryPrograms = [];

				trash(rawCategoryArray[i]);
			}
		}

		categoryLength = categories.length;

		//pluck out the children and add them to the parent categories
		for (i = 0; i < rawCatLength; i++) {
			if(rawCategoryArray[i].parentid !== 0){

				for (j = 0; j < categoryLength; j++) {
					if(rawCategoryArray[i].parentid === categories[j].categoryid){
						categories[j].subCategories.push(rawCategoryArray[i]);
						rawCategoryArray[i].programs = [];

						trash(rawCategoryArray[i]);
					}
				}

			}
		}

		//cleans up the response object to free up space
		function trash(obj){
			delete obj.class;
			delete obj.sortnum;
			delete obj.metadatas;
			delete obj.description;
			delete obj.thumbnail;
		}

		return categories;
	};


	// Clean up and process the programs
	this.programs = function(programs){
		var i, programLength = Boolean(programs) ? programs.length : 0;

		for (i = 0; i < programLength; i++) {
			programs[i].duration = utils.secondsToTime(programs[i].duration);
		}

		return programs;
	};

}]);



/* Utility Services
------------------------------------------------------------------------- */
PRP.app.service("utils", function(){
	//checks to see if a object has a property
	this.objectHasProperty = function(obj, val){
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop) && obj[prop] === Number(val)) {
				return true;
			}
		}
		return false;
	};


	//converts our run time string to hours, min, seconds
	this.secondsToTime = function(secs){
		var hours, divisor_for_minutes, minutes, divisor_for_seconds, seconds, obj = {};

		secs = Math.round(secs);

		hours = Math.floor(secs / (60 * 60));

		divisor_for_minutes = secs % (60 * 60);
		minutes = Math.floor(divisor_for_minutes / 60).toString();

		divisor_for_seconds = divisor_for_minutes % 60;
		seconds = Math.ceil(divisor_for_seconds).toString();
		
		return (hours !== 0 ? hours +":" : "") + (minutes.length === 1 ? "0"+ minutes +":" : minutes +":") + (seconds.length === 1 ? "0"+ seconds : seconds);
	};


	// reusable chagne page method
	this.changePage = function(context){
		$.mobile.changePage(context, {
			transition: "slide"
		});
		$(context).removeClass("hide");
	};
});