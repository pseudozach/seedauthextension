
console.log("seedauth begins...");

$(function(){
	console.log("browser_action ready");

	// check if already logged in
	var username = localStorage.getItem("username");
	if(username && username != ""){
		console.log("already logged in: ", username);
		$("#loggedinusername").text("Logged in as " + username);
		$("#loginholder").hide();
		$("#logoutholder").show();
	}

	// populate logged in sites
	var loggedinsites = JSON.parse(localStorage.getItem("loggedinsites"));
	if(loggedinsites){
		$("#loggedinsites").empty();
		$("#loggedinsites").css("border","");
		console.log("loggedinsites: ", loggedinsites);
		for (var i = loggedinsites.length - 1; i >= 0; i--) {
			var el = '<div style="margin: 5px;"><a href="' + loggedinsites[i] + '">' + loggedinsites[i] +' </a></div>';
			$("#loggedinsites").append(el);
		}
	}

	// populate identities - todo
});

$("form").submit(function(event){
	event.preventDefault();
	if($("#username").val() == "" || $("#password").val() == ""){
		alert("enter both username and password to generate an identity");
		return;
	}
	localStorage.setItem("username", $("#username").val());
	localStorage.setItem("password", $("#password").val());
	$("#loggedinusername").text("Logged in as " + $("#username").val());
	$("#loginholder").hide();
	$("#logoutholder").show();
});

$("#logout").click(function(){
	localStorage.removeItem("username");
	localStorage.removeItem("password");
	$("#loggedinusername").hide();
	$("#loginholder").show();
	$("#logoutholder").hide();
	$("#loggedinsites").empty();
});

function togglePassword(e) {
	e.preventDefault()
	passwordType = passwordType === 'password' ? 'text' : 'password'
}
