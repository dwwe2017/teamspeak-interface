$(document).ready(function()
{
    let cldbid_clientModify = source.cldbid_clientModify;
    let path_chatlog_clientModify = source.path_chatlog_clientModify;

    let channelgroups = $('#channelGroupList');
    let ajax_private_chat_el = $('#ajax-private-chat');
    let ajax_chat_message_el = $('#ajax-chat-message');
    let ajax_auto_refesh_el = $('#ajax-chat-auto-refresh');

    if(channelgroups)
    {
        channelgroups.change(function(event)
        {
            let cid = $(this).val();

            let target = $('#ajax-client-channel-assignements');

            let url = 'index.php?controller=ajax&action=cgByChannelId';

            if (event.originalEvent !== undefined){
                url = url + '&content=real-time';
            }

            target.loadWithEffect(url, { 'id': id, 'sid': sid, 'cid': cid, 'cldbid': cldbid_clientModify}, function()
            {
                $(this).applyTemplateSetup();
            });

        }).trigger('change');
    }

    $('.ajax-modify-servergroup').change(function(event){

        event.preventDefault();

        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientModify,
            sgid: $(this).attr('id')
        };

        if(!$(this).prop('checked'))
        {
            $(this).clientSgRem(options, function(){
                $(this).parent().css({ 'border-width': '0' });
            });
        }
        else
        {
            $(this).clientSgAdd(options, function(){
                $(this).parent().css({ 'border-color': '#3399CC', 'border-style': 'solid', 'border-width': '2px' });
            });
        }

    });

    $('#ajax-private-chat-form').submit(function(event)
    {
        event.preventDefault();

        function notifyTextMsg(options, again = '1')
        {
            $('#tab-client-private-chat').serverNotifyTextMsg(options, function()
            {
                reloadChatLog();

                if(again === '1'){
                    setTimeout(function(){
                        notifyTextMsg(options, again);
                    }, 500);
                }
            });
        }

        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientModify,
            message:  ajax_chat_message_el.val()
        };

        $('#tab-client-private-chat').clientPrivMsgSend(options, function()
        {
            let msg = this.msg;
            ajax_chat_message_el.val('');
            let chat = ajax_private_chat_el.html();
            ajax_private_chat_el.html(chat + tiny(msg) + '<br/>');
            ajax_private_chat_el.parent().animate({scrollTop: ajax_private_chat_el.height()}, 2000);

            if(!this.cbstatus){
                ajax_auto_refesh_el.prop('disabled', true);
            }

            if(ajax_auto_refesh_el.prop('disabled'))
            {
                setTimeout(function()
                {
                    ajax_auto_refesh_el.prop('checked', true).prop('disabled', false);
                    reloadChatLog();
                    notifyTextMsg({
                        id: id,
                        sid: sid
                    });
                }, 500);
            }
        });
    });

    $('#cache-update-client-current').click(function(event)
    {
        event.preventDefault();
        let spinner = $(this).find('img:first');

        spinner.show();
        let block = $('#client-properties').getModalWindow();
        block.loadModalContent('index.php?controller=modal&action=clientModify&id=' + id + '&sid=' + sid + '&cldbid=' + cldbid_clientModify + '&content=real-time', function(){
            spinner.hide();
        });
    });

    function reloadChatLog()
    {
        $.ajax({
            url : path_chatlog_clientModify,
            contentType: 'application/json',
            dataType: 'text',
            success : function (data) {
                ajax_private_chat_el.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function() {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_private_chat_el.parent().animate({scrollTop: ajax_private_chat_el.height()}, 2000);

        let ar = ajax_auto_refesh_el;
        if(ar.prop('checked') && !ar.prop('disabled'))
        {
            setTimeout(function(){
                reloadChatLog();
            }, 2000);
        }
    }

    ajax_auto_refesh_el.click(function()
    {
        if(!$(this).prop('disabled'))
        {
            if($(this).prop('checked')) {
                $(this).prop('checked', false);
            } else {
                $(this).prop('checked', true);
                reloadChatLog();
            }
        }
    });

    $('.ajax-refresh-chat').click(function(event)
    {
        event.preventDefault();

        $.ajax({
            url : path_chatlog_clientModify,
            dataType: 'text',
            success : function (data) {
                ajax_private_chat_el.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function() {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_private_chat_el.parent().animate({scrollTop: ajax_private_chat_el.height()}, 2000);
    });

    $('.ajax-delete-chat:first').click(function(event){

        event.preventDefault();

        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientModify
        };

        $('#tab-client-private-chat').clientChatClear(options, function(){
            ajax_private_chat_el.html('');
        });
    });

    $('#tab-client-private-chat-2').onTabShow(function(event)
    {
        event.preventDefault();
        ajax_private_chat_el.parent().animate({scrollTop: ajax_private_chat_el.height()});
        $('.tsi-viewer-refresh').prop('disabled', true);
    });
});