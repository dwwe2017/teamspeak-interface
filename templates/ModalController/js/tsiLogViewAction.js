$(document).ready(function()
{
    if(!$('#main_log_empty').length)
    {
        $('.search-input').keyup(function(event)
        {
            event.preventDefault();
            let string = $(this).val();

            let txt = $(this).prev('textarea');
            let log = txt.prev().prev();

            if(string !== ''){
                log.html(txt.val().replace(new RegExp(string, 'g'), '<span style="color:#ffffff; background: rgba(230, 81, 0, 1);"><b>' + string + '</b></span>'));
            }else{
                log.html(txt.val());
            }
        });
    }
    else
    {
        let win = $(this).getModalWindow();
        win.addButtons({'Close': function(win) { win.closeModal(); }}, true);
    }
});