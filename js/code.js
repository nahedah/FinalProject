//******************************** MILLESTONE 1 FUNCTIONALITY *********************************//

/////((------------------------------------))////////////
//// //*      Declaring Variables         *//////////////
db = window.openDatabase('temp23DB', '1.0', 'The contacts database ', 5 * 1024 * 1024)
createDB();
var jsondata;
var theservice;
var campusDetailsIndexV;
var thedayV;
var	thehourV;
var thetimeV;
var	classV;
var	courseV;
var	descriptionV;
var reminderV;
var reminderHourV;
var theid;
var dbids=[];
var thedateV;
var oldcourseV;
var dbimg;
var savedimg;
var selectedid;
var pimid;
var paramsV;
var allContacts = [];
var allCalender = [];
var firstV, lastV, mobileV, workV, personalEmailV, workEmailV;


/////((------------------------------------))////////////
//////*       Database View functions     *//////////////

/*
 * Show the div that represents the contact list
 * This shows when the contact tab is clicked
 *
 */
function showContactsList(){
	document.getElementById('addContact').style.display = "none";
	document.getElementById('contactList').style.display = "block";
	document.getElementById('contactsTitleBar').setCaption("All Contacts");
	populateContacts();
	
}

/*
 * Show the div that represents the add contacts
 * This shows when the + tab is clicked
 *
 */
function showAddContacts(){
	document.getElementById('contactsTitleBar').setCaption("Add Contact");
	document.getElementById('addContact').style.display = "block";
	document.getElementById('contactList').style.display = "none";
}


/////((------------------------------------))////////////
//////*     Declaring Database functions  *//////////////


/*
 * function will add the contacts to the database
 * Only the description and id are stored
 *
 */

function addContactstoDB() {
	// Get a reference to all the input fields 
	var firstNameV = document.getElementById("firstNameF").value;
	var lastNameV = document.getElementById("lastNameF").value;
	var descriptionV = document.getElementById("descriptionF").value;
	var homePhoneV = document.getElementById("homePhoneF").value;
	var mobilePhoneV = document.getElementById("mobilePhoneF").value;
	var workEmailV = document.getElementById("workEmailF").value;
	var personalEmailV = document.getElementById("personalEmailF").value;

	// Get a reference to the database
	//var db = mynamespace.db;
	// Insert the record to the database if all the field elements were filled
	if ( (firstNameV!="" && lastNameV!="" && descriptionV!="" )
		&& ( (homePhoneV!="") ||  (mobilePhoneV!="") ) 
		&& ( (workEmailV!="") ||  (personalEmailV!="") )
		
		)
		{
		//Stores the contact entered by the user to the phone
		//alert( document.querySelector('#firstNameF').value);
		'use strict';
		var options, contact, onSuccess, onError;
	
		if  (document.querySelector('#homePhoneF').value ==""){
			document.querySelector('#homePhoneF').value = "";
		}
			if  (document.querySelector('#mobilePhoneF').value ==""){
			document.querySelector('#mobilePhoneF').value = "";
		} 
			if  (document.querySelector('#personalEmailF').value ==""){
			document.querySelector('#personalEmailF').value = "";
		} 
			if  (document.querySelector('#workEmailF').value ==""){
			document.querySelector('#workEmailF').value = "";
		} 
		var contacts = blackberry.pim.contacts,
			ContactField = contacts.ContactField,
			name = {},
			workPhone = { type: ContactField.WORK, value: document.querySelector('#mobilePhoneF').value },
			homePhone = { type: ContactField.HOME, value: document.querySelector('#homePhoneF').value },
			workEmail = { type: ContactField.WORK, value: document.querySelector('#workEmailF').value },
			homeEmail = { type: ContactField.HOME, value:document.querySelector('#personalEmailF').value},
			contact;
			name.familyName = document.querySelector('#lastNameF').value;
			name.givenName = document.querySelector('#firstNameF').value;
			contact = contacts.create({
			"displayName": document.querySelector('#firstNameF').value+document.querySelector('#lastNameF').value ,
			"name": name,
			"phoneNumbers": [workPhone,homePhone ],
			"emails": [workEmail, homeEmail]
			});
			contact.save(function (contact) {
				pimid=contact.id;
				
				db.transaction(function(tx) {
				tx.executeSql("INSERT INTO contactsTable(id, description) VALUES (?, ?)",[pimid, descriptionV],
					function(trans, result) {
						// handle the success
						//alert("Added the contact: "+firstNameV);
						document.getElementById("firstNameF").value ="";
						document.getElementById("lastNameF").value="";
						document.getElementById("descriptionF").value="";
						document.getElementById("homePhoneF").value ="";
						document.getElementById("mobilePhoneF").value="";
						document.getElementById("workEmailF").value="";
						document.getElementById("personalEmailF").value="";
					},
					function(trans, error) {
						// Handle the error
						alert("Error adding "  + error);
					}
				);
			});
		}, onError);
		/* If there is an error, let the user know. */
		onError = function (error) {
			alert('Error ' + error.code);
		};
	}//if
	else
	{
		alert("please fill name, family name, description, at least one email and at least one phone");
	}
}//addContactToDB

/*
 *
 * Grabs contacts from Phone and Description from DB and populates the list 
 * in the main screen
 *
 */
function getContactsList(){
	populateContacts();
}//getContactsList

/*
 *
 * Gets contacts from local DB and matches them to PIM contacts 
 * 
 *
 */

function matchContactsToDB(){
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM contactsTable",
		[],
		function(trans, result) {
			var rowOutput ="";
			for(var i=0; i < result.rows.length; i++) {
				rowOutput += result.rows.item(i).id;
				rowOutput += " ";
			}
			var items = [],
			item;
			if (result.rows.length!=0){
				// Create the item's DOM in a fragment
				for (var i = 0; i < result.rows.length; i++) {
					var position=-1;
					//look for thr contact id, loop through the records
					for (var n = 0; n < allContacts.length; n = n + 1) {
						if (parseInt(allContacts[n].id )== 	parseInt(result.rows.item(i).id )){
							position = n;
							break;
						}
					}//for
					
				//we do this if the contact exists in allContacts
					if (position!=-1 ){
						item = document.createElement('div');
						item.setAttribute('data-bb-type','item');
						item.setAttribute('data-id',result.rows.item(i).id);
						item.setAttribute('data-desc',result.rows.item(i).description);
						
						if (result.rows.item(i).picture!= null){
							item.setAttribute('data-picture',result.rows.item(i).picture);
						}
						else{
							
							item.setAttribute('data-picture','');
						}
						
						item.setAttribute('data-bb-title',allContacts[position].name.givenName);
						item.onclick = function() { 		
							var selected = document.getElementById('contactlist').selected;
							savedimg = selected.getAttribute('data-picture');
							selectedid=selected.getAttribute('data-id');
							getContactById(selectedid);
							//getContactById(selected.getAttribute('data-id'));
							bb.pushScreen("details.html", "details", {'first' : firstV,'last' : lastV,'mobile' : mobileV,'home' : workV, 'workEmail' : workEmailV,'personalEmail' : personalEmailV, 'desc' : selected.getAttribute('data-desc')});
						};
						items.push(item);
					}//if exists in all contacts
					else{
						//we have to delete the contact from our database
						deleteID(result.rows.item(i).id);
						populateContacts();
					}
				}//for
			}//if
			else{
				//if no records are there
				item = document.createElement('div');
				item.setAttribute('data-bb-type','item');
				item.innerHTML = "No contacts, click on + to add one";
				item.onclick = function() {alert('clicked');};
				items.push(item);
			}
			document.getElementById('contactlist').refresh(items);
		},
		function(trans, error) {
			// handle the error
		}
	)
	});

	
}

/*
 *
 * Creates the database if it does not exist and opens it
 *
 */
 
function createDB(){
			db.transaction(
				function (tx) {
					//tx.executeSql('CREATE TABLE contactsTable ( id int unique , description text, imageid int)', [],
					
					tx.executeSql('CREATE TABLE   IF NOT EXISTS contactsTable ( id int unique , description text, picture text)', [],
					function (tx, res) {
						//alert("Table Created Successfully");
					},
					function (tx, err) {
						alert("ERROR - Table creation failed - code: " + err.code + ", message: " + err.message);
					});
					
					//create the picture table
					tx.executeSql('CREATE TABLE  IF NOT EXISTS  calendar ( id INTEGER  PRIMARY KEY )', [],
					function (tx, res) {
						//alert("Table Calendar Created Successfully");
					},
					function (tx, err) {
						alert("ERROR - Table creation failed - code: " + err.code + ", message: " + err.message);
					});
					
				});
				
		
}//createDB


/*
 *
 * Deletes the cotnact from the database if it no longer exists in the BB contact list
 *
 */
function deleteID(id){
	
	db.transaction(function(tx) {
		tx.executeSql("DELETE  FROM contactsTable WHERE ID = "+id,
			[],
			function(trans, result) {
				//alert("contact: "+id+" has been deleted");
			},
			function(trans, error) {
				// handle the error
			}
		)
	});
}//deleteID



/////((------------------------------------))////////////
//// //*      Declaring PIM functions     *//////////////

/*
 *
 * Handles the PIM functionality by retreiving the contacts and storing 
 * them in an array
 */

	/* This function gets called when we want to populate our Image List with Contacts. */
	 function populateContacts() {
		'use strict';
		var contactFields, onFindSuccess, onFindError, findOptions;

		/* The fields to return. */
		contactFields = ['id','name'];

		/* This function takes the Contacts that are found and feeds them one-by-one
		 * to our insertContact method that creates the BBUI.js <div> elements.
		 */
		onFindSuccess = function (contacts) {
			var n;
			allContacts = contacts;
			matchContactsToDB();
		};

		/* Called if there is an error during search. */
		onFindError = function (error) {
			if (error.code === 0) {
				alert('An unknown error occurred.');
			} else if (error === 1) {
				alert('A parameter was incorrect.');
			} else if (error === 2) {
				alert('The operation timed out.');
			} else if (error === 3) {
				alert('The operation failed because a previous operation is pending.');
			} else if (error === 4) {
				alert('An IO error occurred.');
			} else if (error === 5) {
				alert('The operation is not supported.');
			} else if (error === 20) {
				alert('The operation failed due to insufficient permissions.');
			} else {
				alert('Error Code: ' + error.code);
			}
		};

		/* Create a blank ContactFindOptions object. */
		findOptions = new blackberry.pim.contacts.ContactFindOptions();
		
		/* Here we supply the variables we just initialized and invoke our call to find. */
		blackberry.pim.contacts.find(contactFields, findOptions, onFindSuccess, onFindError);
	}



/*
 *
 * When the user clicks on the contact list in the main screen this funciton
 * gets called to grab the details of that contact to display them in the detail page
 */
	
	
function getContactById(contactId) {
	var contacts = blackberry.pim.contacts;
	var contact = contacts.getContact(contactId);
	if (contact) {
		firstV = contact.name.givenName;
		lastV=contact.name.familyName;
		mobileV = "";
		workV = "";
		personalEmailV = "";
		workEmailV = "";
		
		if ( typeof (contact.phoneNumbers[0]) != "undefined"){
			if (contact.phoneNumbers[0].type == 'home' ){
				workV=contact.phoneNumbers[0].value;
			}
			else if  (contact.phoneNumbers[0].type == 'work' ){
				mobileV=contact.phoneNumbers[0].value;
			}
		}

		if ( typeof (contact.phoneNumbers[1]) != "undefined"){
			 if (contact.phoneNumbers[1].type == 'work' ){
				mobileV=contact.phoneNumbers[1].value; 
			}
			else if  (contact.phoneNumbers[1].type == 'home' ){
				workV=contact.phoneNumbers[1].value;
			}
		}
		
		if ( typeof (contact.emails[0]) != "undefined"){
			if (contact.emails[0].type == 'home' ){
				personalEmailV=contact.emails[0].value;
			}
			else
			if (contact.emails[0].type == 'work' ){
				workEmailV=contact.emails[0].value;
			}
			
		}
		
		if ( typeof (contact.emails[1]) != "undefined"){
			if (contact.emails[1].type == 'work' ){
				workEmailV=contact.emails[1].value;
			}
			else
			if (contact.emails[1].type == 'home' ){
				personalEmailV=contact.emails[1].value;
			}
		}
		
	} 
	else {
		alert("There is no contact with id: " + contactId);
	}
}

//******************************** MILLESTONE 2 FUNCTIONALITY *********************************//

/////((--------------------------------------------))////////////
//////*     Going places - Invokation functions    *//////////////

/*
 *
 * Invokes Octranspo website on the browser
 */
function invokeOCTranspo(){
	blackberry.invoke.invoke({
		target: "sys.browser",
		uri: "http://www.octranspo.com/mobi/"
	}, onSuccess, onError);
}//invokeOCTranspo

function onSuccess(response) {
	//alert("<p>Invocation query successful: " + response + "</p>");
}

function onError(error) {
	alert("<p>Invocation query error: " + error + "</p>");
}

//******************************** MILLESTONE 3 FUNCTIONALITY *********************************//

/////((--------------------------------------------))////////////
//////*     Camera - Invokation functions    *//////////////

function invokeCameraCard() {

	var mode = blackberry.invoke.card.CAMERA_MODE_PHOTO;
	blackberry.invoke.card.invokeCamera(mode, function (path) {
			var filepath = 'file://' + path;
			document.getElementById("contactimage").src = filepath;
			///capturedimage
			dbimg = path;
			savedimg=filepath;
			addPictureToDB();
		},
		function (reason) {
			alert("cancelled " + reason);
		},
		function (error) {
		if (error) {
			alert("invoke error "+ error);
		} else {
			console.log("invoke success " );
		}
	});
}//invokeCameraCard() 


/*
 * Show the div that represents the camera
 * This shows when the camera button is clicked
 *
 */
function showCameraView(){
	document.getElementById('imagesview').style.display = "none";
	document.getElementById('cameraview').style.display = "block";
	invokeCameraCard();
}

/*
 * Show the div that represents the images gallery
 * This shows when the myinages button is clicked
 *
 */
function showImagesView(){
	document.getElementById('imagesview').style.display = "block";
	document.getElementById('cameraview').style.display = "none";
	document.getElementById('camera').refresh();
	
}

/*
* This adds the image to the database
*/
function addPictureToDB(){
	// Get a reference to the database
	//var db = mynamespace.db;
	db.transaction(function(tx) {
			 tx.executeSql("UPDATE contactsTable SET picture = ? WHERE id = ? ", [dbimg, selectedid],
					function(trans, result) {
						//alert("Picture updated successfully in contact details");
					},
					function(trans, error) {
						// Handle the error
						alert("Error adding "  + error);
					}
				);
			});
}//addPictureToDB



//******************************** MILLESTONE 5 FUNCTIONALITY *********************************//


/////((------------------------------------))////////////
//////*     Declaring Calender functions  *//////////////


/*
 * function will add the Schedule to the database
 * Only the description and id are stored
 *
 */

function addCalendertoDB() {
//


	var notes =  eval(document.querySelector('#lab').selectedOptions[0].value)?"Lab":"Not a Lab";

	var now = new Date();
	var currentDate = new Date();
	
	var diff;
	if (document.querySelector('#days').selectedOptions[0].value>=now.getDay()){
		diff = eval(document.querySelector('#days').selectedOptions[0].value)-now.getDay();
	}else{
		 diff = now.getDay()+eval(document.querySelector('#days').selectedOptions[0].value)-1;
	}
	
	currentDate.setDate(now.getDate() +  diff);
	
	
	var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), eval(document.querySelector('#time').selectedOptions[0].value), 0, 0,0);
	
	var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), eval(document.querySelector('#time').selectedOptions[0].value)+eval(document.querySelector('#hours').selectedOptions[0].value), 0, 0,0);
	var event = blackberry.pim.calendar.createEvent({
		'summary':	document.querySelector('#course').value,
		'location':	document.querySelector('#room').value,
		'start': startDate,
		'end': endDate,
		'description': notes,
		'reminder': eval(document.querySelector('#reminderhour').selectedOptions[0].value)
	});
	event.description = notes;
	event.save(
		function (e) {
			db.transaction(function(tx) {
				thedayV ="";
				thehourV="";
				thetimeV="";
				classV="";
				courseV="";
				descriptionV="";
				reminderV="";
				reminderHourV="";
			tx.executeSql("INSERT INTO calendar(id) VALUES (?)",[e.id],
				function(trans, result) {
					// handle the success
					alert("Added the course to your Calendar");
				},
				function(trans, error) {
					// Handle the error
					alert("Error adding "  + error);
				}
			);
		});
		},
		function (error) {
			alert('Error: ' + error.code);
		}
	);
}//addCalenderToDB


/*
 * Show the div that represents the contact list
 * This shows when the calender tab is clicked
 *
 */
function showCalenderList(){
	
	document.getElementById('addCalender').style.display = "none";
	document.getElementById('calenderList').style.display = "block";
	document.getElementById('calenderTitleBar').setCaption("My Timetable");
	
	populateCalender();
}

/*
 * Show the div that represents the add contacts
 * This shows when the + tab is clicked
 *
 */
function showAddCalender(){
	document.getElementById('calenderTitleBar').setCaption("Add Course");
	document.getElementById('addCalender').style.display = "block";
	document.getElementById('calenderList').style.display = "none";
}

/* This function gets called when we want to populate our Image List with Contacts. */
function populateCalender() {

	
	var options = {};//maybe remove it 
	blackberry.pim.calendar.findEvents(
		options,
		function (events) {
			allCalender = events;
			matchCalenderToDB();
	},
	function (error) {
		/* Notify of an error. */
		alert('Error: ' + error.code);
	});
}

/*
 *
 * Deletes the Schedule from the database if it no longer exists in the BB contact list
 *
 */
function deleteCalenderID(){
	db.transaction(function(tx) {
		tx.executeSql("DELETE  FROM calendar WHERE ID = "+theid,
			[],
			function(trans, result) {
				alert("Schedule: has been deleted");
			},
			function(trans, error) {
				// handle the error
			}
		)
	});
}//deleteID


function updateCalendar(){
	var notes;
	var events = blackberry.pim.calendar;
	var evt = events.getEvent(theid.toString(), events.getDefaultCalendarFolder());
	if (evt) {
		var tempd = new Date(thedateV);
		var  dateToRemove =  new Date();
		var notes =  eval(document.querySelector('#labD').selectedOptions[0].value)?"Lab":"Not a Lab";
		
		var now = new Date();
		var currentDate = new Date();
		//currentDate.setDate(now.getDate() + eval(document.querySelector('#daysD').selectedOptions[0].value) );
		
		var diff;
	if (document.querySelector('#daysD').selectedOptions[0].value>=now.getDay()){
		diff = eval(document.querySelector('#daysD').selectedOptions[0].value)-now.getDay();
	}else{
		 diff = now.getDay()+eval(document.querySelector('#daysD').selectedOptions[0].value)-1;
	}
	
	currentDate.setDate(now.getDate() +  diff);
	
		
		
		
		var startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), eval(document.querySelector('#timeD').selectedOptions[0].value), 0, 0,0);
		var endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), eval(document.querySelector('#timeD').selectedOptions[0].value)+eval(document.querySelector('#hoursD').selectedOptions[0].value), 0, 0,0);
		evt.start =startDate;
		evt.end =endDate;
		evt.description =eval(document.querySelector('#labD').selectedOptions[0].value)?"Lab":"Not a Lab";
		evt.summary =document.querySelector('#courseD').value;
		evt.location =document.querySelector('#roomD').value;
		evt.reminder =  eval(document.querySelector('#reminderHourD').selectedOptions[0].value);
		evt.save(
			function (e) {
				alert('Your Calendar has been updated');
					thedayV ="";
					thehourV="";
					thetimeV="";
					classV="";
					courseV="";
					descriptionV="";
					reminderV="";
					reminderHourV="";
			});//save
	}else{
		
	}
}

function onSuccess() {
	//alert("Event removed!");
}

function onError(error) {
   alert("Failed to remove event, error code: " + error.code);
}

function removeSingleOccurrence() {
	//function removeSingleOccurrence(keyword, dateToRemove) {
	// find all instances of the recurring event
	var calendar = blackberry.pim.calendar,
	evt;
	var tempd = new Date(thedateV);
	var  dateToRemove =  new Date();
	calendar.findEvents({
		"filter": {
		"substring": oldcourseV,
		//"expandRecurring": true
		}//filter
	},//findevents
	function (events) {
		//alert("Found " + events.length + " events that matches filter!");
		events.forEach(function (evt) {
			if (evt.start.toISOString() === tempd.toISOString()) {
				evt.remove(function () {
					//alert(dateToRemove + " instance removed successfully!");
					deleteCalenderID();
				}, function (error) {
						//alert(dateToRemove + " instance not removed, error code: " + error.code);
					},
				false); // pass false to remove only this single occurrence
			}//if
		});//foreach
	},//func events 
	function (error) {
			alert("Failed to find events, error code: " + error.code);
	});//fun error
}//removeSingleOccurrence

function getCalenderEventByID(id){
	
	var events = blackberry.pim.calendar;
	var evt = events.getEvent(id.toString(), events.getDefaultCalendarFolder());
	if (evt) {
		
		descriptionV= evt.description;
		reminderhourV= evt.reminder;
	}
	else{
		//alert("not there");	
	}
}//getCalenderEventByID

/*
 *
 * Gets contacts from local DB and matches them to PIM contacts 
 * 
 *
 */

function matchCalenderToDB(){
		var delid;
		var items= [], div, n;
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM calendar",
		[],
		function(trans, result) {
			var rowOutput ="";
			for(var i=0; i < result.rows.length; i++) {
				rowOutput += result.rows.item(i).id;
				rowOutput += " ";
			}
			var items = [],
			item;
			if (result.rows.length!=0){
				// Create the item's DOM in a fragment
				for (var i = 0; i < result.rows.length; i++) {
					var position=-1;
					//look for thr contact id, loop through the records
					for (var n = 0; n < allCalender.length; n = n + 1) {
						if (parseInt(allCalender[n].id )== 	parseInt(result.rows.item(i).id )){
							position = n;
							break;
						}
					}//for
					
				//we do this if the contact exists in allCalendar
					if (position!=-1 ){
						var theday =  days[  allCalender[position].start.getDay() ];
						var thehour = allCalender[position].start.getHours();
						suffex = (thehour >= 12)? ':00 pm' : ':00 am';
						thehour = (thehour > 12)? thehour -12 : thehour;
						var duration = allCalender[position].end.getHours() -allCalender[position].start.getHours();
						// Create a BBUI list item and add it to the image list. 
						div = document.createElement('div');
						div.setAttribute('data-bb-type', 'item');
						div.setAttribute('data-bb-img', 'images/actionBar/timetableadd.png');
						div.setAttribute('data-id',  allCalender[position].id);
						div.setAttribute('data-thedate',  allCalender[position].start);
						div.setAttribute('data-theday',  allCalender[position].start.getDay());
						div.setAttribute('data-thehour',  allCalender[position].start.getHours());
						div.setAttribute('data-class',  allCalender[position].location);
						div.setAttribute('data-thetime',  duration);
						div.setAttribute('data-course',  allCalender[position].summary);
						div.setAttribute('data-description',  allCalender[position].description);
						div.setAttribute('data-reminder',  allCalender[position].reminder);
						div.setAttribute('data-reminderHour',  allCalender[position].reminder);
						div.setAttribute('data-bb-title', theday );
						div.innerHTML = allCalender[position].summary +"<br>"+allCalender[position].description+"   "+
						thehour+
						suffex
						+"<br>"+allCalender[position].location+"<br>"+
						duration+ " Hours";
						
						div.setAttribute('style', 'font-size:32px; font-weight:bold;background-color:#aaa; word-wrap: break-word;height:500px');
						div.calendarEvent = allCalender[position]; // Keep a reference to the Calendar event in case we want to remove it.
						var divbutton = document.createElement('div');
						divbutton.appendChild(document.createTextNode("Edit"));
						divbutton.onclick = function() {
						 };
						divbutton.setAttribute('style', 'width:80px;  background-color:#fff; ');
						div.onclick = function() { 
							var selected = document.getElementById('calenderlist').selected;
							thedayV =  selected.getAttribute('data-theday');
							theid = selected.getAttribute('data-id');
							getCalenderEventByID(theid);
							thehourV = 	selected.getAttribute('data-thehour');
							thetimeV = selected.getAttribute('data-thetime');
							classV = selected.getAttribute('data-class');
							courseV = selected.getAttribute('data-course');
							//descriptionV = selected.getAttribute('data-description');
							reminderV =  selected.getAttribute('data-reminder');
							reminderHourV =  selected.getAttribute('data-reminderHour');
							thedateV = selected.getAttribute('data-thedate');
							bb.pushScreen("calendarDetail.html", "calendarDetail");
						};
						div.appendChild(divbutton);
						items.push(div);
						
					}//if exists in all contacts
					else{
						
						delid = result.rows.item(i).id;
						//we have to delete the contact from our database
						//deleteCalenderID(result.rows.item(i).id);
						db.transaction(function(tx) {
							tx.executeSql("DELETE  FROM calendar WHERE id = "+delid,
								[],
								function(trans, result) {
									//alert("Course: "+delid+" has been deleted");
								},
								function(trans, error) {
									// handle the error
								}
							)
						});
						populateCalender();
					}
				}//for
			}//if
			else{
				//if no records are there
				item = document.createElement('div');
				item.setAttribute('data-bb-type','item');
				item.innerHTML = "No courses, click on + to add one";
				item.onclick = function() {alert('clicked');};
				items.push(item);
			}
				document.getElementById('calenderlist').refresh(items);
		},
		function(trans, error) {
			// handle the error
		}
	)
	});
}

//******************************** MILLESTONE 6 FUNCTIONALITY *********************************//

/////((--------------------------------------------))////////////
//////*     Campus Services - Populate JSON List    *//////////////

function getData(){
var data=null;
	if (data==null){
		//$.getJSON("http://fsm.site88.net/nahed/final/exportJSON.php",goodJSON).fail(failJSON);//working
		$.getJSON("data/campusdata.js",goodJSON).fail(failJSON);
	}
}

function goodJSON(xhrData, status,jqXHR){
	data = xhrData;
	jsondata= data;
		var items1 =[];
		for (var i = 0; i < data.services.length; i++) {
			
			var div1 = document.createElement('div');
			div1.setAttribute('data-bb-type', 'item');
			div1.setAttribute('data-id', i.toString());
			div1.setAttribute('data-bb-title', data.services[i].servicename);
			div1.setAttribute('data-campusDetailsIndex', i);
			div1.setAttribute('data-servicename', data.services[i].servicename);
			//div1.innerHTML =data.services[i].servicedetail[0].itemname;
			div1.onclick = function() { 
					var selected = document.getElementById('campuslist1').selected;
					campusDetailsIndexV =  selected.getAttribute('data-campusDetailsIndex');
					theservice =  selected.getAttribute('data-servicename');
					bb.pushScreen("campusDetail.html", "campusDetail");
				};//onclick
			items1.push(div1);
		}//for
		document.getElementById('campuslist1').refresh(items1);
}//goodJSON


function failJSON(jqXHR, textStatus, errorThrown){
	alert(errorThrown);
}//failJSON

