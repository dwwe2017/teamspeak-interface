$(document).ready(function()
{
    if($('#max-execution-time-valid').val() !== '1')
    {
        let win = $('#update-block').getModalWindow();
        win.addButtons({'Close': function(win) { win.closeModal(); }}, true);
    }
});