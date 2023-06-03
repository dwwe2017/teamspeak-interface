$(document).ready(function()
{
    $('#validate-credentials').submit(function(event)
    {
        event.preventDefault();
        $(this).validateCredentials();
    });
});