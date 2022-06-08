$(document).ready(function()
{
    let create_channel_icon_id = $('#create_channel_icon_id');

    let hasIcon = create_channel_icon_id.length > 0;

    if(hasIcon)
    {
        create_channel_icon_id.serverIconsGet();
    }
});