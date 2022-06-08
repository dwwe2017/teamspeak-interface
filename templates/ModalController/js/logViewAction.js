$(document).ready(function () {

    $.fn.dataTableExt.oStdClasses.sWrapper = 'no-margin last-child';
    $.fn.dataTableExt.oStdClasses.sInfo = 'message no-margin';
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

    $('.sortable-logView').each(function () {
        let table = $(this),
            oTable = table.dataTable({
                bDestroy: true,
                aoColumns: [
                    {sType: 'numeric'},	// No sorting for this columns, as it only contains checkboxes
                    {bSortable: false},	// No sorting for actions column
                    {sType: 'string'},
                    {sType: 'string'}
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