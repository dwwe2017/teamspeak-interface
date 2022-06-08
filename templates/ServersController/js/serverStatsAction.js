$(document).ready(function () {

    function serialize(select) {
        let array = [];
        select.each(function () {
            array.push($(this).val())
        });
        return array;
    }

    function init() {
        let ajax_container = $('#ajax-container');
        let selection = serialize(ajax_container.find('#selection'));
        let charttype = ajax_container.find('#charttype');
        let period = ajax_container.find('#period');

        selection = selection.length > 0 ? selection[0] : 0;
        charttype = charttype.val() ? charttype.val() : 0;
        period = period.val() ? period.val() : 7;

        ajax_container.addClass("blurry").load('index.php?controller=ajax&action=virtualServerStats', {
            'id': id,
            'sid': sid,
            'selection': selection,
            'charttype': charttype,
            'period': period
        }, function () {
            let container = $(this);
            container.hide().fadeIn(150);
            setTimeout(function () {
                container.removeClass("blurry");
            }, 250);
            $(this).find('#selection, #charttype, #period').change(function () {
                init();
            });
        });
    }

    let refresh_button = $('a[title=refresh]');
    refresh_button.attr("onclick", "");
    refresh_button.click(function (event) {
        event.preventDefault();
        init();
    });

    init();
});
