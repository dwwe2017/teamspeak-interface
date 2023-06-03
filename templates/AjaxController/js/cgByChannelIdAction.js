$(document).ready(function()
{
    let clientdbid_cgByChannelId = source.clientdbid_cgByChannelId;
    let cid_cgByChannelId = source.cid_cgByChannelId;

    $('.ajax-modify-channelgroup').change(function(event){

        event.preventDefault();

        let cgid = $(this).attr('id');

        let options = {
            id: id,
            sid: sid,
            cldbid: clientdbid_cgByChannelId,
            cid: cid_cgByChannelId,
            cgid: cgid
        };

        $(this).clientCgSet(options, function(){

            let i = 0;
            $(this).parent().parent().find('p').each(function () {
                let checkbox = $(this).children('input[type=checkbox]:checked');
                if(checkbox && checkbox.attr('id') !== cgid){
                    checkbox.prop('checked', false);
                    checkbox.prop('disabled', false);
                    checkbox.parent().css({'border-width': '0'});
                    i++;
                }
            });

            let auto_refresh = parent.$('#ajax-auto-refresh');
            if(auto_refresh)
            {
                if(auto_refresh.prop('checked')){
                    parent.$('.tsi-viewer-refresh:first').click();
                }
            }

            $(this).prop('disabled', true);
            $(this).parent().css({ 'border-color': '#3399CC', 'border-style': 'solid', 'border-width': '2px' });
        });
    });
});