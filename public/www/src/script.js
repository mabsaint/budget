function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

jQuery("a.nav-link").bind('click', function(){
  console.log('click');
  myFunction();
});


