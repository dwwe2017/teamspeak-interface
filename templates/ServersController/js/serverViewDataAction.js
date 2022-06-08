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

    let tsViewer = $('#tsv-explorer');
    let viewerLink = tsi_virtualserver_basis === "tea"
        ? "index.php?controller=ajax&action=serverViewData&content=real-time"
        : "index.php?controller=ajax&action=serverViewData";

    /**
     * AUTO REFRESH
     */

    let autoRefreshElement = $('#ajax-auto-refresh');

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

            if (className.includes("channel") || className.includes("spacer")) {
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
                            if (getCookieValue("ts-explorer-auto-refresh-" + id + sid) === "true") {
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
                            if (getCookieValue("ts-explorer-auto-refresh-" + id + sid) === "true") {
                                autoRefreshElement.click();
                            }
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

            $('.tsv-node').css("cursor", "pointer");

            if (tsi_virtualserver_show_querys) {
                tsViewer.find('.query').hide();
            }
        },
        onError: function (error) {
            // @todo
        }
    });

    /**
     * VIEWER OPTIONS
     */

    //Reload/Refresh viewer
    $('.tsi-viewer-refresh:first').click(function (event) {
        event.preventDefault();
        tsViewer.tsviewerRefresh(event.originalEvent !== undefined);
    });

    /**
     *
     */
    function autoRefresh() {
        if (autoRefreshElement.prop("checked")) {
            $("#ajax-auto-refresh-button").hide();
            $("#ajax-auto-refresh-loading").show();
            setTimeout(function () {
                if (autoRefreshElement.prop("checked")) {
                    tsViewer.tsviewerRefresh(false);
                }
                autoRefresh();
            }, ts_explorer_auto_refresh_intervall);
        } else {
            $("#ajax-auto-refresh-button").show();
            $("#ajax-auto-refresh-loading").hide();
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
            document.cookie = 'ts-explorer-auto-refresh-' + id + sid + '=true; samesite=lax; expires=' + cookie_date_serverInterface + '';
        } else {
            document.cookie = 'ts-explorer-auto-refresh-' + id + sid + '=false; samesite=lax; expires=' + cookie_date_serverInterface + '';
        }
    });
});