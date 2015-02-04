<?php
class profApp {

//setup vars - inputed elements
public $email = null;
public $password = null;
public $app = null;
public $groupId = null;

//setup table
public $productTable = null;

//lookup vars
public $infusionid = null;
public $infusionGroup = null;
public $accountPassword = null;

//result vars from work done
public $contactNotInSystem = null;
public $passwordMatch = null;
public $groupMatch = null;
public $groupName = null;

public function __construct($email, $pass, $table, $app, $group_id) {
	$this->email = $email;
	$this->password = $pass;
	$this->groupTable = $table; 
	$this->app = $app;
	$this->groupId = $group_id;
}

public function getInfusionId(){
	$contact['Email'] = $this->email;
	$returnFields = array('Id');
	$dups = $this->app->findByEmail($contact['Email'], $returnFields);
	$returnFields = array('Id');
    $dups =  $this->app->findByEmail($contact['Email'], $returnFields);	
		//Existing Contact - Update the contact
        if (!empty($dups)) {
            //update contact
			$this->infusionid = $dups[0]['Id'];
			// Get the groups and password of this user
			$fields = array('Id', 'Groups', 'Password');
			$results = $this->app->loadCon($this->infusionid,$fields);
			if(isset($results['Password'])){$this->accountPassword = $results['Password'];};
			if(isset($results['Groups'])){$this->infusionGroup = $results['Groups'];};
			$this->contactCreated = false;
			   
        } 
		//New Contact - Not in Infusion
		else {
           
			$this->contactNotInSystem = true;
        
        }

// Only do work if we have created a valid infusionid	
  if($this->infusionid){
	 
	//kick of the next step  
	
	/*Validation Steps: 
	
		1. Check Password
			Work to be done:
				a. Retreive password for Infusion ID
				b. Validate against the incoming Password Id
			Updates to outut
				a. If password mismatch - set passwordValid to false
		
		2. Check Group	
			Work to be done:
				a. Verify that the infusion ID has the current group id attached
			Updates to output
				a. If group doesn't match - set groupMatch to false
	*/
	 $passTrue = self::checkPass();
	 if($passTrue){
		 self::checkGroup();
		 
		 };
  }
	
}

/* Checks to see if the password is correct 
Needs to return true if it does or false if not
*/

public function checkPass(){
	//If this password has been set

	
	if($this->accountPassword){
		if($this->accountPassword == $this->password){
				$this->passwordMatch = true;
				return true;
		} else {
				$this->passwordMatch = false;
				return false;	
		}
		
		
	}
	
}

public function checkGroup(){
	$iSgroup = $this->infusionGroup;
	//These are comma separated if more than one
	
	// Get the list of id's to check against
	// Only exception is when there is 'all' 
	// Either way we wil prepare these values in an array
		if($this->groupId == 'all'){
		// Get all active tag_id's	
		  $lookupArray = array_keys($this->groupTable);
		} else {
		// Get only the current list	
		$lookupArray[] = $this->groupId;
		}
	
	if(strstr($iSgroup, ',')){
		// There is more than one group	
		$groupsArray = explode(',' , $iSgroup);
		
		
	} else {
		// Prepare the value in an array
		$groupsArray[] = $iSgroup;	
	}
	
	// Now compare the list of all id's to check for against the values in the system
	// Both lookup and the return values are in arrays
	
	for($i = 0;$i < sizeof($lookupArray);$i++){
		$lookup =	$lookupArray[$i];
		if(array_search($lookup, $groupsArray)){
			$key = array_search($lookup, $groupsArray);
			$this->groupMatch = true;
			$this->groupName =  $this->groupTable[$lookup]['displayName'];
			break;
		}
	}
	 
	
}
	
	
public function generateResponse() {
	
	/* Format Response Array 
		varName     | Values Expected
		----------------------------------------
		 Action     | Trial/Purchase
		 Email      | Email
		 Product    | 252B/FirstLook/XP3/Weekly
		 ProductId  | 1/2/3/4
		 NewContact | true/false
		 TagsApplied| 182/null
		 TagsRemoved| 186/null
		 InfusioncId| 9206
	
	*/
	$response = array();

	$response['Email'] = $this->email;
	$response['GroupId'] = $this->groupId;
	$response['InvalidEmail'] = $this->contactNotInSystem;
	$response['InfusionId'] = $this->infusionid;
	$response['PasswordMatch'] = $this->passwordMatch;
	$response['GroupMatch'] = $this->groupMatch;
	$response['GroupName'] = $this->groupName;
	
	// Convert to JSON
	$JSON = json_encode($response);
	return $JSON;
}
	
}


// Get the GET variables
// Example incoming url http://hosted_domain.com/infusion_api/p_rev.php?email=bswilley@rethinkgroup.org&group_id=1
/*	url var    | Expected options
---------------------------------------

	email      | "email"
	group_id   | all;1;1_2
	password   | password
*/

if(isset($_GET['email']) && isset($_GET['group_id']) && isset($_GET['password'])){
	// do stuff
	$password = $_GET['password'];
	$email  = $_GET['email'];
	$group_id = $_GET['group_id'];
	
	//Setup membership Table
	/* Overview
	Pid  |  DisplayName  | 
	---------------------------------------------- 
	1    |  First Look   | 
    2    |  252 Basics   | 
   	3    |  XP3          | 
   	4    |  Weekly       |
	*/
	
	$table = array();
	$table[184] = array('displayName' => 'Enterprise Free Video Library Access');
	$table[124] = array('displayName' => 'Free Video Library Access');
	$table[120] = array('displayName' => 'Free Access');
	$table[118] = array('displayName' => 'Paid Access');
	$table[118] = array('displayName' => 'Gold Membership');
	
	


// Setup Connection to IS isdk

require_once("src/isdk2.php");

$app = new iSDK;

if ($app->cfgCon("fivewishes")) {

   // Start up the lookupProcess
   
   $rethink = new profApp($email, $password, $table, $app, $group_id);
   $rethink->getInfusionId();
   $response = $rethink->generateResponse();
	echo $response;

   
} else {
    echo "Connection Failed";
} 


}
?>