$(document).ready(function () {
    $('.modal-import-users').click(function (event) {
        event.preventDefault();
        $.modal({
            title: tjs.get("Import users"),
            draggable: 'true',
            closeButton: 'true',
            url: 'index.php?controller=modal&action=usersImport',
            width: 420,
            height: 240,
            buttons: {
                'Import': function (win) {
                    let form = win.getModalContentBlock().find('form');
                    let file = $('#file');
                    if (file.val().length !== 0) {
                        form.submit();
                    } else {
                        $('#users-import-block').removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Files are missing'),
                            {type: 'warning', position: 'top'});
                        file.addClass('error');
                    }
                }, 'Close': function (win) {
                    win.closeModal();
                }
            }
        });
    });

    $('.ajax-set-user-status').change(function () {
        $(this).accountSetStatus();
    });

    $('.ajax-set-user-mfa').change(function () {
        $(this).accountSetMFA();
    })

    $('.select-all').click(function () {
        $(this).parent().parent('form').find('input[type=checkbox].select-checkbox').each(function () {
            this.checked = true;
        });
    });

    $('.unselect-all').click(function () {
        $(this).parent().parent('form').find('input[type=checkbox].select-checkbox').each(function () {
            this.checked = false;
        });
    });

    $.fn.dataTableExt.oStdClasses.sWrapper = 'no-margin last-child';
    $.fn.dataTableExt.oStdClasses.sInfo = 'message no-margin table-message';
    $.fn.dataTableExt.oStdClasses.sLength = 'float-left';
    $.fn.dataTableExt.oStdClasses.sFilter = 'float-right';
    $.fn.dataTableExt.oStdClasses.sPaging = 'sub-hover paging_';
    $.fn.dataTableExt.oStdClasses.sPagePrevEnabled = 'control-prev';
    $.fn.dataTableExt.oStdClasses.sPagePrevDisabled = 'control-prev disabled';
    $.fn.dataTableExt.oStdClasses.sPageNextEnabled = 'control-next';
    $.fn.dataTableExt.oStdClasses.sPageNextDisabled = 'control-next disabled';
    $.fn.dataTableExt.oStdClasses.sPageFirst = 'control-first';
    $.fn.dataTableExt.oStdClasses.sPagePrevious = 'control-prev';
    $.fn.dataTableExt.oStdClasses.sPageNext = 'control-next';
    $.fn.dataTableExt.oStdClasses.sPageLast = 'control-last';

// Apply to table
    $('.sortable').each(function () {
        let table = $(this),
            oTable = table.dataTable({
                bDestroy: true,
                aoColumns: [
                    {bSortable: false},
                    {bSortable: false},
                    {bSortable: false},
                    {sType: 'numeric'},
                    {sType: 'string'},
                    {sType: 'string'},
                    {sType: 'string'},
                    {sType: 'string'},
                    {sType: 'string'},
                    {bSortable: false}
                ],

                sDom: '<\"block-controls\"<\"controls-buttons\"p>>rti<\"block-footer clearfix\"lf>',

                language: {
                    "paginate": {
                        "previous": tjs.get("control-prev"),
                        "next": tjs.get("control-next"),
                        "last": tjs.get("Last page"),
                        "first": tjs.get("First page"),
                        "search": tjs.get("Search"),
                        "info": tjs.get("Showing _START_ to _END_ of _TOTAL_ entries"),
                        "sInfoEmpty": tjs.get("Showing 0 to 0 of 0 entries"),
                        "sLengthMenu": tjs.get("Show _MENU_ entries")
                    }
                },

                fnDrawCallback: function () {
                    this.parent().applyTemplateSetup();
                },
                fnInitComplete: function () {
                    this.parent().applyTemplateSetup();
                }
            });

        table.find('thead .sort-up').click(function (event) {
            event.preventDefault();
            let column = $(this).closest('th'),
                columnIndex = column.parent().children().index(column.get(0));
            oTable.fnSort([[columnIndex, 'asc']]);
            return false;
        });

        table.find('thead .sort-down').click(function (event) {
            event.preventDefault();
            let column = $(this).closest('th'),
                columnIndex = column.parent().children().index(column.get(0));
            oTable.fnSort([[columnIndex, 'desc']]);
            return false;
        });
    });
});