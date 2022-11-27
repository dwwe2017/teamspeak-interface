$(document).ready(function () {
    $('.ajax-remove-server-tpl').click(function (event) {
        event.preventDefault();
        $('.ajax-remove-server-tpl').hideTip();
        let options = {
            block: $('#view-server-tpl-block')
        };
        $(this).serverTplDelete(options, function () {
            $(this).parent().parent().css("opacity", "0.1").css("pointer-events", "none").fadeOut();
            setTimeout(function () {
                options.block.removeBlockMessages({except: 'table-message'});
            }, 500);
        });
    });

    $('.ajax-copy-server-tpl').click(function (event) {
        event.preventDefault();
        let options = {
            block: $('#view-server-tpl-block')
        };
        $(this).serverTplCopy(options, function () {
            setTimeout(function () {
                options.block.removeBlockMessages({except: 'table-message'});
                let block = options.block.getModalWindow();
                block.loadModalContent("index.php?controller=modal&action=serverTplList&id=" + id);
            }, 500);
        });
    });

    $('.modal-confirm-tpl').click(function (event) {
        event.preventDefault();

        let link = $(this).attr("href");

        $.modal({
            content: '<p><div class="warnings align-center"><b>' + tjs.get("Are you sure you want to create a virtual server from this template?") + '</b></div></p>',
            title: tjs.get('Confirm'),
            draggable: true,
            closeButton: false,
            maxWidth: 280,
            buttons: {
                'Continue': function () {
                    document.location.href = link;
                },
                'Close': function (win) {
                    win.closeModal();
                }
            }
        });
    });

    function modalServerTplModify(filename, id) {

        $.modal({
            title: tjs.get("Edit Template"),
            draggable: true,
            closeButton: true,
            url: "index.php?controller=modal&action=serverTplModify&id=" + id + "&filename=" + encodeURIComponent(filename),
            width: 1000,
            height: 520,
            scrolling: true,
            buttons: {
                'Save': function (win) {
                    let parent_block = parent.$("#view-server-tpl-block").getModalWindow();
                    win.getModalContentBlock().serverTplModify({'block': $('#virtualserver-tpl-modify')}, function () {
                        if (parent_block) {
                            parent_block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Refreshing list...'), {
                                type: 'loading',
                                position: 'top'
                            });
                            setTimeout(function () {
                                setTimeout(function () {
                                    parent_block.loadModalContent("index.php?controller=modal&action=serverTplList&id=" + id);
                                }, 900);
                                win.closeModal();
                            }, 100);
                        } else {
                            setTimeout(function () {
                                win.closeModal();
                            }, 100);
                        }
                    });
                },
                'Close': function (win) {
                    win.closeModal();
                }
            }
        });
    }

    $('.modal-virtual-server-tpl-edit').click(function (event) {
        event.preventDefault();
        modalServerTplModify($(this).attr("data-filename"), $(this).attr('data-id'));
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

    $('.sortable-serverTplList').each(function () {
        let table = $(this),
            oTable = table.dataTable({
                //bDestroy: true,
                bRetrieve: true,
                bAutoWidth: false,
                aoColumns: [
                    {sType: 'string', sWidth: '25%'},
                    {bSortable: 'string', sWidth: '25%'},
                    {sType: 'string', sWidth: '25%'},
                    {sType: 'number', sWidth: '15%'},
                    {bSortable: false, sWidth: '10%'}
                ],

                aLengthMenu: [
                    [10, 25, 50, 100],
                    [10, 25, 50, 100]
                ],

                sDom: '<"block-controls"<"controls-buttons"p>>rti<"block-footer clearfix"lf>',

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