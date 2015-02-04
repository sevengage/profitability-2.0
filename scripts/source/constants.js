var PRP = PRP || {};

PRP.app = angular.module("mobile", ["ngTouch", "ui.router"]);


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
