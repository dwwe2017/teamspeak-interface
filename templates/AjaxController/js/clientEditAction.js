$.fn.ajaxBotQueueSongRemove = function () {
    let cldbid_clientEdit = source.cldbid_clientEdit;

    this.click(function (event) {
        event.preventDefault();

        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientEdit,
            loader: $(this).find('img').attr('src')
        };

        $(this).find('img').attr('src', 'images/arbo-loader.gif');
        $(this).musicBotQueueRem(options, function () {
            $(this).parent().parent().fadeOut('slow');
        });
    });
};

$.fn.ajaxBotQueueAdd = function () {
    let cldbid_clientEdit = source.cldbid_clientEdit;

    this.click(function (event) {
        event.preventDefault();

        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientEdit
        };

        $(this).musicBotQueueAdd(options, function () {
            let res = $(this);
            res.prev('input').val('');
            setTimeout(function () {
                res.parent().parent().prev('fieldset').children('ul')
                    .find('.ajax-bot-player-console[data-action=refresh]').trigger('click');
            }, 2500);
        });
    });
};

$.fn.ajaxBotQueueAddAgain = function () {
    let cldbid_clientEdit = source.cldbid_clientEdit;

    this.click(function (event) {
        event.preventDefault();

        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientEdit,
            media: $(this).attr('id'),
            loader: $(this).find('img').attr('src')
        };

        $(this).find('img').attr('src', 'images/arbo-loader.gif');
        $(this).musicBotQueueAdd(options, function () {
            let res = $(this);
            setTimeout(function () {
                res.parent().parent().parent().prev('fieldset').find('#bot-player-queue-empty').hide();
                res.parent().parent().parent().parent().prev('fieldset').prev('fieldset').prev('fieldset').children('ul')
                    .find('.ajax-bot-player-console[data-action=refresh]').trigger('click');
            }, 2500);
        });
    });
};

$(document).ready(function () {
    let cldbid_clientEdit = source.cldbid_clientEdit;
    let path_chatlog_clientEdit = source.path_chatlog_clientEdit;

    function prefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }

    function playTime() {
        setTimeout(function () {
            let element = $('#bot-player-time-current').children('strong');

            if ($('#bot-player-song-current').attr('data-state') === '0') {
                return true;
            }

            let parts = element.html().split('/');
            let offset = parts[0];
            let limit = parts[1];

            if (offset >= limit) {
                if (limit !== '00:00:00') {
                    $(document).find('.ajax-bot-player-console[data-action=refresh]:first').trigger('click');
                    return true;
                }
            }

            let offsplits = offset.split(':');
            let hours = offsplits[0];
            let minutes = offsplits[1];
            let seconds = offsplits[2];

            if (seconds < 59) {
                seconds++;
            } else if (minutes < 59) {
                seconds = 0;
                minutes++;
            } else {
                seconds = 0;
                minutes = 0;
                hours++;
            }

            element.html(prefixInteger(hours, 2) + ':' + prefixInteger(minutes, 2) + ':' + prefixInteger(seconds, 2) + '/' + limit);

            playTime();

        }, 1000);
    }

    parent.$('#submitBtn').disableBt();
    parent.$('#resetBtn').disableBt();

    $(this).find('#ajax-bot-queue-add').ajaxBotQueueAdd();
    $(this).find('.ajax-bot-queue-add-again').ajaxBotQueueAddAgain();
    $(this).find('.ajax-bot-queue-song-remove').ajaxBotQueueSongRemove();

    $('.ajax-bot-player-console').click(function (event) {
        event.preventDefault();

        let block = $(this);
        let silbling = block.parent().parent().parent();

        if ($(this).attr('data-action') === 'refresh') {
            $('#bot-player-song-current').attr('data-state', '0');
            $('#bot-player-time-current').children('strong')
                .html('<img src=\"images/arbo-loader.gif\" style=\"width: 14px; height: 14px; vertical-align: middle;\"> Loading...');
        }

        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientEdit
        };

        $(this).musicBotPlayerAction(options, function () {
            let response = this.response;
            let current = response.current;
            let action = current.action;
            let state = current.state;
            let queue = response.queue;
            let played = response.played;

            if (action === '0' && state !== 0) //stop
            {
                $('#bot-player-play').show();
                $('#bot-player-pause').hide();
                $('#bot-player-time-current').children('strong').html('00:00:00/00:00:00');

                setTimeout(function () {
                    silbling.find('.ajax-bot-player-console[data-action=refresh]').trigger('click');
                }, 2500);
            } else if (action === '2' && state !== 0) //pause
            {
                $('#bot-player-play').show();
                $('#bot-player-pause').hide();
                $('#bot-player-song-current').attr('data-state', '0');

                setTimeout(function () {
                    silbling.find('.ajax-bot-player-console[data-action=refresh]').trigger('click');
                }, 2500);
            } else if (action === '1' && state !== 0) //play
            {
                $('#bot-player-play').hide();
                $('#bot-player-pause').show();
                $('#bot-player-song-current').attr('data-state', '1');

                setTimeout(function () {
                    silbling.find('.ajax-bot-player-console[data-action=refresh]').trigger('click');
                }, 2500);
            } else if (action === '3' && state !== 0) {
                setTimeout(function () {
                    silbling.find('.ajax-bot-player-console[data-action=refresh]').trigger('click');
                }, 2500);
            } else if (action === '4') {
                setTimeout(function () {
                    silbling.find('.ajax-bot-player-console[data-action=refresh]').trigger('click');
                }, 2500);
            } else if (action === 'refresh') {
                let bot_player_song_current_el = $('#bot-player-song-current');
                let bot_player_play_el = $('#bot-player-play');
                let bot_player_pause_el = $('#bot-player-pause');

                if (current.state && current.state !== '') {
                    switch (current.state) {
                        case 0:
                            bot_player_play_el.show();
                            bot_player_pause_el.hide();
                            bot_player_song_current_el.attr('data-state', '0');
                            break;
                        case 1:
                            bot_player_play_el.show();
                            bot_player_pause_el.hide();
                            bot_player_song_current_el.attr('data-state', '0');
                            break;
                        case 2:
                            bot_player_play_el.hide();
                            bot_player_pause_el.show();
                            bot_player_song_current_el.attr('data-state', '1');
                            break;
                        case 3:
                            bot_player_play_el.show();
                            bot_player_pause_el.hide();
                            bot_player_song_current_el.attr('data-state', '0');
                            break;
                        case 4:
                            bot_player_play_el.show();
                            bot_player_pause_el.hide();
                            bot_player_song_current_el.attr('data-state', '0');
                            //$('#bot-player-time-current').children('strong').html('00:00:00/00:00:00');
                            break;
                    }
                }

                if (current.title && current.title !== '') {
                    bot_player_song_current_el.html(current.title);
                } else {
                    bot_player_song_current_el.attr('data-state', '0');
                    bot_player_song_current_el.html(tjs.get('No title selected'));
                    $('#bot-player-queue-empty').show();
                }

                if (current.replay && current.max) {
                    $('#bot-player-time-current').children('strong').html(current.replay + '/' + current.max);
                    playTime();
                }

                if (queue) {
                    let ul = silbling.next('fieldset').next('fieldset').children('ul');
                    ul.html('');
                    $.each(queue, function (i, val) {
                        ul.append(val).find('.ajax-bot-queue-song-remove:visible:last').ajaxBotQueueSongRemove();
                    });
                } else {
                    let ul = silbling.next('fieldset').next('fieldset').children('ul');
                    ul.html('<li class=\"icon-error\"><span>' + tjs.get("No songs in the queue") + '</span></li>')
                }

                if (played) {
                    let ul = silbling.next('fieldset').next('fieldset').next('fieldset').children('ul');
                    ul.html('');
                    $.each(played, function (i, val) {
                        ul.append(val).find('.ajax-bot-queue-add-again:visible:last').ajaxBotQueueAddAgain();
                    });
                } else {
                    let ul = silbling.next('fieldset').next('fieldset').next('fieldset').children('ul');
                    ul.html('<li class=\"icon-error\"><span>' + tjs.get("No songs found") + '</span></li>')
                }
            } else {
                setTimeout(function () {
                    silbling.find('.ajax-bot-player-console[data-action=refresh]').trigger('click');
                }, 2500);
            }
        });
    });

    $('#cache-update-client-current').click(function () {
        let cldbid = $(this).attr('data-cldbid');
        $('#tsi-viewer-block').find('li.tsv-node.client[data-cldbid=' + cldbid + ']').children(":first").dblclick();
    });

    let channelgroup_list_el = $('#channelGroupList');

    if (channelgroup_list_el) {
        channelgroup_list_el.change(function (event) {
            let cid = $(this).val();
            let target = $('#ajax-client-channel-assignements');
            let url = 'index.php?controller=ajax&action=cgByChannelId';

            if (event.originalEvent !== undefined) {
                url = url + '&content=real-time';
            }

            target.loadWithEffect(url, {'id': id, 'sid': sid, 'cid': cid, 'cldbid': cldbid_clientEdit}, function () {
                $(this).applyTemplateSetup();
            });

        }).trigger('change');
    }

    $('.ajax-modify-servergroup').change(function (event) {
        event.preventDefault();

        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientEdit,
            sgid: $(this).attr('id')
        };

        if (!$(this).prop('checked')) {
            $(this).clientSgRem(options, function () {
                $(this).parent().css({'border-width': '0'});
                if (parent.$('#ajax-auto-refresh').prop('checked')) {
                    parent.$('.tsi-viewer-refresh:first').click();
                }
            });
        } else {
            $(this).clientSgAdd(options, function () {
                $(this).parent().css({'border-color': '#3399CC', 'border-style': 'solid', 'border-width': '2px'});
                if (parent.$('#ajax-auto-refresh').prop('checked')) {
                    parent.$('.tsi-viewer-refresh:first').click();
                }
            });
        }
    });

    $('.ajax-modify-channelgroup').change(function (event) {
        event.preventDefault();

        let cgid = $(this).attr('id');
        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientEdit,
            cid: 0,
            cgid: cgid
        };

        $(this).clientCgSet(options, function () {
            let i = 0;
            $(this).parent().parent().find('p').each(function () {
                let checkbox = $(this).children('input[type=checkbox]:checked');
                if (checkbox && checkbox.attr('id') !== cgid) {
                    checkbox.prop('checked', false);
                    checkbox.prop('disabled', false);
                    checkbox.parent().css({'border-width': '0'});
                    i++;
                }
            });

            $(this).prop('disabled', true);
            $(this).parent().css({'border-color': '#3399CC', 'border-style': 'solid', 'border-width': '2px'});

            if (parent.$('#ajax-auto-refresh').prop('checked')) {
                parent.$('.tsi-viewer-refresh:first').click();
            }
        });
    });

    let ajax_private_chat_el = $('#ajax-private-chat');
    let ajax_private_chat_auto_refresh_el = $('#ajax-private-chat-auto-refresh');

    $('#ajax-private-chat-form').submit(function (event) {
        event.preventDefault();

        function notifyTextMsg(options, again = '1') {
            $('#tab-client-private-chat').serverNotifyTextMsg(options, function () {
                reloadPrivateChatLog();

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
            cldbid: cldbid_clientEdit,
            message: $('#ajax-private-chat-message').val()
        };

        $('#tab-client-private-chat').clientPrivMsgSend(options, function () {
            let msg = this.msg;
            $('#ajax-private-chat-message').val('');
            let chat = ajax_private_chat_el.html();
            ajax_private_chat_el.html(chat + tiny(msg) + '<br/>');
            ajax_private_chat_el.parent().animate({scrollTop: ajax_private_chat_el.height()}, 2000);

            if (!this.cbstatus) {
                ajax_private_chat_auto_refresh_el.prop('disabled', true);
            }

            if (ajax_private_chat_auto_refresh_el.prop('disabled')) {
                setTimeout(function () {
                    ajax_private_chat_auto_refresh_el.prop('checked', true).prop('disabled', false);
                    reloadPrivateChatLog();
                    notifyTextMsg({
                        id: id,
                        sid: sid
                    });
                }, 500);
            }
        });
    });

    function reloadPrivateChatLog() {
        $.ajax({
            url: 'index.php?controller=ajax&action=fetchChatLog&path=' + encodeURIComponent(path_chatlog_clientEdit),
            contentType: 'application/json',
            dataType: 'text',
            success: function (res) {
                let {result} = JSON.parse(res);
                let {data = ""} = result;
                ajax_private_chat_el.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function () {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_private_chat_el.parent().animate({scrollTop: ajax_private_chat_el.height()}, 2000);

        let ar = ajax_private_chat_auto_refresh_el;
        if (ar.prop('checked') && !ar.prop('disabled')) {
            setTimeout(function () {
                reloadPrivateChatLog();
            }, 2000);
        }
    }

    ajax_private_chat_auto_refresh_el.click(function (event) {
        event.preventDefault();
        if (!$(this).prop('disabled')) {
            if ($(this).prop('checked')) {
                $(this).prop('checked', false);
            } else {
                $(this).prop('checked', true);
                reloadPrivateChatLog();
            }
        }
    });

    $('.ajax-refresh-chat').click(function (event) {
        event.preventDefault();

        $.ajax({
            url: 'index.php?controller=ajax&action=fetchChatLog&path=' + encodeURIComponent(path_chatlog_clientEdit),
            contentType: 'application/json',
            dataType: 'text',
            success: function (res) {
                let {result} = JSON.parse(res);
                let {data = ""} = result;
                ajax_private_chat_el.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function () {
                $('#ajax-chat-loader').hide();
            }
        });

        $('#ajax-chat-loader').show();
        ajax_private_chat_el.parent().animate({scrollTop: ajax_private_chat_el.height()}, 2000);
    });

    $('.ajax-delete-chat:first').click(function (event) {

        event.preventDefault();

        let options = {
            id: id,
            sid: sid,
            cldbid: cldbid_clientEdit
        };

        $('#tab-client-private-chat').clientChatClear(options, function () {
            ajax_private_chat_el.html('');
        });
    });

    $('#tab-client-private-chat-2').onTabShow(function (event) {
        event.preventDefault();
        ajax_private_chat_el.parent().animate({scrollTop: ajax_private_chat_el.height()});
        $('.tsi-viewer-refresh').prop('disabled', true);
    });
});