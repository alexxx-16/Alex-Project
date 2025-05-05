$("h1").addClass("big-title big-margin");

$("button").html("<em>Don't Click Me</em>");

$("button").click(function(){
    $("h1").css("color","hotpink");
});

 $("h1").on("mouseover", function(){
    $("h1").css("color","hotpink");
 });
  
$("h1").before("<button>Click Me</button>");