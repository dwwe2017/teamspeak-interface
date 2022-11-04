$(document).ready(function () {
    let cid_channelEdit = source.cid_channelEdit;
    let path_chatlog_channelEdit = source.path_chatlog_channelEdit;

    parent.$('#submitBtn').enableBt();
    parent.$('#resetBtn').enableBt();

    $('#icon_id').serverIconsGet();

    let ajax_channel_chat_el = $('#ajax-channel-chat');
    let ajax_channel_chat_auto_refresh_el = $('#ajax-chat-auto-refresh');

    $('#ajax-send-chat-message').click(function (event) {
        event.preventDefault();

        function notifyTextMsg(options, again = '1') {
            $('#tab-channel-chat').serverNotifyTextMsg(options, function () {
                reloadChannelChatLog();

                if (again === '1') {
                    setTimeout(function () {
                        notifyTextMsg(options, again);
                    }, 500);
                }
            });
        }

        let options = {
            id: id,
            sid: sid,
            cid: cid_channelEdit,
            message: $('#ajax-chat-message').val()
        };

        $('#tab-channel-chat').channelMsgSend(options, function () {
            let msg = this.msg;
            $('#ajax-chat-message').val('');
            let chat = ajax_channel_chat_el.html();
            ajax_channel_chat_el.html(chat + tiny(msg) + '<br/>');
            ajax_channel_chat_el.parent().animate({scrollTop: ajax_channel_chat_el.height()}, 2000);

            if (!this.cbstatus) {
                ajax_channel_chat_auto_refresh_el.prop('disabled', true);
            }

            if (ajax_channel_chat_auto_refresh_el.prop('disabled')) {
                setTimeout(function () {
                    ajax_channel_chat_auto_refresh_el.prop('checked', true).prop('disabled', false);
                    reloadChannelChatLog();
                    notifyTextMsg({
                        id: id,
                        sid: sid
                    });
                }, 500);
            }
        });
    });

    $('#cache-update-channel-current').click(function () {
        let cid = $(this).attr('data-cid');
        $('#tsi-viewer-block').find('li.tsv-node[data-id=' + cid + ']').children(":first").dblclick();
    });

    function reloadChannelChatLog() {
        $.ajax({
            url: 'index.php?controller=ajax&action=fetchChatLog&path=' + encodeURIComponent(path_chatlog_channelEdit),
            contentType: 'application/json',
            dataType: 'text',
            success: function (res) {
                let {result} = JSON.parse(res);
                let {data = ""} = result;
                ajax_channel_chat_el.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function () {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_channel_chat_el.parent().animate({scrollTop: ajax_channel_chat_el.height()}, 2000);

        let ar = ajax_channel_chat_auto_refresh_el;
        if (ar.prop('checked') && !ar.prop('disabled')) {
            setTimeout(function () {
                reloadChannelChatLog();
            }, 2000);
        }
    }

    ajax_channel_chat_auto_refresh_el.click(function (event) {
        event.preventDefault();
        if (!$(this).prop('disabled')) {
            if ($(this).prop('checked')) {
                $(this).prop('checked', false);
            } else {
                $(this).prop('checked', true);
                reloadChannelChatLog();
            }
        }
    });

    $('.ajax-refresh-chat').click(function (event) {
        event.preventDefault();

        $.ajax({
            url: 'index.php?controller=ajax&action=fetchChatLog&path=' + encodeURIComponent(path_chatlog_channelEdit),
            contentType: 'application/json',
            dataType: 'text',
            success: function (res) {
                let {result} = JSON.parse(res);
                let {data = ""} = result;
                ajax_channel_chat_el.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function () {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_channel_chat_el.parent().animate({scrollTop: ajax_channel_chat_el.height()}, 2000);
    });

    $('.ajax-delete-chat:first').click(function (event) {

        event.preventDefault();

        let options = {
            id: id,
            sid: sid,
            cid: cid_channelEdit
        };

        $('#tab-channel-chat').channelChatClear(options, function () {
            ajax_channel_chat_el.html('');
        });
    });

    $('#tab-channel-chat-2').onTabShow(function (event) {
        event.preventDefault();
        ajax_channel_chat_el.parent().animate({scrollTop: ajax_channel_chat_el.height()});
        $('.tsi-viewer-refresh').prop('disabled', true);
    });
});