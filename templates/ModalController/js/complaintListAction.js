$(document).ready(function(){

    let options = {
        id: id,
        sid: sid,
        block: $('#view-complaints-block')
    };

    $('.ajax-delete-complaint').click(function(event){

        event.preventDefault();
        $(this).serverComplaintDelete(options, function(){
            $(this).parent().parent().fadeOut();
        });
    });

    $('.ajax-client-ban').click(function(event){
        event.preventDefault();
        $(this).serverBanCreate(options);
    });
});