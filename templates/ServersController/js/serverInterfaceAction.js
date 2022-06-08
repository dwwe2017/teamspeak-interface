/**
 *
 * @param element_id
 */
function moveUp(element_id) {
    let cid = $(element_id).attr('data-id');
    let pid = "0";
    if (!$(element_id).parent().parent().hasClass("server")) {
        pid = $(element_id).parent().parent().attr("data-id");
        pid = !pid || false || pid === "1" ? "0" : pid;
    }
    let channel_order = $(element_id).prev("li.channel, li.spacer").prev("li.channel, li.spacer").attr('data-id') || "0"
    $('#tsi-viewer-block').channelMove({
        id: id,
        sid: sid,
        cid: cid,
        pid: pid,
        order_id: channel_order,
        sortable: $(element_id)
    }, function () {
        $('#tsv-explorer').tsviewerRefresh(false);
    });
}

/**
 *
 * @param element_id
 */
function moveUpClient(element_id) {
    let prev = $(element_id).parent().parent().prev("li.channel, li.spacer");
    if (!prev.length) {
        prev = $(element_id).parent().parent().parent().parent().prev("li.channel, li.spacer");
    }
    let cid = prev.attr("data-id");
    if (cid && cid !== '0') {
        let clid = $(element_id).attr('data-id');
        $('#tsi-viewer-block').clientMove({
            id: id,
            sid: sid,
            cid: cid,
            clid: clid,
            sortable: $(this)
        }, function () {
            $('#tsv-explorer').tsviewerRefresh(false);
        });
    }
}

/**
 *
 * @param element_id
 */
function moveDown(element_id) {
    let cid = $(element_id).attr('data-id');
    let pid = "0";
    if (!$(element_id).parent().parent().hasClass("server")) {
        pid = $(element_id).parent().parent().attr("data-id");
        pid = !pid || false || pid === "1" ? "0" : pid;
    }
    let channel_order = $(element_id).next("li.channel, li.spacer").attr('data-id') || "0"
    $('#tsi-viewer-block').channelMove({
        id: id,
        sid: sid,
        cid: cid,
        pid: pid,
        order_id: channel_order,
        sortable: $(element_id)
    }, function () {
        $('#tsv-explorer').tsviewerRefresh(false);
    });
}

/**
 *
 * @param element_id
 */
function moveDownClient(element_id) {
    let next = $(element_id).parent().parent().next("li.channel, li.spacer");
    if (!next.length) {
        next = $(element_id).parent().parent().parent().parent().next("li.channel, li.spacer");
    }
    let cid = next.attr("data-id");
    if (cid && cid !== '0') {
        let clid = $(element_id).attr('data-id');
        $('#tsi-viewer-block').clientMove({
            id: id,
            sid: sid,
            cid: cid,
            clid: clid,
            sortable: $(this)
        }, function () {
            $('#tsv-explorer').tsviewerRefresh(false);
        });
    }
}

$(document).ready(function () {
    let tsi_imports_path = source.tsi_imports_path;
    let ts_explorer_auto_refresh_intervall = source.ts_explorer_auto_refresh_intervall;
    let cookie_date_serverInterface = source.cookie_date_serverInterface;
    let path_chatlog_serverInterface = source.path_chatlog_serverInterface;
    let tsi_virtualserver_client_poke = source.tsi_virtualserver_client_poke;
    let tsi_virtualserver_kick = source.tsi_virtualserver_kick;
    let tsi_virtualserver_channel_move = source.tsi_virtualserver_channel_move;
    let tsi_virtualserver_client_move = source.tsi_virtualserver_client_move;
    let tsi_virtualserver_channel_kick = source.tsi_virtualserver_channel_kick;
    let tsi_virtualserver_complaints_create = source.tsi_virtualserver_complaints_create;
    let tsi_virtualserver_ban_create = source.tsi_virtualserver_ban_create;
    let tsi_virtualserver_music_bot_create = source.tsi_virtualserver_music_bot_create;
    let tsi_virtualserver_channel_delete = source.tsi_virtualserver_channel_delete;
    let tsi_virtualserver_music_bot_delete = source.tsi_virtualserver_music_bot_delete;
    let tsi_virtualserver_show_querys = source.tsi_virtualserver_show_querys;
    let tsi_virtualserver_basis = source.tsi_virtualserver_basis;

    /**
     *
     * @param a
     * @returns {string}
     */
    function getCookieValue(a) {
        const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }

    /**
     *
     * @param selector
     * @param align
     * @param cursor
     */
    function enableTips(selector = ".tsv-icon", align = undefined, cursor = undefined) {
        $(selector).each(function () {
            let title = $(this).attr("title");
            if (title) {
                if (align !== undefined) {
                    $(this).addClass("with-tip tip-" + align);
                }
                if (cursor !== undefined) {
                    $(this).css("cursor", cursor);
                }
            }
        });
    }

    /**
     *
     * @param selector
     */
    function disableTips(selector = ".tsv-name") {
        $(selector).each(function () {
            if ($(this).hasClass("with-tip")) {
                $(this).hideTip();
                $(this).removeClass("with-tip");
            }
        });
    }

    //Init icons
    $('#icon_id').serverIconsGet();
    let tsViewer = $('#tsv-explorer');

    let viewerLink = tsi_virtualserver_basis === "tea"
        ? "index.php?controller=ajax&action=serverViewData&content=real-time"
        : "index.php?controller=ajax&action=serverViewData";

    /**
     * AUTO REFRESH
     */

    let autoRefreshElement = $('#ajax-auto-refresh');
    let autoRefreshSavingElement = $('#ajax-auto-refresh-saving');

    /**
     * VIEWER DRAG & DROP
     */

    tsViewer.tsviewer({
        // mandatory server address
        iconUrl: tsi_imports_path + "/$icon.png",
        dataUrl: viewerLink + "&id=" + id + "&sid=" + sid,
        // optional tooltip patterns
        serverTip: "Clients: $users/$slots",
        channelTip: "Codec: $codec",
        clientTip: "Version: $version on $platform",
        // optional callbacks
        onNode: function (elem, node) {

            let {parent, props, first, last} = node;
            let parentId = parent.replace("ts3_s", "").replace("ts3_c", "");

            let className = node.class;
            let nodeId = props.id;

            let block = $('#ajax-handle-properties');
            let element = $(elem);
            element.attr("data-pid", parentId);

            if (className.includes("server")) {
                element.children(":first").click(function (event) {
                    event.preventDefault();
                    disableTips(".tsv-icon");
                    if (block.attr("data-loading") === "1") {
                        return null;
                    } else if (!id || id.length === 0) {
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Entity id is missing'), {type: 'warning'});
                    } else if (!sid || sid.length === 0) {
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Virtual server id is missing'), {type: 'warning'});
                    } else {
                        block.attr("data-loading", "1");
                        let target = 'index.php?controller=ajax&action=serverEdit';
                        let data = {
                            c: '',
                            id: id,
                            sid: sid
                        };
                        let redirect = $('#redirect');
                        if (redirect.length > 0) {
                            data.redirect = redirect.val();
                        }
                        let sendTimer = new Date().getTime();
                        $.ajax({
                            url: target,
                            dataType: 'json',
                            type: 'POST',
                            data: data,
                            cache: false,
                            success: function (data) {
                                if (data.valid) {
                                    target = target + '&content=real-time';
                                    if (event.originalEvent !== undefined) {
                                        target = 'index.php?controller=ajax&action=serverEdit';
                                    }

                                    let receiveTimer = new Date().getTime();
                                    if (receiveTimer - sendTimer < 500) {
                                        setTimeout(function () {
                                            block.loadWithEffect(target,
                                                {'id': id, 'sid': sid}, function () {
                                                    $(this).applyTemplateSetup();
                                                    block.removeBlockMessages({except: 'no-hide'});
                                                    block.attr("data-loading", "0");
                                                });

                                        }, 500 - (receiveTimer - sendTimer));
                                    } else {
                                        block.loadWithEffect(target,
                                            {'id': id, 'sid': sid}, function () {
                                                $(this).applyTemplateSetup();
                                                block.removeBlockMessages({except: 'no-hide'});
                                                block.attr("data-loading", "0");
                                            });
                                    }
                                } else {
                                    block.removeBlockMessages({except: 'no-hide'}).blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error'});
                                    block.attr("data-loading", "0");
                                }
                            },
                            error: function () {
                                block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error'});
                                block.attr("data-loading", "0");
                            }
                        });
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Please wait, checking...'), {type: 'loading'});
                    }
                });
            } else if (className.includes("channel") || className.includes("spacer")) {
                element.children(":first").bind('contextMenu', function (event, list) {
                    event.preventDefault();
                    if (tsi_virtualserver_channel_move === 1) {
                        if (!first) {
                            list.push({
                                text: tjs.get("Move Up"),
                                onclick: "moveUp('#" + element.attr("id") + "');",
                                link: "javascript:void(0)",
                                icon: "up"
                            });
                        }
                        list.push({
                            text: tjs.get("Move to .."),
                            onclick: "modalChannelMove('" + id + "', '" + sid + "', '" + nodeId + "');",
                            link: "javascript:void(0)",
                            icon: "arrow_right"
                        });
                    }

                    if (tsi_virtualserver_client_move === 1) {
                        list.push({
                            text: tjs.get("Move here .."),
                            onclick: "modalChannelMoveHere('" + id + "', '" + sid + "', '" + nodeId + "');",
                            link: "javascript:void(0)",
                            icon: "group"
                        });
                    }

                    if (tsi_virtualserver_channel_delete === 1) {
                        list.push({
                            text: tjs.get('Delete'),
                            onclick: "channelDelete('" + id + "', '" + sid + "', '" + nodeId + "');",
                            link: 'javascript:void(0)',
                            icon: 'delete'
                        });
                    }
                    if (tsi_virtualserver_music_bot_create === 1) {
                        list.push({
                            text: tjs.get('Create music bot'),
                            onclick: "musicBotCreate('" + id + "', '" + sid + "', '" + nodeId + "');",
                            link: 'javascript:void(0)',
                            icon: 'plus'
                        });
                    }

                    if (tsi_virtualserver_channel_move === 1 && !last) {
                        list.push({
                            text: tjs.get("Move Down"),
                            onclick: "moveDown('#" + element.attr("id") + "');",
                            link: "javascript:void(0)",
                            icon: "down"
                        });
                    }

                });

                element.children(":first").dblclick(function (event) {
                    event.preventDefault();
                    disableTips(".tsv-icon");
                    if (block.attr("data-loading") === "1") {
                        return null;
                    } else if (!id || id.length === 0) {
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Entity id is missing'), {type: 'warning'});
                    } else if (!sid || sid.length === 0) {
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Virtual server id is missing'), {type: 'warning'});
                    } else if (!nodeId || nodeId.length === 0) {
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Channel id is missing'), {type: 'warning'});
                    } else {
                        block.attr("data-loading", "1");
                        let target = 'index.php?controller=ajax&action=channelEdit';
                        let data = {
                            c: '',
                            id: id,
                            sid: sid,
                            cid: nodeId
                        };
                        let redirect = $('#redirect');
                        if (redirect.length > 0) {
                            data.redirect = redirect.val();
                        }
                        let sendTimer = new Date().getTime();
                        $.ajax({
                            url: target,
                            dataType: 'json',
                            type: 'POST',
                            data: data,
                            cache: false,
                            success: function (data) {
                                if (data.valid) {
                                    target = target + '&content=real-time';
                                    if (event.originalEvent !== undefined) {
                                        target = 'index.php?controller=ajax&action=channelEdit';
                                    }
                                    let receiveTimer = new Date().getTime();
                                    if (receiveTimer - sendTimer < 500) {
                                        setTimeout(function () {
                                            block.loadWithEffect(target,
                                                {'id': id, 'sid': sid, 'cid': nodeId}, function () {
                                                    $(this).applyTemplateSetup();
                                                    block.removeBlockMessages({except: 'no-hide'});
                                                    block.attr("data-loading", "0");
                                                });

                                        }, 500 - (receiveTimer - sendTimer));
                                    } else {
                                        block.loadWithEffect(target,
                                            {'id': id, 'sid': sid, 'cid': nodeId}, function () {
                                                $(this).applyTemplateSetup();
                                                block.removeBlockMessages({except: 'no-hide'});
                                                block.attr("data-loading", "0");
                                            });
                                    }
                                } else {
                                    block.removeBlockMessages({except: 'no-hide'}).blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error'});
                                    block.attr("data-loading", "0");
                                }
                            },
                            error: function () {
                                block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error'});
                                block.attr("data-loading", "0");
                            }
                        });
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Please wait, checking...'), {type: 'loading'});
                    }
                });
            } else if (className.includes("client") || className.includes("music")) {
                let {cldbid} = props;
                element.attr("data-cldbid", cldbid);
                if (className.includes("music")) {
                    element.bind('contextMenu', function (event, list) {
                        event.preventDefault();
                        if (tsi_virtualserver_client_move === 1) {
                            list.push({
                                text: tjs.get("Previous Channel"),
                                onclick: "moveUpClient('#" + element.attr("id") + "');",
                                link: "javascript:void(0)",
                                icon: "up"
                            });
                            list.push({
                                text: tjs.get("Move to .."),
                                onclick: "modalClientMove('" + id + "', '" + sid + "', '" + nodeId + "');",
                                link: "javascript:void(0)",
                                icon: "arrow_right"
                            });
                        }
                        let {cldbid} = props;
                        if (tsi_virtualserver_music_bot_delete === 1) {
                            list.push({
                                text: tjs.get('Delete music bot'),
                                onclick: "musicBotDelete('" + id + "', '" + sid + "', '" + cldbid + "');",
                                link: 'javascript:void(0)',
                                icon: 'delete'
                            });
                        }
                        if (tsi_virtualserver_client_move === 1) {
                            list.push({
                                text: tjs.get("Next Channel"),
                                onclick: "moveDownClient('#" + element.attr("id") + "');",
                                link: "javascript:void(0)",
                                icon: "down"
                            });
                        }
                    });
                } else {
                    element.children(":first").bind('contextMenu', function (event, list) {
                        event.preventDefault();
                        if (tsi_virtualserver_client_move === 1) {
                            list.push({
                                text: tjs.get("Previous Channel"),
                                onclick: "moveUpClient('#" + element.attr("id") + "');",
                                link: "javascript:void(0)",
                                icon: "up"
                            });
                            list.push({
                                text: tjs.get("Move to .."),
                                onclick: "modalClientMove('" + id + "', '" + sid + "', '" + nodeId + "');",
                                link: "javascript:void(0)",
                                icon: "arrow_right"
                            });
                        }
                        if (tsi_virtualserver_client_poke === 1) {
                            list.push({
                                text: tjs.get('Poke'),
                                onclick: "clientPoke('" + id + "', '" + sid + "', '" + nodeId + "');",
                                link: 'javascript:void(0)',
                                icon: 'alarm'
                            });
                        }
                        if (tsi_virtualserver_kick === 1) {
                            list.push({
                                text: tjs.get('Kick From Server'),
                                onclick: "clientKick('" + id + "', '" + sid + "', '" + nodeId + "', '1');",
                                link: 'javascript:void(0)',
                                icon: 'busy'
                            });
                        }
                        if (tsi_virtualserver_channel_kick === 1) {
                            list.push({
                                text: tjs.get('Kick From Channel'),
                                onclick: "clientKick('" + id + "', '" + sid + "', '" + nodeId + "', '0');",
                                link: 'javascript:void(0)',
                                icon: 'redup'
                            });
                        }
                        if (tsi_virtualserver_complaints_create === 1) {
                            list.push({
                                text: tjs.get('Create Complaint'),
                                onclick: "complaintCreate('" + id + "', '" + sid + "', '" + cldbid + "', '1');",
                                link: 'javascript:void(0)',
                                icon: 'complaint'
                            });
                        }
                        if (tsi_virtualserver_ban_create === 1) {
                            list.push({
                                text: tjs.get('Create Bann'),
                                onclick: "clientBan('" + id + "', '" + sid + "', '" + nodeId + "');",
                                link: 'javascript:void(0)',
                                icon: 'ban'
                            });
                        }
                        if (tsi_virtualserver_client_move === 1) {
                            list.push({
                                text: tjs.get("Next Channel"),
                                onclick: "moveDownClient('#" + element.attr("id") + "');",
                                link: "javascript:void(0)",
                                icon: "down"
                            });
                        }
                    });
                }

                element.children(":first").dblclick(function (event) {
                    event.preventDefault();
                    disableTips(".tsv-icon");
                    let {cldbid} = props;
                    if (block.attr("data-loading") === "1") {
                        return null;
                    } else if (!id || id.length === 0) {
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Entity id is missing'), {type: 'warning'});
                    } else if (!sid || sid.length === 0) {
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Virtual server id is missing'), {type: 'warning'});
                    } else if (!cldbid || cldbid.length === 0) {
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Client database id is missing'), {type: 'warning'});
                    } else {
                        block.attr("data-loading", "1");
                        let target = 'index.php?controller=ajax&action=clientEdit';
                        let data = {
                            c: '',
                            id: id,
                            sid: sid,
                            cldbid: cldbid
                        };
                        let redirect = $('#redirect');
                        if (redirect.length > 0) {
                            data.redirect = redirect.val();
                        }
                        let sendTimer = new Date().getTime();
                        $.ajax({
                            url: target,
                            dataType: 'json',
                            type: 'POST',
                            data: data,
                            cache: false,
                            success: function (data) {
                                if (data.valid) {
                                    target = target + '&content=real-time';
                                    if (event.originalEvent !== undefined) {
                                        target = 'index.php?controller=ajax&action=clientEdit';
                                    }
                                    let receiveTimer = new Date().getTime();
                                    if (receiveTimer - sendTimer < 500) {
                                        setTimeout(function () {
                                            block.loadWithEffect(target,
                                                {'id': id, 'sid': sid, 'cldbid': cldbid}, function () {
                                                    $(this).applyTemplateSetup();
                                                    block.removeBlockMessages({except: 'no-hide'});
                                                    block.attr("data-loading", "0");
                                                });

                                        }, 500 - (receiveTimer - sendTimer));
                                    } else {
                                        block.loadWithEffect(target,
                                            {'id': id, 'sid': sid, 'cldbid': cldbid}, function () {
                                                $(this).applyTemplateSetup();
                                                block.removeBlockMessages({except: 'no-hide'});
                                                block.attr("data-loading", "0");
                                            });
                                    }
                                } else {
                                    block.removeBlockMessages({except: 'no-hide'}).blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error'});
                                    block.attr("data-loading", "0");
                                }
                            },
                            error: function () {
                                block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error'});
                                block.attr("data-loading", "0");
                            }
                        });
                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Please wait, checking...'), {type: 'loading'});
                    }
                });
            }
        },
        onReady: function (data, count) {

            let startElement;
            let sorting;

            /**
             *
             */
            $(function () {
                $('#tsv-explorer ul').sortable(
                    {
                        opacity: 0.6,
                        grid: [5, 5],
                        connectWith: '.tsv-container',
                        forcePlaceholderSize: false,
                        start: function () {
                            startElement = $(this);
                            sorting = true;
                            if (getCookieValue("ts-explorer-auto-refresh") === "true") {
                                autoRefreshElement.prop("checked", false);
                            }
                        },
                        stop: function (event, ui) {
                            sorting = false;
                            if (ui.item.attr("dropped") === "1") {
                                $(this).sortable("cancel");
                                ui.item.attr("dropped", "0");
                            } else if (ui.item.hasClass("channel") || ui.item.hasClass("spacer")) {
                                if (tsi_virtualserver_channel_move === 1) {
                                    let cid = ui.item.attr('data-id');
                                    let pid = "0";
                                    if (!ui.item.parent().parent().hasClass("server")) {
                                        pid = ui.item.parent().parent().attr("data-id");
                                        pid = !pid || false || pid === "1" ? "0" : pid;
                                    }
                                    let channel_order = ui.item.prev("li").attr('data-id') || "0"
                                    $('#tsi-viewer-block').channelMove({
                                        id: id,
                                        sid: sid,
                                        cid: cid,
                                        pid: pid,
                                        order_id: channel_order,
                                        sortable: $(this)
                                    }, function () {
                                        tsViewer.tsviewerRefresh(false);
                                    });
                                } else {
                                    $(this).sortable('cancel');
                                }
                            } else if (!ui.item.hasClass("query")) {
                                if (tsi_virtualserver_client_move === 1) {
                                    let cid = ui.item.prev().attr("data-id");
                                    if (cid && cid !== '0') {
                                        let clid = ui.item.attr('data-id');
                                        $('#tsi-viewer-block').clientMove({
                                            id: id,
                                            sid: sid,
                                            cid: cid,
                                            clid: clid,
                                            sortable: $(this)
                                        }, function () {
                                            tsViewer.tsviewerRefresh(false);
                                        });
                                    } else {
                                        $(this).sortable('cancel');
                                    }
                                } else {
                                    $(this).sortable('cancel');
                                }
                            }
                            tsViewer.parent().parent().find('.black-cell').html('<span class=\"success\"></span>');
                            if (getCookieValue("ts-explorer-auto-refresh") === "true") {
                                autoRefreshElement.click();
                            }
                        },
                        sort: function () {
                            tsViewer.parent().parent().find('.black-cell').html('<span class=\"loading\"></span>');
                        }
                    });
                $('ul, li').disableSelection();
            });

            let counter = 0;

            $('.tsv-node.channel, .tsv-node.spacer').droppable({
                axis: "x",
                //hoverClass: "ui-state-highlight",
                tolerance: "intersect",
                greedy: true,
                over: function (event, ui) {
                    let target = event.target || event.srcElement;
                    $(target).addClass("ui-state-highlight");
                },
                out: function (event, ui) {
                    let target = event.target || event.srcElement;
                    $(target).removeClass("ui-state-highlight");
                },
                drop: function (event, ui) {
                    ui.draggable.attr("dropped", "1");
                    counter++;
                    if (counter > 1) {
                        $(this).droppable("disable");
                    } else if (ui.draggable.hasClass("client") || ui.draggable.hasClass("music")) {
                        if (tsi_virtualserver_client_move === 1) {
                            let clid = ui.draggable.attr("data-id");
                            let target = event.target || event.srcElement;
                            let cid = $(target).attr("data-id");
                            $('#tsi-viewer-block').clientMove({
                                id: id,
                                sid: sid,
                                cid: cid,
                                clid: clid
                            }, function () {
                                tsViewer.tsviewerRefresh(false);
                                tsViewer.parent().parent().find('.black-cell')
                                    .html('<span class=\"success\"></span>');
                                counter = 0;
                            });
                        } else {
                            $(this).droppable("disable");
                        }
                    } else if (!ui.draggable.hasClass("query")) {
                        if (tsi_virtualserver_channel_move === 1) {
                            let cid = ui.draggable.attr("data-id");
                            let target = event.target || event.srcElement;
                            let pid = $(target).attr("data-id");
                            let channel_order = "0";
                            if ($(target).find("li.tsv-node.channel").length) {
                                channel_order = $(target).find("li.tsv-node.channel:first").attr('data-id');
                            } else if ($(target).find("li.tsv-node.spacer").length) {
                                channel_order = $(target).find("li.tsv-node.spacer:first").attr('data-id');
                            }
                            if (pid === ui.draggable.attr("data-pid")) {
                                tsViewer.tsviewerRefresh(false);
                                tsViewer.parent().parent().find('.black-cell')
                                    .html('<span class=\"success\"></span>');
                                counter = 0;
                            } else if (channel_order) {
                                channel_order = channel_order === cid ? '0' : channel_order;
                                $('#tsi-viewer-block').channelMove({
                                    id: id,
                                    sid: sid,
                                    cid: cid,
                                    pid: pid,
                                    order_id: channel_order,
                                }, function () {
                                    tsViewer.tsviewerRefresh(false);
                                    tsViewer.parent().parent().find('.black-cell')
                                        .html('<span class=\"success\"></span>');
                                    counter = 0;
                                });
                            }
                        } else {
                            $(this).droppable("disable");
                        }
                    }
                }
            });

            enableTips(".tsv-icon", "left");
            tsViewer.applyTemplateSetup();

            $('.spacer').css("cursor", "pointer");

            if (tsi_virtualserver_show_querys) {
                tsViewer.find('.query').hide();
            }
        },
        onError: function (error) {
            // @todo
        }
    });

    //Get and load server config
    $('#cache-update-virtualserver-current').click(function (event) {
        event.preventDefault();
        $('#tsi-viewer-block').find('.tsv-node.server').children(":first").click();
    });


    /**
     * VIEWER OPTIONS
     */

    //Reload/Refresh viewer
    $('.tsi-viewer-refresh:first').click(function (event) {
        event.preventDefault();
        tsViewer.tsviewerRefresh(event.originalEvent !== undefined);
    });

    //Create spacer
    $('.quick-spacer-create').click(function (event) {
        event.preventDefault();
        $(this).serverChannelSpacerCreate({}, function () {
            tsViewer.tsviewerRefresh(false);
        });
    });

    /**
     *
     */
    function autoRefresh() {
        if (autoRefreshElement.prop("checked")) {
            tsViewer.parent().parent().find('.black-cell').html('<span class=\"loading\"></span>');
            setTimeout(function () {
                if (autoRefreshElement.prop("checked")) {
                    tsViewer.tsviewerRefresh(false);
                }
                tsViewer.parent().parent().find('.black-cell').html('<span class=\"success\"></span>');
                autoRefresh();
            }, ts_explorer_auto_refresh_intervall);
        }
    }

    // Init auto refresh
    autoRefresh();

    setTimeout(function () {
        $('#tsv-container-ts3').height($('#tsv-container-ts3').height() * 1.01);
    }, ts_explorer_auto_refresh_intervall + 10);

    // Change auto refresh state
    autoRefreshElement.change(function (event) {
        event.preventDefault();
        if ($(this).prop('checked')) {
            autoRefresh();
            document.cookie = 'ts-explorer-auto-refresh=true; samesite=lax; expires=' + cookie_date_serverInterface + '';
        } else {
            document.cookie = 'ts-explorer-auto-refresh=false; samesite=lax; expires=' + cookie_date_serverInterface + '';
        }
    });

    // Change auto refresh only on saving configurations state
    autoRefreshSavingElement.change(function (event) {
        event.preventDefault();
        if ($(this).prop('checked')) {
            document.cookie = 'ts-explorer-auto-refresh-saving=true; samesite=lax; expires=' + cookie_date_serverInterface + '';
        } else {
            document.cookie = 'ts-explorer-auto-refresh-saving=false; samesite=lax; expires=' + cookie_date_serverInterface + '';
        }
    });

    //Viewer style
    $('.ajax-set-tse-style').click(function (event) {
        event.preventDefault();
        let style = $(this).attr('data-style');
        tsViewer.attr('data-style', style);
        document.cookie = 'ts-explorer-style=' + style + '; samesite=lax; expires=' + cookie_date_serverInterface + '';
        location.reload();
    });

    //Show query clients
    $('.ts-explorer-show-querys').click(function (event) {
        event.preventDefault();
        let status = $(this).attr('data-value');
        $(this).parent().parent('ul').find('li').removeClass('icon_badge_blue').addClass('icon_ta');
        $(this).parent('li').removeClass('icon_ta').addClass('icon_badge_blue');
        document.cookie = 'ts-explorer-show-querys=' + status + '; samesite=lax; expires=' + cookie_date_serverInterface + '';
        location.reload();
    });

    //Chat bot timeout
    $('.tsi-chat-bot-timeout').click(function (event) {
        event.preventDefault();
        let timeout = $(this).attr('data-value');
        $(this).parent().parent('ul').find('li').removeClass('icon_badge_blue').addClass('icon_ta');
        $(this).parent('li').removeClass('icon_ta').addClass('icon_badge_blue');
        document.cookie = 'tsi-chat-bot-timeout=' + timeout + '; samesite=lax; expires=' + cookie_date_serverInterface + '';
    });


    /**
     * BUTTONS
     */

    //Submit server/channel configuration
    $('#submitBtn').click(function (event) {
        event.preventDefault();

        $('#ajax-handle-properties').editProperites(
            {'id': id, 'sid': sid}, function () {
                let item = $(this).find('#title-icon');
                if (item.length !== 0) {
                    let icon = $(this).find('span#icon_id_title').children('img:first').attr('src');
                    if (icon) {
                        item.attr('src', icon).show();
                    } else {
                        item.hide();
                    }
                }
                if (autoRefreshSavingElement.prop('checked')) {
                    $('.tsi-viewer-refresh:first').click();
                }
                if ($(document).find('#cronosize_status').prop('checked')) {
                    let server_interface_hb_prev = $('#server_interface_hb_prev');
                    server_interface_hb_prev.parent().height(server_interface_hb_prev.height());
                    server_interface_hb_prev.loadWithEffect('index.php?controller=ajax&action=serverImage', {
                        'id': id,
                        'sid': sid
                    });
                }
            });
    });

    //Reset server/channel configuration
    $('#resetBtn').click(function (event) {
        event.preventDefault();
        $('#ajax-handle-properties').find('form')[0].reset();
    });


    /***
     * CHAT
     */

    $('#ajax-send-chat-message').click(function (event) {
        event.preventDefault();
        let ajax_chat_message = $('#ajax-chat-message');

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
            message: ajax_chat_message.val()
        };

        $('#tab-server-chat').serverMsgSend(options, function () {
            let ajax_server_chat = $('#ajax-server-chat');
            let ajax_chat_auto_refresh = $('#ajax-chat-auto-refresh');

            let msg = this.msg;
            let cbstatus = this.cbstatus;
            ajax_chat_message.val('');
            let chat = ajax_server_chat.html();
            ajax_server_chat.html(chat + tiny(msg) + '<br/>');
            ajax_server_chat.parent().animate({scrollTop: ajax_server_chat.height()}, 2000);

            if (!cbstatus) {
                ajax_chat_auto_refresh.prop('disabled', true);
            }

            if (ajax_chat_auto_refresh.prop('disabled')) {
                setTimeout(function () {
                    let ar = $('#ajax-chat-auto-refresh');
                    ar.prop('checked', true).prop('disabled', false);
                    reloadChatLog();
                    notifyTextMsg({
                        id: id,
                        sid: sid
                    });
                }, 500);
            }
        });
    });

    function reloadChatLog() {
        let ajax_server_chat = $('#ajax-server-chat');
        $.ajax({
            url: 'index.php?controller=ajax&action=fetchChatLog&path=' + encodeURIComponent(path_chatlog_serverInterface),
            contentType: 'application/json',
            dataType: 'text',
            success: function (res) {
                let {result} = JSON.parse(res);
                let {data = ""} = result;
                ajax_server_chat.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function () {
                $('#ajax-chat-loader').hide();
            }
        });
        $('#ajax-chat-loader').show();
        ajax_server_chat.parent().animate({scrollTop: ajax_server_chat.height()}, 2000);
        let ar = $('#ajax-chat-auto-refresh');
        if (ar.prop('checked') && !ar.prop('disabled')) {
            setTimeout(function () {
                reloadChatLog();
            }, 2000);
        }
    }

    $('#ajax-chat-auto-refresh').click(function (event) {
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
        let ajax_server_chat = $('#ajax-server-chat');
        $.ajax({
            url: 'index.php?controller=ajax&action=fetchChatLog&path=' + encodeURIComponent(path_chatlog_serverInterface),
            dataType: 'text',
            success: function (res) {
                let {result} = JSON.parse(res);
                let {data = ""} = result;
                ajax_server_chat.html(nl2br(data));
                $('#ajax-chat-loader').hide();
            },
            error: function () {
                $('#ajax-chat-loader').hide();
            }
        });
        $('#ajax-chat-loader').show();
        ajax_server_chat.parent().animate({scrollTop: ajax_server_chat.height()}, 2000);
    });

    $('.ajax-delete-chat:first').click(function (event) {
        event.preventDefault();
        let ajax_server_chat = $('#ajax-server-chat');
        let options = {
            id: id,
            sid: sid,
        };
        $('#tab-server-chat').serverChatClear(options, function () {
            ajax_server_chat.html('');
        });
    });

    $('#tab-server-chat-2').onTabShow(function (event) {
        event.preventDefault();
        let ajax_server_chat = $('#ajax-server-chat');
        ajax_server_chat.parent().animate({scrollTop: ajax_server_chat.height()});
        $('.tsi-viewer-refresh').prop('disabled', true);
    });

    $('.ajax-virtual-server-tpl-create-from-config').click(function (event) {
        event.preventDefault();
        $('#ajax-handle-properties').serverTplCreateFromConfig({'id': id, 'sid': sid});
    });


    /**
     * CRONOSIZE HOSTBANNER SERVICE
     */

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
});