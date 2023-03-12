$(document).ready(function () {
    $('a.dl-option').click(function (event) {
        event.preventDefault();
        el = $(this);

        el.packageGet({}, function () {
            var response = this;
            el.find('img:first').fadeOut('slow');
            $('#' + response + '-check').fadeIn('slow');

            var redirect = "index.php?controller=index&action=index";

            var win = el.parents('section').getModalWindow();

            win.addButtons({
                'Close & Refresh': function () {
                    document.location.href = redirect;
                }
            }, true);
        });
    });

    $('#import-block').find('.modal-confirm').click(function (event) {
        event.preventDefault();

        var link = $(this).attr("href");

        $.modal({
            content: '<p><div class=\"warnings align-center\"><b>' + tjs.get("Do you really want to do this?") + '</b></div></p>',
            title: tjs.get('Confirm'),
            draggable: true,
            closeButton: false,
            maxWidth: 280,
            buttons: {
                'Continue': function (win) {
                    document.location.href = link;
                },
                'Close': function (win) {
                    win.closeModal();
                }
            }
        });
    });
});