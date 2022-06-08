$(document).ready(function () {
    let tsi_instance_notes_manage = source.tsi_instance_notes_manage;


    $('#ajax-container').addClass("blurry").load('index.php?controller=ajax&action=serverList', {'id': id}, function () {

        let container = $(this);
        container.hide().fadeIn(150);
        let heightProperty = container.children("div").height() * 5;
        container.animate({'max-height': heightProperty}, 250, "swing", function () {
            setTimeout(function () {
                container.removeClass("blurry");
            }, 25);
        });

        if (tsi_instance_notes_manage === 1) {
            let note_count_el = $('#note_count');

            function refreshNoteCount() {
                note_count_el.html('<img alt="loading" src="images/ajax-loader.gif" style="width: 16px; height: 16px; vertical-align: middle;">' + tjs.get(' Loading notes'));
                $('.black-cell').html('<span class="loading"></span>');
                setTimeout(function () {
                    $.PostItAll.length(function (total) {
                        $('.black-cell').html('<span class="success"></span>');
                        total === 1 ? note_count_el.html(total + tjs.get(' stored note'))
                            : note_count_el.html(total + tjs.get(' stored notes'));
                    });
                }, 1000);
            }

            $.PostItAll.changeConfig('global',
                {
                    savable: true,
                    randomColor: true,
                    changeoptions: true,
                    blocked: false,
                    minimized: true,
                    expand: true,
                    addNew: false,
                    fixed: false,
                    autoHideToolBar: true,
                    askOnDelete: true,
                    showInfo: false,
                    autoPosition: true,
                    resizable: true,
                    toolbar: true,
                    removable: true,
                    askOnHide: false,
                    showMeta: false,
                    exportNote: false,
                    draggable: true,
                    editable: true,
                    addArrow: 'front'
                });

            $.PostItAll.changeConfig('note',
                {
                    onCreated: function (id, options, obj) {
                        let id_numb = id.slice(11);
                        $(document).find('.virtualserver-note[data-attached=' + id_numb + ']').hide();
                        $(document).find('.virtualserver-note-pinned[data-attached=' + id_numb + ']').show();
                        refreshNoteCount();
                    },
                    onDelete: function (id) {
                        let id_numb = id.slice(11);
                        $(document).find('.virtualserver-note-pinned[data-attached=' + id_numb + ']').hide();
                        $(document).find('.virtualserver-note[data-attached=' + id_numb + ']').show();
                        refreshNoteCount();
                    }
                });

            $.PostItAll.length(function (total) {
                if (total > 1) {
                    $.PostItAll.load();
                    note_count_el.html(total + tjs.get(' stored notes'));
                    $('.black-cell').html('<span class="success"></span>');
                } else if (total > 0) {
                    $.PostItAll.load();
                    note_count_el.html(total + tjs.get(' stored note'));
                    $('.black-cell').html('<span class="success"></span>');
                } else {
                    note_count_el.html(total + tjs.get(' stored notes'));
                    $('.black-cell').html('<span class="success"></span>');
                }
            });
        }
    });
});