// $(document).ready(function(){
//     $("h1").css("color","plum")
// })
// SAFE GUARD if <script> is put in the <head>

// $("h1").text("Goodbye world!");

$("button").html("<em>Don't Click Me</em>");

// $("a").attr("href", "http://www.bing.com");

// $("h1").click(function () {
//   $(this).text(
//     $(this).text() === "Hello world!" ? "Goodbye world..." : "Hello world!",
//   );
// });

// $("h1").click(function () {
//   $(this).css("color", "pink");
// });

$("button").click(function () {
  $("h1").slideUp().slideDown().animate({ margin: 20 });
});

// $("input").keydown(function (e) {
//   console.log(e.key);
// });

// $(document).keydown(function (e) {
//   $("h1").text(e.key);
//   console.log(e.key);
// });

$("h1").on("dblclick", function () {
  $(this).toggleClass("pink-text");
});
