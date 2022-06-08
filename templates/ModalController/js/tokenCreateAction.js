$(document).ready(function(){

    $('#type').change(function(){

        let type = $(this).val();
        let sgs = $('#servergroup');
        let cgs = $('#channelgroup');
        let cid = $('#cid');

        if(type === 'servergroup')
        {
            cgs.prop('disabled', true).parent().hide();
            cid.prop('disabled', true).parent().hide();
            sgs.prop('disabled', false).parent().fadeIn();
        }
        else
        {
            sgs.prop('disabled', true).parent().hide();
            cgs.prop('disabled', false).parent().fadeIn();
            cid.prop('disabled', false).parent().fadeIn();
        }
    });
});