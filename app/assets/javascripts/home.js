$(function() {

    $("#logo").animate({
        "height"   : "+=20"
    },400).animate({
        "height"   : "-=20"
    },400);

    $("#log-in").click(function(){
        window.location = '/users/login';
    });

    $("#sign-up").click(function(){
        window.location = '/users/new';
    });

    $("#learnmore-button").click(function(){
        window.location = 'index.html#about';
    });

    $('#get-started').mouseover(function(){
        $('#get-started').animate({
            "margin-top"  :   "45px"
        },100);
    }).mouseout(function(){
        $('#get-started').animate({
            "margin-top"  :   "40px"
        },100);
    });
	$('#get-started').click(function() {
		smoothScroll("getin", "slow");
	});
    $('#sign-up').mouseover(function(){
        $('#sign-up').animate({
            "width"  :   "+=50px",
            "margin-left" : "-=25px"
        },200);
    }).mouseout(function(){
        $('#sign-up').animate({
            "width"  :   "-=50px",
            "margin-left" : "+=25px"
        },200);
    });
    $('#log-in').mouseover(function(){
        $('#log-in').animate({
            "width"  :   "+=50px",
            "margin-left" : "-=25px"
        },200);
    }).mouseout(function(){
        $('#log-in').animate({
            "width"  :   "-=50px",
            "margin-left" : "+=25px"
        },200);
    });

    var i = 0;
    $("#copyright-bar").click(function() {
        if (i%2==0) {
            $("#copyright-bar img").attr("src", "/images/copyright-toggle.png");
            $("#copyright-bar").css("-moz-box-shadow", "0px 1px 8px #000");
            $("#copyright-bar").css("-webkit-box-shadow", "0px 1px 8px #000");
            $("#copyright-bar").css("box-shadow", "0px 1px 8px #000");
            $("#copyright-bar").animate({
                "width" : "600px"
            },200);
            $("#copyright-text").html("Copyright &copy; CoConceptualize 2012 Tris Le [<a href='mailto:20851625@student.uwa.edu.au'>20851625@student.uwa.edu.au</a>]");
            $("#copyright-text").fadeIn("fast");
            i++;
        }
        else {
            $("#copyright-bar").animate({
                "width" : "40px"
            },200);
            $("#copyright-text").html('<img src="/images/copyright.png" />');
            $("#copyright-text").fadeOut("fast");
            $("#copyright-bar img").attr("src", "/images/copyright.png");
            i++;
        }
    });

    $("#login-button").click(function(){
        if(!isEmail($("#email").val())){
            $("#login_error").html("Invalid email address");
            $("#login_error").fadeIn();
        }
    });

    /*  REGISTER ERROR DISPLAY */
    $("#signup-button").click(function(){
        if ($("#username").val() == "" || $("#email").val() == "" || $("#password").val() == "" || $("#password_confirm").val() == "" || $("#fname").val() == "" || $("#lname").val() == "") {
            $("#register_error").html("Empty field detected");
            $("#register_error").fadeIn();
            return false;
        }
        else if(!isName($("#username").val())){
            $("#register_error").html("Username is invalid");
            $("#register_error").fadeIn();
            return false;
        }
        else if(!isLong($("#username").val())){
            $("#register_error").html("Username should be at least 5 letters long");
            $("#register_error").fadeIn();
            return false;
        }
        else if(isNameOccupied($("#username").val())){
            $("#register_error").html("This username has been registered");
            $("#register_error").fadeIn();
            return false;
        }
        else if(!isEmail($("#email").val())){
            $("#register_error").html("Invalid email address");
            $("#register_error").fadeIn();
            return false;
        }
        else if(!isPassword($("#password").val())){
            $("#register_error").html("Password is invalid");
            $("#register_error").fadeIn();
            return false;
        }
        else if(!isLong($("#password").val())){
            $("#register_error").html("Password is not long enough (8-12 characters)");
            $("#register_error").fadeIn();
            return false;
        }
        else if($("#password_confirm").val() != $("#password").val()){
            $("#register_error").html("Password confirmation is wrong");
            $("#register_error").fadeIn();
            return false;
        }
        else {
            $("#register_error").html("Processing");
            $("#register_error").css("background-color", "#b7f691");
            $("#register_error").css("color", "#46bb00");
            $("#register_error").css("border", "1px solid #58d110");
            $("#register_error").fadeIn("slow").delay("400").fadeOut();
            $("#new_user").submit();
        }
    });

    $("#fields input").keydown(function(){
        var value = $(this).val();
        if (value != "" || value.length != 0) {
            $(this).css('background', '#fff url(/images/sign-up-required-filled.png) no-repeat scroll 7px 10px');
        }
        else {
            $(this).css('background', '#fff url(/images/sign-up-required.png) no-repeat scroll 7px 10px');
        }
    });

});

function smoothScroll(element,speed) {

    var startY = currentYPosition();
    var stopY = targetYPosition(element);

    var speedFactor = 100;
    if (speed == "fast") speedFactor = 150;

    var stepFactor = 40;
    var distance = stopY > startY ? stopY - startY : startY - stopY;

    if (distance < 100) {
        scrollTo(0, stopY); return; //-75 to prevent hidden
    }

    var speed = Math.round(distance / speedFactor);
    if (speed >= 20) speed = 20;

    var step = Math.round(distance / stepFactor);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
    }
    for (var i = startY; i > stopY; i -= step) {
        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
    }
}

function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) {
	    return self.pageYOffset;
	}
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
    }
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) {
	    return document.body.scrollTop;
	}
    return 0;
}

function targetYPosition(element) {
    var elm = document.getElementById(element);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } 
    return y;
}

function isEmail(strEmail) {
    
    if(!strEmail.length)
        return true;
    if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
        return true;
    else{
        warning = true;
        return false;
    }
}
function isName(strName){
    //alert(strName);
    if (!strName.length)
        return true;
    if (strName.search(/^[A-Za-z][A-Za-z0-9]{4,17}$/) != -1 && isLong(strName))
        return true;
    else{
        if(!isLong(strName))
        return true;
    }
    warning = true;
    return false;
}

function isNameOccupied(strName){
    if(strName == "a1234"){
        warning = true;
        return true;
    }
    
    return false;
}
function isPassword(str){
    if(str != $("#name").val() || str.length == 0)
        return true;
    warning = true;
    return false;
}
function isPasswordOccupied(str){
    if(str != $("#password").val() || str.length == 0)
        return true;
    else{
        warning = true;
        return false;
    }
}

var warning = false;
var minlength = 5;
var maxlength = 18;
function isLong(str){
    if(!str.length)
        return true;
    if(str.length < minlength || str.length > maxlength){
        warning = true;
        return false;
    }
    return true;
}