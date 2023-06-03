$(document).ready(function()
{
    $('button[type=submit]').click(function(){
        $(document).find('form').submit();
    });

    $('button[type=reset]').click(function(){
        let form = $(document).find('form');
        form[0].reset();
    });
});