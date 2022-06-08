$(document).ready(function()
{
    $('button[type=submit]').click(function(event){
        event.preventDefault();
        let current_tab = $(document).find('ul.controls-tabs:first').find('li.current:first');
        let tab_id = current_tab.children('a:first').attr('href');
        let form = $(tab_id);
        form.length === 0 || form.submit();
    });

    $('button[type=reset]').click(function(event){
        event.preventDefault();
        let current_tab = $(document).find('ul.controls-tabs:first').find('li.current:first');
        let tab_id = current_tab.children('a:first').attr('href');
        let form = $(tab_id);
        form.length === 0 || form[0].reset();
    });

    $('.modal-cronjob-add').click(function (event) {
        event.preventDefault();

        let redirect = encodeURIComponent($(this).attr('href'));

        $.modal({
            title: tjs.get('Add Cronjob'),
            draggable: true,
            closeButton: true,
            url: "index.php?controller=modal&action=cronjobAdd&redirect=" + redirect,
            width: 480,
            height: 545,
            buttons: {
                'Save': function (win) {
                    let form = win.getModalContentBlock().find('form');
                    form.tsiCronjobAdd();
                },
                'Close': function (win) {
                    win.closeModal();
                }
            }
        });
    });

    $('.modal-cronjob-edit').click(function (event) {
        event.preventDefault();

        let redirect = encodeURIComponent($(this).attr('href'));
        let cronId = $(this).parent().find('.number:first').html();

        $.modal({
            title: tjs.get('Edit Cronjob'),
            draggable: true,
            closeButton: true,
            url: "index.php?controller=modal&action=cronjobEdit&cronjobId=" + cronId + "&redirect=" + redirect,
            width: 480,
            height: 545,
            buttons: {
                'Save': function (win) {
                    let form = win.getModalContentBlock().find('form');
                    form.tsiCronjobEdit();
                },
                'Close': function (win) {
                    win.closeModal();
                }
            }
        });
    });
});