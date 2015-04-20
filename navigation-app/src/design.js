$(function(){

    $('#SugButton').on('click',function(){
        $('#SuggestionMessage').slideToggle("fast");
        $('#SugButton').toggle();
    });
    $('#UseSug').on('click',function(){
        $('#SuggestionMessage').slideToggle("fast");
        $('#SugButton').toggle();
    });
    $('#SkipSug').on('click',function(){
        $('#SuggestionMessage').slideToggle("fast");
        $('#SugButton').toggle();
    });
    
    $(".moreless").on('click', function(e){
        var klik = $(e.currentTarget);
        var targ = $('#' + klik.attr('data-more') );
        var more = klik.children(".more");
        var less = klik.children(".less");
        var mode = klik.hasClass("on");
        
        klik.toggleClass("on");
        targ.slideToggle("fast");
        more.toggle(mode);
        less.toggle(!mode);
        
    });
    
    $('#TestMode .switcher').on('click',function(){
        $('#TestMode .content').slideToggle("fast");
    });
    
    $('.sugcheck').on('click',function(e){
        var klik = $(e.currentTarget);
        var mama = klik.parent();
        mama.toggleClass('removed');
    });
  
});