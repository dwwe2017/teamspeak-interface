$(document).ready(function()
{
    let img_path_cgPermsByCat = source.img_path_cgPermsByCat;
    let cgid_cgPermsByCat = source.cgid_cgPermsByCat;

    let icon_id_el = $('#icon_id');

    let hasIcon = icon_id_el.length > 0;

    if(hasIcon)
    {
        icon_id_el.serverIconsGet();
    }

    $('.sg-set-perm').click(function(event){

        event.preventDefault();

        let block = $(this).parent().parent().parent()
            .parent().parent().parent().parent().parent()
            .parent().parent().parent().parent().parent()
            .parent().parent().parent();

        let src = $(this).children().find('img').attr('src');

        let options = {
            id: id,
            sid: sid,
            cgid: cgid_cgPermsByCat,
            block: block
        };

        if(src === img_path_cgPermsByCat + '/16/add2.png')
        {
            $(this).cgPermAdd(options, function(){
                    $(this).children().find('img').attr('src', img_path_cgPermsByCat + '/16/substract.png');
                    $(this).updateTipContent(tjs.get('Remove permission'));
                    $(this).parent().parent('tr').css('opacity', 1).find('td').each(function()
                    {
                        $(this).find('.status:first').val('1');
                        $(this).find('input, select').prop('disabled', false);
                        if(hasIcon){ icon_id_el.msDropDown().data('dd').set('disabled', false); }
                    });
                });
        }
        else
        {
            $(this).cgPermRem(options, function(){
                    $(this).children().find('img').attr('src', img_path_cgPermsByCat + '/16/add2.png');
                    $(this).updateTipContent(tjs.get('Add permission'));
                    $(this).parent().parent('tr').css('opacity', 0.5).find('td').each(function()
                    {
                        $(this).find('.status:first').val('0');
                        $(this).find('input, select').prop('disabled', true);
                        if(hasIcon){ icon_id_el.msDropDown().data('dd').set('disabled', false); }
                    });
                });
        }
    });

    $('.sg-set-alloc-perm').click(function(event){

        event.preventDefault();

        let block = $(this).parent().parent().parent()
            .parent().parent().parent().parent().parent()
            .parent().parent().parent().parent().parent()
            .parent().parent().parent().parent();

        let options = {
            id: id,
            sid: sid,
            cgid: cgid_cgPermsByCat,
            block: block
        };

        if($(this).hasClass('check-plus'))
        {
            $(this).cgPermAdd(options, function(){
                    $(this).removeClass('check-plus').addClass('check-error');
                    $(this).updateTipContent(tjs.get('Remove permission'));
                    $(this).parent().parent('td').find('input').css('opacity', 1).prop('disabled', false);
                });
        }
        else
        {
            $(this).cgPermRem(options, function(){
                    $(this).removeClass('check-error').addClass('check-plus');
                    $(this).updateTipContent(tjs.get('Add permission'));
                    $(this).parent().parent('td').find('input').css('opacity', 0.5).prop('disabled', true);
                });
        }
    });

    $('.value-all').click(function(){
        $(this).parent().parent('form').find('input[type=checkbox].permvalue').each(function () {
            this.checked = true;
        });
    });

    $('.devalue-all').click(function(){
        $(this).parent().parent('form').find('input[type=checkbox].permvalue').each(function () {
            this.checked = false;
        });
    });

    $('.negate-all').click(function(){
        $(this).parent().parent('form').find('input[type=checkbox].permnegated').each(function () {
            this.checked = true;
        });
    });

    $('.unnegate-all').click(function(){
        $(this).parent().parent('form').find('input[type=checkbox].permnegated').each(function () {
            this.checked = false;
        });
    });

    $('.skip-all').click(function(){
        $(this).parent().parent('form').find('input[type=checkbox].permskip').each(function () {
            this.checked = true;
        });
    });

    $('.unskip-all').click(function(){
        $(this).parent().parent('form').find('input[type=checkbox].permskip').each(function () {
            this.checked = false;
        });
    });

    $.fn.dataTableExt.oStdClasses.sWrapper = 'no-margin last-child';
    $.fn.dataTableExt.oStdClasses.sInfo = 'message no-margin table-message';
    $.fn.dataTableExt.oStdClasses.sLength = 'float-left display-none';
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
    $('.sortable').each(function()
    {
        // DataTable config
        let table = $(this),
            oTable = table.dataTable({
                bDestroy: true,
                aoColumns: [
                    { sType: 'numeric' },
                    { sType: 'string' },
                    { sType: 'string' },
                    { bSortable: false },
                    { bSortable: false },
                    { bSortable: false }
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

                fnDrawCallback: function()
                {
                    this.parent().applyTemplateSetup();
                },
                fnInitComplete: function()
                {
                    this.parent().applyTemplateSetup();
                }
            });

        table.find('thead .sort-up').click(function(event)
        {
            event.preventDefault();
            let column = $(this).closest('th'),
                columnIndex = column.parent().children().index(column.get(0));
            oTable.fnSort([[columnIndex, 'asc']]);
            return false;
        });

        table.find('thead .sort-down').click(function(event)
        {
            event.preventDefault();
            let column = $(this).closest('th'),
                columnIndex = column.parent().children().index(column.get(0));
            oTable.fnSort([[columnIndex, 'desc']]);
            return false;
        });
    });

});