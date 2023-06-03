$(document).ready(function()
{
    let cid_channelModify = source.cid_channelModify;
    let path_chatlog_channelModify = source.path_chatlog_channelModify;

    $('#icon_id').serverIconsGet();

    let ajax_auto_refresh = $('#ajax-chat-auto-refresh');
    let ajax_chat_message = $('#ajax-chat-message');
    let ajax_channel_chat = $('#ajax-channel-chat');

    $('#ajax-send-chat-message').click(function(event)
    {
        event.preventDefault();

        function notifyTextMsg(options, again = '1')
        {
            $('#tab-channel-chat').serverNotifyTextMsg(options, function()
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
            cid: cid_channelModify,
            message:  ajax_chat_message.val()
        };

        $('#tab-channel-chat').channelMsgSend(options, function()
        {
            let msg = this.msg;
            ajax_chat_message.val('');
            let chat = ajax_channel_chat.html();
            ajax_channel_chat.html(chat + tiny(msg) + '<br/>');
            ajax_channel_chat.parent().animate({scrollTop: ajax_channel_chat.height()}, 2000);

            if(!this.cbstatus)
            {
                ajax_auto_refresh.prop('disabled', true);
            }

            if(ajax_auto_refresh.prop('disabled'))
            {
                setTimeout(function()
                {
                    ajax_auto_refresh.prop('checked', true).prop('disabled', false);
                    reloadChatLog();
                    notifyTextMsg({
                        id: id,
                        sid: sid
                    });
                }, 500);
            }
        });
    });

    $('#cache-update-channel-current').click(function(event)
    {
        event.preventDefault();
        let spinner = $(this).find('img:first');

        spinner.show();
        let block = $('#channel-properties').getModalWindow();
        block.loadModalContent('index.php?controller=modal&action=channelModify&id=' + sid + '&sid=' + sid + '&cid=' + cid_channelModify + '&content=real-time', function(){
            spinner.hide();
        });
    });

    function reloadChatLog()
    {
        $.ajax({
            url : path_chatlog_channelModify,
            contentType: 'application/json',
            dataType: 'text',
            success : function (data) {
                ajax_channel_chat.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function() {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_channel_chat.parent().animate({scrollTop: ajax_channel_chat.height()}, 2000);

        let ar = ajax_auto_refresh;
        if(ar.prop('checked') && !ar.prop('disabled'))
        {
            setTimeout(function(){
                reloadChatLog();
            }, 2000);
        }
    }

    ajax_auto_refresh.click(function(event)
    {
        event.preventDefault();
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
            url : path_chatlog_channelModify,
            dataType: 'text',
            success : function (data) {
                ajax_channel_chat.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function() {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_channel_chat.parent().animate({scrollTop: ajax_channel_chat.height()}, 2000);
    });

    $('.ajax-delete-chat:first').click(function(event)
    {
        event.preventDefault();

        let ajax_channel_chat = $('#ajax-channel-chat');

        let options = {
            id: id,
            sid: sid,
            cid: cid_channelModify
        };

        $('#tab-channel-chat').channelChatClear(options, function(){
            ajax_channel_chat.html('');
        });
    });

    $('#tab-channel-chat-2').onTabShow(function(event)
    {
        event.preventDefault();

        let ajax_channel_chat = $('#ajax-channel-chat');

        ajax_channel_chat.parent().animate({scrollTop: ajax_channel_chat.height()});

        $('.tsi-viewer-refresh').prop('disabled', true);
    });
});