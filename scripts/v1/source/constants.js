var PRP = PRP || {};

PRP.app = angular.module("mobile", ["ngTouch"]);


/* Global Constatns
-----------------------------------------------------------------*/
PRP.properties = {
	key: "ad0609da-0066-11e4-b265-005056865f49",
	project_uuid: "wp224l18",
	jwplayer_key: "ttwoHLEQFRk9Kct9YkSlJw6IeXfuP5pkKnDtHVDUcGs="
};


PRP.app.constant("base", {
	api: {
		get_project: "https://player.piksel.com/ws/get_project/p/" + PRP.properties.project_uuid +"/api/" + PRP.properties.key + "/apiv/4.0/mode/json",
		get_programs: "https://player.piksel.com/ws/get_programs/p/" + PRP.properties.project_uuid +"/api/" + PRP.properties.key,
		get_program_details: "https://player.piksel.com/ws/get_program_details/p/"
	}
});


PRP.templates = {
	subCategoryPage: ['<div data-role="page" id="{{subCategoryPage.categoryid}}" class="hide">',
						'<div data-role="header" data-position="fixed">',
							'<a href="#{{subCategoryPage.parentid}}" data-transition="slide" data-direction="reverse" class="header-nav-item ui-btn-left large menu"><i class="icon-arrow-left"></i></a>',
							'<h1>{{subCategoryPage.name}}</h1>',
						'</div>',
						
						'<div role="main" class="ui-content jqm-content jqm-fullwidth">',
							'<div class="row content-top category-grouping">',
								'<div class="span-1 c rounded-corners white category-container">',
									
									
									'<div class="span-1 light-grey-line bottom-line no-pad category-grouping-programs" ng-repeat="program in subCategoryPage.programs">',
										'<div class="span-40 no-pad pad-top pad-bottom">',
											'<a href="" ng-click="callVideo(program, subCategoryPage.categoryid)" data-transition="slide"><img ng-src="{{program.thumbnailUrl}}" style="width:100%;"></a>',
										'</div>',
										'<div class="span-60 l pad category-grouping-meta">',
											'<h5 class="med"><a href="" ng-click="callVideo(program, subCategoryPage.categoryid)" class="bold" data-transition="slide">{{program.Title}}</a></h5>',
											'<p class="small"><a href="" ng-click="callVideo(program, subCategoryPage.categoryid)" data-transition="slide">{{program.Description}}</a></p>',
											'<p class="small">{{program.duration}}</p>',
										'</div>',
									'</div>',


								'</div>',
							'</div>',
						'</div><!-- end main -->',

						'<div data-role="panel" id="sidePanelSubCat" class="sidePanel" data-position-fixed="true" data-display="push" ng-include="panel.html">',
							'<div class="span-1 pad logo-cntr">',
								'<img src="assets/PRP_final_14mar13.png" class="flex-img">',
							'</div>',
							'<ul class="unstyled align-left full-width-btn">',
								'<li ng-repeat="item in categories"><a href="#{{item.categoryid}}" data-transition="slide" panel>{{item.name}}</a></li>',
							'</ul>',
						'</div>',

					'</div><!-- Category page -->'].join("")
};
