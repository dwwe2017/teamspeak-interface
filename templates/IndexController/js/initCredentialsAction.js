$(document).ready(function()
{
    $('#init-credentials').submit(function(event)
    {
        event.preventDefault();
        $(this).initCredentials();
    });
});