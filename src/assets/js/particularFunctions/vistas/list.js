$(document).ready(function() { 
    $(function() {
        var page = window.location.pathname;
      
        $('.nav li').filter(function(){
           return $(this).find('a').attr('href').indexOf(page) !== -1
        }).addClass('active');
      
        $(".nav a").on("click", function() {
          $(".nav").find(".active").removeClass("active");
          $(this).parent().addClass("active");
        });
      });
});