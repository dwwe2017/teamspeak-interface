$(document).ready(function () {
    let path_chatlog_serverEdit = source.path_chatlog_serverEdit;

    parent.$('#submitBtn').enableBt();
    parent.$('#resetBtn').enableBt();

    jscolor.installByClassName("jscolor");

    $('#icon_id').serverIconsGet();

    $('#cronosize_status').change(function () {
        let cronosize_options_menu = $('#cronosize_options_menu');
        let virtualserver_hostbanner_gfx_interval = $('#virtualserver_hostbanner_gfx_interval');

        if ($(this).prop("checked")) {
            cronosize_options_menu.fadeIn("slow");

            if (virtualserver_hostbanner_gfx_interval.val() < 60) {
                virtualserver_hostbanner_gfx_interval.val("60");
                virtualserver_hostbanner_gfx_interval.showTip({
                    content: tjs.get("The option has been optimized to keep the clock updated every minute in the client."),
                    delay: 60,
                    onHover: false,
                    position: "right"
                });

                virtualserver_hostbanner_gfx_interval.change(function () {
                    $(this).hideTip();
                });
            }
        } else {
            virtualserver_hostbanner_gfx_interval.hideTip();
            cronosize_options_menu.fadeOut("slow");
        }
    });

    let ajax_server_chat_el = $('#ajax-server-chat');
    let ajax_server_chat_refresh_el = $('#ajax-chat-auto-refresh');

    $('#ajax-send-chat-message').click(function (event) {
        event.preventDefault();

        function notifyTextMsg(options, again = '1') {
            $('#tab-server-chat').serverNotifyTextMsg(options, function () {
                reloadChatLog();

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
            message: $('#ajax-chat-message').val()
        };

        $('#tab-server-chat').serverMsgSend(options, function () {
            let msg = this.msg;

            $('#ajax-chat-message').val('');
            let chat = ajax_server_chat_el.html();
            ajax_server_chat_el.html(chat + tiny(msg) + '<br/>');
            ajax_server_chat_el.parent().animate({scrollTop: ajax_server_chat_el.height()}, 2000);

            if (!this.cbstatus) {
                ajax_server_chat_refresh_el.prop('disabled', true);
            }

            if (ajax_server_chat_refresh_el.prop('disabled')) {
                setTimeout(function () {
                    ajax_server_chat_refresh_el.prop('checked', true).prop('disabled', false);
                    reloadChatLog();
                    notifyTextMsg({
                        id: id,
                        sid: sid
                    });
                }, 500);
            }
        });
    });

    //Get and load server config
    $('#cache-update-virtualserver-current').click(function (event) {
        event.preventDefault();
        $('#tsi-viewer-block').find('.tsv-node.server').children(":first").click();
    });

    function reloadChatLog() {
        $.ajax({
            url: 'index.php?controller=ajax&action=fetchChatLog&path=' + encodeURIComponent(path_chatlog_serverEdit),
            contentType: 'application/json',
            dataType: 'text',
            success: function (res) {
                let {result} = JSON.parse(res);
                let {data = ""} = result;
                ajax_server_chat_el.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function () {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_server_chat_el.parent().animate({scrollTop: ajax_server_chat_el.height()}, 2000);

        let ar = ajax_server_chat_refresh_el;
        if (ar.prop('checked') && !ar.prop('disabled')) {
            setTimeout(function () {
                reloadChatLog();
            }, 2000);
        }
    }

    ajax_server_chat_refresh_el.click(function (event) {
        event.preventDefault();
        if (!$(this).prop('disabled')) {
            if ($(this).prop('checked')) {
                $(this).prop('checked', false);
            } else {
                $(this).prop('checked', true);
                reloadChatLog();
            }
        }
    });

    $('.ajax-refresh-chat').click(function (event) {
        event.preventDefault();

        $.ajax({
            url: 'index.php?controller=ajax&action=fetchChatLog&path=' + encodeURIComponent(path_chatlog_serverEdit),
            contentType: 'application/json',
            dataType: 'text',
            success: function (res) {
                let {result} = JSON.parse(res);
                let {data = ""} = result;
                ajax_server_chat_el.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function () {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_server_chat_el.parent().animate({scrollTop: ajax_server_chat_el.height()}, 2000);
    });

    $('.ajax-delete-chat:first').click(function (event) {

        event.preventDefault();

        let options = {
            id: id,
            sid: sid,
        };

        $('#tab-server-chat').serverChatClear(options, function () {
            ajax_server_chat_el.html('');
        });
    });

    $('#tab-server-chat-2').onTabShow(function (event) {
        event.preventDefault();
        ajax_server_chat_el.parent().animate({scrollTop: ajax_server_chat_el.height()});
        $('.tsi-viewer-refresh').prop('disabled', true);
    });

    $('.ajax-virtual-server-tpl-create-from-config').click(function (event) {
        event.preventDefault();
        $('#ajax-handle-properties').serverTplCreateFromConfig({'id': id, 'sid': sid});
    });
});