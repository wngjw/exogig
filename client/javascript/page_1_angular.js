//	TypeScript File Compiles to page_1_angular.js
//	You can compile into the JS, by using Ctrl+B
var testInt;
testInt = 5;
var test = "hello world";
console.log(function_name());
http_example();
function function_name() {
    return "janet";
}
function http_example() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", '/checkme'); // false for synchronous request
    xmlHttp.send(null);
    alert('hi mom' + xmlHttp.responseText);
    console.log(xmlHttp.responseText);
    console.log(xmlHttp.response);
    //return xmlHttp.responseText;
}
