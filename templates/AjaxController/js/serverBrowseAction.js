$(document).ready(function()
{
    let channel_el = $('.channel');

    channel_el.droppable(
        {
        accept: 'a.ts-file',
        over: function() {
            $(this).parent('a').addClass('current');
        },
        out: function() {
            $(this).parent('a').removeClass('current');
        },
        drop: function(event, ui) {
            $(this).parent('a').removeClass('current');
            let item = ui.draggable;
            let fkey = item.attr('id');
            let fcid = item.attr('data-cid');
            let tcid = $(this).parent('a').attr('id');

            let options = { 'id': id, 'sid': sid, 'cid': fcid, 'fkey': fkey, 'tcid': tcid };

            $('#tsi-file-browser-block').fileRename(options, function()
            {
                let folder_file_browser_block_el = $('#tsi-file-browser-block');
                let folder = folder_file_browser_block_el.find('a[id=' + tcid + ']').children('span');

                if(!folder.children('b').length)
                {
                    folder.wrapInner('<b></b>');
                }

                folder = folder_file_browser_block_el.find('a[id=' + fcid + ']').children('span');

                let tsi_files_el = $('#tsi-files');
                let fcount = --(tsi_files_el.find('li:visible').length);
                if(fcount < 1)
                {
                    folder.children('b').contents().unwrap();
                }

                folder = tsi_files_el.find('a[id="' + fkey + '"]').parent('li');

                $('#message-files-found').children('li').html(fcount + tjs.get(' files found'));
                folder.animate({
                    opacity: 0, // animate slideUp
                    marginLeft: '-200px'
                }, 'slow', 'linear', function() {
                    $(this).remove();
                });

                tsi_files_el.find('a.ts-file').each(function(){
                    let cfkey = parseInt($(this).attr('id'));
                    if(cfkey>fkey){
                        $(this).attr('id',(cfkey-1));
                    }
                });
            });
        }
    });

    channel_el.click(function(event)
    {
        let cid = $(this).parent().attr('id');
        let fileWin = $(this).parents('.content-left').next().find('#tsiChannelFiles');

        let target = 'index.php?controller=ajax&action=channelBrowse';

        if (event.originalEvent !== undefined)
        {
            target = target + '&content=real-time';
        }

        fileWin.loadWithEffect(target,
            { 'id': id, 'sid': sid, 'cid': cid }, function(){
                $(this).applyTemplateSetup();
            });
    });

    $('.channel:first').click();
});