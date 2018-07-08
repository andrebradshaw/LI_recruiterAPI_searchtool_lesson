/*/
//let's build a search tool

//many websites retrieve data from webservers a manner which allows any curious person to build a customized or enhanced search.

//today we will look at a url which provides a user with their inmail msgs as a JSON response

//https://www.linkedin.com/recruiter/api/mailbox/conversations?createdBefore=1525886390757&createdAfter=1510158400000&count=500&filter=awaitingResponse&type=conversation-list


/*/

//let's break down the url into its parts...

var recruiterAPI = 'https://www.linkedin.com/recruiter/api/mailbox/conversations'; //this returns conversations -- last 20 by default.

var q = '?'; //this indicates the start of parameters
var amp = '&'; //indicates additional parameter

var created_before = 'createdBefore='; //1525886390757 is a millisecond since 00:00:00:00 1 Jan 1970 date format. new Date(1525886390757) = May 09 2018 13:19:50 GMT-0400

var created_after = "createdAfter=";

var max_count = "count=";

var filter = "filter=";

//okay now have our parts seperated...
//we can build an html form using vanilla javascript
/*/
https://www.w3schools.com/js/js_htmldom.asp

javascript can manipulate elements of a website by changing the HTML and CSS content on command

/*/
//these are all standard DOM functions. for more information see w3schools and stackoverflow

var searchContainer = document.createElement("div"); //this creates a new div element within the HTML
searchContainer.setAttribute("id", "popupContainer"); //this sets an ID that we can use to call this element when we need to change items
document.body.appendChild(searchContainer); //now we want to append this element to the body of the HTML document --this is what you see on a website
//now we want to style this element
searchContainer.style.display = "block";
searchContainer.style.position = "fixed";
searchContainer.style.top = "200px";
searchContainer.style.left = "50%";
searchContainer.style.width = "40%";
searchContainer.style.height = "40%";
searchContainer.style.background = "DarkSlateGrey";
searchContainer.style.borderRadius = "1em"; //this curves the box borderRadius
searchContainer.style.padding = "3px";
searchContainer.style.zIndex = "10000";

//we also need a close button. let's put that at the top of the document
var closebtn = document.createElement("button");
document.getElementById("popupContainer").appendChild(closebtn);
closebtn.setAttribute("id", "btnclse");
document.getElementById("btnclse").innerText = "+"; //this will be our X button
closebtn.style.background = "transparent";
closebtn.style.position = "absolute";
closebtn.style.display = "block";
closebtn.style.transform = "scale(2.9, 2.9) rotate(-45deg)" //scale makes the "+" larger, rotate...rotates to make an X.
closebtn.style.borderRadius = "2em";
closebtn.style.padding = "2px";
closebtn.style.border = "1px";
closebtn.style.userSelect = "none";
closebtn.style.color = "DarkCyan";

//we need to create an input field for each search item
/*/
  1) created before
  2) created after
  3) max count
/*/


for(i=1; i<4; i++){
  switch (i){
    case 1:
    type = 'created after: "Jun 10 2018"'; //this will be the placeholder for the input field
    break;
    case 2:
    type = 'created before: "Jul 2 2018"';
    break;
    case 3:
    type = 'max count: "500"';
    break;
  }//end of switch

  var createBoxElm = document.createElement("input");
  document.getElementById("popupContainer").appendChild(createBoxElm);
  createBoxElm.setAttribute("id", "ibox_"+i);
  createBoxElm.setAttribute("placeholder", type);
  createBoxElm.style.width = "100%";
  createBoxElm.style.height = "32px";
  createBoxElm.style.padding = "6px";
  createBoxElm.style.border = "1px solid DarkSlateGrey";
  createBoxElm.style.background = "white";
  createBoxElm.style.borderRadius = "2em";
}//we will loop this for the number of new elements we wish to create.

//now we need an element for the filters, but that would require a dropdown, and building those functions are too advanced for this tutorial. We will come back to this at a later date

//lets create a button to trigger the search
var sbtn = document.createElement("button");
document.getElementById("popupContainer").appendChild(sbtn);
sbtn.setAttribute("id", "btn_bx");
document.getElementById("btn_bx").innerText = "Search";//we need to put some text in this search button
sbtn.style.background = "DarkCyan";
sbtn.style.border = "1px solid DarkSlateGrey";
sbtn.style.width = "100%";
sbtn.style.height = "33px";
sbtn.style.borderRadius = "2em";
sbtn.style.color = "white";

//now we will create a couple of event listeners. This listen for user interactions and then execute functions.

//the first function will close the element

function close(){
  document.body.removeChild(document.getElementById("popupContainer"));
}


//lets create the functions to put user data into the search parameters.
function meetsRegExpTest(rx, val, jsonp){ //rx will be our regular expression. val will be the input value. jsonp will be the parameter key we call in the url.
  if(rx.test(val) === true){//if the date format is correct, return value, else return an empty string.
    return jsonp+val;
  }else{
    return '';
  }
}

function executeSearch(){
  var cbefore = document.getElementById("ibox_1").value; //this will be whatever information a user types into the input field.
  var cafter = document.getElementById("ibox_2").value;
  var cmax = document.getElementById("ibox_3").value;
  //now we need to validate the information the user is inputing. Lets build a regular expression to check this
  var validDateRegX = /[a-zA-Z]{3,10}\s\d{1,2}\s2\d{3}/i;
  var validNumber = /\d+/;

  if(meetsRegExpTest(validDateRegX, cbefore, created_before).length >1){
    var time_before = created_before+ new Date(meetsRegExpTest(validDateRegX, cbefore, created_before)).getTime(); //we do not need the first ampersand because the ? will handle the first param.
  } else{
    var time_before = '';//this would be an empty string either way.
  }//we need to convert the date format to milliseconds if it exists, so we will add a condition to handle this.
  if(meetsRegExpTest(validDateRegX, cafter, created_after).length >1){
    var time_after = amp + created_after + new Date(meetsRegExpTest(validDateRegX, cafter, created_after)).getTime();
  }else{
    var time_after = '';
  }
  if(meetsRegExpTest(validNumber, cmax, max_count).length >0){
    var maxitems = amp + meetsRegExpTest(validNumber, cmax, max_count);
  }else{
    var maxitems = '';
  }
  var searchUrlPath = recruiterAPI + q + time_before + time_after+ maxitems;
  window.open(searchUrlPath, "_self");
}

//now the event listener
document.getElementById("btnclse").addEventListener("click", close);
//now we need an event listener for the search button.

document.getElementById("btn_bx").addEventListener("click", executeSearch);
