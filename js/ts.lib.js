/**
 *
 * @param msg
 */
function modalAlertMsg(msg) {
    $.modal({
        title: tjs.get("Attention"),
        content: "<p><div class=\"warnings align-center\"><b>" + msg + "</b></div></p>",
        draggable: true,
        closeButton: true,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param msg
 * @param callback
 */
function modalConfirmMsg(msg, callback) {
    $.modal({
        title: tjs.get("Confirm"),
        content: "<p><div class=\"warnings align-center\"><b>" + msg + "</b></div></p>",
        draggable: true,
        closeButton: true,
        scrolling: true,
        buttons: {
            'Continue': function (win) {
                if (typeof callback === 'function') {
                    callback.call(win);
                }
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param id
 * @param sid
 * @param cid
 * @param clid
 */
function modalClientModifyByClid(id, sid, cid, clid) {

    $.modal({
        title: tjs.get("Edit Client Properties"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=clientModify&id=" + id + "&sid=" + sid + "&cid=" + cid + "&clid=" + clid,
        width: 1000,
        height: 520,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param id
 * @param sid
 * @param cldbid
 */
function modalClientModifyByClDbId(id, sid, cldbid) {

    $.modal({
        title: tjs.get("Edit Client Properties"),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=clientModify&id=" + id + "&sid=" + sid + "&cldbid=" + cldbid,
        width: 1000,
        height: 520,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            }
        }
    });

}

/**
 *
 * @param id
 * @param sid
 * @param uid
 */
function modalClientModifyByUid(id, sid, uid) {

    $.modal({
        title: tjs.get("Edit Client Properties"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=clientModify&id=" + id + "&sid=" + sid + "&uid=" + uid,
        width: 1000,
        height: 520,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            }
        }
    });

}

/**
 *
 * @param id
 * @param sid
 * @param name
 */
function modalClientModifyByName(id, sid, name) {

    $.modal({
        title: tjs.get("Edit Client Properties"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=clientModify&id=" + id + "&sid=" + sid + "&name=" + name,
        width: 1000,
        height: 520,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param id
 * @param sid
 * @param clid
 */
function modalClientMove(id, sid, clid) {
    $.modal({
        title: tjs.get("Move to .."),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=clientMove&id=" + id + "&sid=" + sid + "&clid=" + clid,
        width: 480,
        height: 120,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            },
            'Move': function (win) {
                let cid = win.getModalContentBlock().find('#channel_selection').children("option:selected").val();
                let block = parent.$("#tsi-viewer-block");
                block.clientMove({
                    id: id,
                    sid: sid,
                    cid: cid,
                    clid: clid
                }, function () {
                    parent.$('#tsv-explorer').tsviewerRefresh(false);
                    win.closeModal();
                });
            },
        }
    });
}

/**
 *
 * @param id
 * @param sid
 * @param cid
 */
function modalChannelModifyByCid(id, sid, cid) {

    $.modal({
        title: tjs.get("Edit Channel Properties"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=channelModify&id=" + id + "&sid=" + sid + "&cid=" + cid,
        width: 1000,
        height: 520,
        scrolling: true,
        buttons: {
            'Revert': function (win) {
                var form = win.getModalContentBlock().find('form');
                form[0].reset();
            },
            'Save': function (win) {
                var block = win.getModalContentBlock().find('section');
                block.editProperites(
                    {'id': id, 'sid': sid}, function () {
                        if ($('#title-icon').length !== 0) {
                            var icon = $('span#channel_icon_id_title').children('img:first').attr('src');
                            if (icon) {
                                $('#title-icon').attr('src', icon).show();
                            } else {
                                $('#title-icon').hide();
                            }
                        }
                    }
                )
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param id
 * @param sid
 * @param cid
 */
function modalChannelMove(id, sid, cid) {
    $.modal({
        title: tjs.get("Move to .."),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=channelMove&id=" + id + "&sid=" + sid + "&cid=" + cid,
        width: 480,
        height: 120,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            },
            'Move': function (win) {
                let pid = win.getModalContentBlock().find('#channel_selection').children("option:selected").val();
                let block = parent.$("#tsi-viewer-block");
                block.channelMove({
                    id: id,
                    sid: sid,
                    cid: cid,
                    pid: pid,
                    order_id: '0'
                }, function () {
                    parent.$('#tsv-explorer').tsviewerRefresh(false);
                    win.closeModal();
                });
            },
        }
    });
}

/**
 *
 * @param id
 * @param sid
 * @param cid
 */
function modalChannelMoveHere(id, sid, cid) {
    $.modal({
        title: tjs.get("Move here .."),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=channelMoveHere&id=" + id + "&sid=" + sid + "&cid=" + cid,
        width: 480,
        height: 200,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            },
            'Select all': function (win) {
                win.getModalContentBlock().find('#client_selection:first').find("option").prop("selected", true);
            },
            'Move': function (win) {
                let block = parent.$("#tsi-viewer-block");
                let options = win.getModalContentBlock().find('#client_selection:first').find("option:selected");
                let i = 0;
                if (options.length > 0) {
                    options.each(function () {
                        let clid = this.value;
                        block.clientMove({
                            id: id,
                            sid: sid,
                            cid: cid,
                            clid: clid
                        }, function () {
                            i++;
                            if (i >= options.length) {
                                parent.$('#tsv-explorer').tsviewerRefresh(false);
                                win.closeModal();
                            }
                        });
                    })
                } else {
                    modalAlertMsg(tjs.get("No clients selected"));
                }
            },
        }
    });
}

/**
 *
 * @param id
 * @param sid
 */
function modalLogView(id, sid, basis = "default") {

    if (basis === "teaspeak") {
        $.modal({
            title: tjs.get("Last Logs"),
            draggable: true,
            closeButton: true,
            url: "index.php?controller=modal&action=logView&id=" + id + "&sid=" + sid,
            width: 800,
            height: 520,
            scrolling: true,
            buttons: {
                'Close': function (win) {
                    win.closeModal();
                }
            }
        });
    } else {
        $.modal({
            title: tjs.get("Last Logs"),
            draggable: true,
            closeButton: true,
            url: "index.php?controller=modal&action=logView&id=" + id + "&sid=" + sid,
            width: 800,
            height: 520,
            scrolling: true,
            buttons: {
                'Create Log Entry': function () {
                    modalLogAdd(id, sid);
                },
                'Close': function (win) {
                    win.closeModal();
                }
            }
        });
    }
}

/**
 *
 */
$('.modal-logs').click(function (event) {

    event.preventDefault();
    modalLogView($(this).attr("data-id"), $(this).attr("data-sid"), $(this).attr("data-basis"));

});

/**
 *
 * @param id
 * @param sid
 */
function modalLogAdd(id, sid) {

    $.modal({
        title: tjs.get("Create Log Entry"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=logAdd&id=" + id + "&sid=" + sid,
        buttons: {
            'Save': function (win) {
                var parent_block = parent.$("#view-logs-block").getModalWindow();
                win.getModalContentBlock().serverAddLog({'id': id, 'sid': sid}, function () {
                    parent_block.loadModalContent("index.php?controller=modal&action=logView&id=" + id + "&sid=" + sid);
                });
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param id
 * @param sid
 */
function modalSnapshotImport(id, sid) {

    $.modal({
        title: tjs.get("Import Snapshot"),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=snapshotImport&id=" + id + "&sid=" + sid,
        buttons: {
            'Import': function (win) {
                var parent_block = parent.$("#view-snapshots-block").getModalWindow();
                win.find('form').serverSnapshotImport({'id': id, 'sid': sid}, function () {
                    parent_block.loadModalContent("index.php?controller=modal&action=snapshotList&id=" + id + "&sid=" + sid);
                });
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param id
 * @param sid
 */
function modalBanList(id, sid) {

    $.modal({
        title: tjs.get("Banlist"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=banList&id=" + id + "&sid=" + sid,
        width: 800,
        height: 520,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-bans').click(function (event) {

    event.preventDefault();
    modalBanList($(this).attr("data-id"), $(this).attr("data-sid"));

});

/**
 *
 * @param id
 * @param sid
 */
function modalComplaintList(id, sid) {

    $.modal({
        title: tjs.get("Complaint List"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=complaintList&id=" + id + "&sid=" + sid,
        width: 800,
        height: 520,
        scrolling: true,
        buttons: {
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-complaints').click(function (event) {

    event.preventDefault();
    modalComplaintList($(this).attr("data-id"), $(this).attr("data-sid"));

});

/**
 *
 * @param id
 * @param sid
 * @param redirect
 */
function modalSgCreate(id, sid, redirect) {

    var link = "";
    if (redirect && redirect.length !== 0) {
        link = "&redirect=" + encodeURIComponent($(location).attr('href'));
    }

    $.modal({
        title: tjs.get("Create Servergroup"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=sgCreate&id=" + id + "&sid=" + sid + link,
        scrolling: true,
        padding: false,
        buttons: {
            'Save & Proceed': function (win) {
                win.getModalContentBlock().serverServergroupCreate({'id': id, 'sid': sid});
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-sg-create').click(function (event) {

    event.preventDefault();
    modalSgCreate($(this).attr("data-id"), $(this).attr("data-sid"), $(this).attr("href"));

});

/**
 *
 * @param id
 * @param sid
 * @param redirect
 */
function modalCgCreate(id, sid, redirect) {

    var link = "";
    if (redirect && redirect.length !== 0) {
        link = "&redirect=" + encodeURIComponent(redirect);
    }

    $.modal({
        title: tjs.get("Create Channelgroup"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=cgCreate&id=" + id + "&sid=" + sid + link,
        scrolling: true,
        padding: false,
        buttons: {
            'Save & Proceed': function (win) {
                win.getModalContentBlock().serverChannelgroupCreate({'id': id, 'sid': sid});
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-cg-create').click(function (event) {

    event.preventDefault();
    modalCgCreate($(this).attr("data-id"), $(this).attr("data-sid"), $(this).attr("href"));

});

/**
 *
 * @param id
 * @param sid
 * @param cgid
 * @param redirect
 */
function modalCgEdit(id, sid, cgid, redirect) {

    var link = "";
    if (redirect && redirect.length !== 0) {
        link = "&redirect=" + encodeURIComponent(redirect);
    }

    $.modal({
        title: tjs.get("Edit Channelgroup"),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=cgEdit&id=" + id + "&sid=" + sid + "&cgid=" + cgid + link,
        scrolling: true,
        padding: false,
        buttons: {
            'Save & Proceed': function (win) {
                win.getModalContentBlock().serverChannelgroupEdit({'id': id, 'sid': sid, 'cgid': cgid});
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param id
 * @param sid
 * @param redirect
 */
function modalChannelCreate(id, sid, redirect) {

    var link = "";
    if (redirect && redirect.length !== 0) {
        link = "&redirect=" + encodeURIComponent(redirect);
    }

    $.modal({
        title: tjs.get("Create Channel"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=channelCreate&id=" + id + "&sid=" + sid + link,
        scrolling: true,
        width: 1000,
        height: 520,
        buttons: {
            'Save & Proceed': function (win) {
                win.getModalContentBlock().serverChannelCreate({'id': id, 'sid': sid});
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-channel-create').click(function (event) {

    event.preventDefault();
    modalChannelCreate($(this).attr("data-id"), $(this).attr("data-sid"), $(this).attr("href"));

});

/**
 *
 * @param id
 * @param redirect
 */
function modalServerCreate(id, redirect) {

    var link = "";
    if (redirect && redirect.length !== 0) {
        link = "&redirect=" + encodeURIComponent(redirect);
    }

    var close = tjs.get("Close");
    var save = tjs.get("Save & Proceed");

    $.modal({
        title: tjs.get("Create Virtual Server"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=serverCreate&id=" + id + link,
        scrolling: true,
        width: 1000,
        height: 520,
        buttons: {
            'Save & Proceed': function (win) {
                win.getModalContentBlock().serverCreate({'id': id});
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-virtual-server-create').click(function (event) {

    event.preventDefault();
    modalServerCreate($(this).attr("data-id"), $(this).attr("href"));

});

/**
 *
 * @param id
 * @param sid
 * @param sgid
 * @param redirect
 */
function modalSgEdit(id, sid, sgid, redirect) {

    var link = "";
    if (redirect && redirect.length !== 0) {
        link = "&redirect=" + encodeURIComponent(redirect);
    }

    $.modal({
        title: tjs.get("Edit Servergroup"),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=sgEdit&id=" + id + "&sid=" + sid + "&sgid=" + sgid + link,
        scrolling: true,
        padding: false,
        buttons: {
            'Save & Proceed': function (win) {
                win.getModalContentBlock().serverServergroupEdit({'id': id, 'sid': sid, 'sgid': sgid});
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param id
 * @param redirect
 */
function modalServerTplCreate(id, redirect) {

    var link = "";
    if (redirect && redirect.length !== 0) {
        link = "&redirect=" + encodeURIComponent(redirect);
    }

    $.modal({
        title: tjs.get("New Virtual Server Template"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=serverTplCreate&id=" + id + link,
        scrolling: true,
        width: 1000,
        height: 520,
        buttons: {
            'Save': function (win) {
                let parent_block = parent.$("#view-server-tpl-block").getModalWindow();
                win.getModalContentBlock().serverTplCreate({'id': id}, function () {
                    if (parent_block) {
                        parent_block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Refreshing list...'), {
                            type: 'loading',
                            position: 'top'
                        });
                        setTimeout(function () {
                            setTimeout(function () {
                                parent_block.loadModalContent("index.php?controller=modal&action=serverTplList&id=" + id + link);
                            }, 900);
                            win.closeModal();
                        }, 100);
                    } else {
                        setTimeout(function () {
                            win.closeModal();
                        }, 100);
                    }
                });
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-virtual-server-tpl-add').click(function (event) {
    event.preventDefault();
    modalServerTplCreate($(this).attr("data-id"), $(this).attr("href"));
});

/**
 *
 * @param id
 * @param redirect
 */
function modalServerTplList(id, redirect) {

    var link = "";
    if (redirect && redirect.length !== 0) {
        link = "&redirect=" + encodeURIComponent(redirect);
    }

    $.modal({
        title: tjs.get("Manage Templates"),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=serverTplList&id=" + id + link,
        width: 800,
        height: 520,
        scrolling: true,
        buttons: {
            'New Template': function () {
                modalServerTplCreate(id, redirect);
            },
            'Refresh list': function (win) {
                win.loadModalContent("index.php?controller=modal&action=serverTplList&id=" + id + link, {
                    loadingMessage: tjs.get("Loading")
                });
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-virtual-server-tpl-list').click(function (event) {
    event.preventDefault();
    modalServerTplList($(this).attr("data-id"), $(this).attr("href"));
});

/**
 *
 * @param id
 * @param sid
 */
function modalTokenList(id, sid) {

    $.modal({
        title: tjs.get("Token List"),
        //useIframe: true,
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=tokenList&id=" + id + "&sid=" + sid,
        width: 800,
        height: 520,
        scrolling: true,
        buttons: {
            'Create Token': function () {
                modalTokenCreate(id, sid);
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-token').click(function (event) {
    event.preventDefault();
    modalTokenList($(this).attr("data-id"), $(this).attr("data-sid"));
});

/**
 *
 * @param id
 * @param sid
 */
function modalTokenCreate(id, sid) {

    $.modal({
        title: tjs.get("Create Token"),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=tokenCreate&id=" + id + "&sid=" + sid,
        buttons: {
            'Save': function (win) {
                var parent_block = parent.$("#view-token-block").getModalWindow();
                win.getModalContentBlock().serverTokenCreate({'id': id, 'sid': sid}, function () {
                    parent_block.loadModalContent("index.php?controller=modal&action=tokenList&id=" + id + "&sid=" + sid);
                });
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param id
 * @param sid
 */
function modalApiKeyList(id, sid) {

    $.modal({
        title: tjs.get("Api keys"),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=apiKeyList&id=" + id + "&sid=" + sid,
        width: 800,
        height: 520,
        scrolling: true,
        buttons: {
            'Create Api key': function () {
                modalApiKeyCreate(id, sid);
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-apikeylist').click(function (event) {
    event.preventDefault();
    modalApiKeyList($(this).attr("data-id"), $(this).attr("data-sid"));
});

/**
 *
 * @param id
 * @param sid
 */
function modalApiKeyCreate(id, sid) {

    $.modal({
        title: tjs.get("Create Api key"),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=apiKeyCreate&id=" + id + "&sid=" + sid,
        buttons: {
            'Save': function (win) {
                var parent_block = parent.$("#apikeylist-block").getModalWindow();
                win.getModalContentBlock().serverApiKeyCreate({'id': id, 'sid': sid}, function () {
                    parent_block.loadModalContent("index.php?controller=modal&action=apiKeyList&id=" + id + "&sid=" + sid);
                    setTimeout(function () {
                        win.closeModal();
                    }, 500);
                });
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 */
$('.modal-instance-add').click(function (event) {
    event.preventDefault();

    var redirect = encodeURIComponent($(this).attr("href"));

    $.modal({
        title: tjs.get('Add Server Instance'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=instanceAdd&redirect=" + redirect,
        width: 460,
        height: 490,
        complete: function () {
            let oDropdown = $('#instance_icon');
            oDropdown.msDropDown().data("dd");
        },
        buttons: {
            'Add Instance': function (win) {
                var form = win.getModalContentBlock().find('form');
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-instance-edit').click(function (event) {
    event.preventDefault();

    var url = $(this).attr("href");

    $.modal({
        title: tjs.get('Edit Tea(m)speak Instance'),
        draggable: true,
        closeButton: true,
        url: url,
        width: 460,
        height: 490,
        complete: function () {
            let oDropdown = $('#instance_icon');
            oDropdown.msDropDown().data("dd");
        },
        buttons: {
            'Save Changes': function (win) {
                var form = win.getModalContentBlock().find('form');
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-snapshots').click(function (event) {
    event.preventDefault();

    var id = $(this).attr("data-id");
    var sid = $(this).attr("data-sid");

    $.modal({
        title: tjs.get('Snapshots'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=snapshotList&id=" + id + "&sid=" + sid,
        width: 800,
        height: 520,
        buttons: {
            'Create Snapshot': function (win) {
                $("#view-snapshots-block").serverSnapshotCreate({id: id, sid: sid}, function () {
                    var modalWindow = $(this).getModalWindow();
                    modalWindow.loadModalContent("index.php?controller=modal&action=snapshotList&id=" + id + "&sid=" + sid);
                });
            },
            'Build TSI Backup Package': function (win) {
                $("#view-snapshots-block").serverTsiBackupBuild({id: id, sid: sid}, function () {
                    var modalWindow = $(this).getModalWindow();
                    modalWindow.loadModalContent("index.php?controller=modal&action=snapshotList&id=" + id + "&sid=" + sid);
                });
            },
            'Import Snapshots': function (win) {
                modalSnapshotImport(id, sid);
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-import-instance-data').click(function (event) {
    event.preventDefault();

    var id = $(this).attr("data-id");
    var redirect = encodeURIComponent($(this).attr('href'));

    $.modal({
        title: tjs.get('Import/Update Instance Permissions'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=importInstanceData&id=" + id + "&redirect=" + redirect,
        width: 480,
        height: 280,
        buttons: {
            'Import & Refresh': function (win) {
                var form = win.getModalContentBlock().find('form');
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-import-icon-instance-data').click(function (event) {
    event.preventDefault();

    let id = $(this).attr("data-id");
    let redirect = encodeURIComponent($(this).attr('href'));
    let progress;
    let submitBt;

    $.modal({
        title: tjs.get('Import/Update Icons (Instance)'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=importInstanceIcons&id=" + id + "&redirect=" + redirect,
        width: 480,
        height: 280,
        complete: function () {
            progress = document.getElementById("icon-import-progress");
            submitBt = $('.block-footer.align-right').find('button[type=button]:first');
        },
        buttons: {
            'Import': function (win) {
                let form = win.getModalContentBlock().find('form');
                form.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Getting the list of all virtual servers'), {
                    type: 'loading',
                    position: 'top',
                    noMargin: true
                });

                $.get('index.php?controller=ajax&action=getVirtualServerList&id=' + id, function (data, status) {
                    let {valid = false, error = "", servers = {}} = data;
                    if (valid) {
                        let result_count = Object.keys(servers).length;
                        if (result_count > 0) {
                            let list = [];
                            let i = 0;
                            $.each(servers, function (index, value) {
                                list[i] = index;
                                i++;
                            })

                            let vs_next;
                            let vs_idx = 0;
                            let vs_size = result_count;

                            let success = 0;
                            let broken = 0;

                            if (list && list !== [] && list.hasOwnProperty(vs_idx)) {
                                submitBt.disableBt();
                                progress.parentElement.style.display = "block"
                                win.setModalContentSize(480, 320)

                                vs_next = function () {
                                    if (vs_idx < vs_size && servers.hasOwnProperty(list[vs_idx])) {

                                        if (list.hasOwnProperty(vs_idx)) {
                                            progress.firstElementChild.firstElementChild.style.width = (0).toFixed(0) + "%";
                                            progress.firstElementChild.firstElementChild.innerHTML = (0).toFixed(0) + "%";
                                            progress.nextElementSibling.firstElementChild.innerHTML = tjs.get("Virtual server") + " #" + list[vs_idx] + ": " + tjs.get("Icons are searched for ..");
                                        }

                                        form.iconFileList({id: id, sid: list[vs_idx]}, function () {
                                            let {data, form} = this;
                                            let {icons = []} = data;

                                            let next;
                                            let idx = 0;
                                            let size = Object.keys(icons).length;

                                            if (icons && icons !== [] && icons.hasOwnProperty(idx)) {
                                                next = function () {
                                                    if (idx < size) {
                                                        $.get('index.php?controller=ajax&action=importSingleServerIcon&id=' + id + '&sid=' + list[vs_idx] + '&name=' + encodeURIComponent(icons[idx]["name"]) + '&src=' + encodeURIComponent(icons[idx]["src"]), function (data, status) {
                                                            let {valid = false, error = ""} = data;
                                                            valid === false ? broken++ : success++;
                                                            next();
                                                        });
                                                        if (icons[idx].hasOwnProperty("name") && list.hasOwnProperty(vs_idx)) {
                                                            progress.nextElementSibling.firstElementChild.innerHTML = tjs.get("Virtual server") + " #" + list[vs_idx] + ": ../" + icons[idx]["name"] + " (" + (idx).toFixed(0) + "/" + size + ")";
                                                        }
                                                        progress.firstElementChild.firstElementChild.style.width = ((idx / size) * 100).toFixed(0) + "%";
                                                        progress.firstElementChild.firstElementChild.innerHTML = ((idx / size) * 100).toFixed(0) + "%";
                                                        idx++;
                                                    } else {
                                                        form.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Cache is being updated...'), {
                                                            type: 'loading',
                                                            position: 'top',
                                                            noMargin: true
                                                        });

                                                        let prevIdx = (idx - 1).toFixed(0);
                                                        if (icons[prevIdx].hasOwnProperty("name")) {
                                                            progress.nextElementSibling.firstElementChild.innerHTML = tjs.get("Virtual server") + " #" + list[vs_idx] + ": ../" + icons[prevIdx]["name"] + " (" + (idx).toFixed(0) + "/" + size + ")";
                                                        }

                                                        progress.firstElementChild.firstElementChild.style.width = ((idx / size) * 100).toFixed(0) + "%";
                                                        progress.firstElementChild.firstElementChild.innerHTML = ((idx / size) * 100).toFixed(0) + "%";
                                                        $.get('index.php?controller=ajax&action=refreshVirtualServerIcons&id=' + id + '&sid=' + list[vs_idx], function (data, status) {
                                                            let {valid = false, error = ""} = data;
                                                            if (valid) {
                                                                setTimeout(function () {
                                                                    vs_idx++;
                                                                    vs_next();
                                                                }, 200);
                                                            } else {
                                                                form.removeBlockMessages({except: 'no-hide'}).blockMessage(error, {
                                                                    type: 'error',
                                                                    position: 'top',
                                                                    noMargin: true
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                                next();
                                            } else {
                                                vs_idx++;
                                                vs_next();
                                            }
                                        }, function () {
                                            if (list.hasOwnProperty(vs_idx)) {
                                                progress.nextElementSibling.firstElementChild.innerHTML = tjs.get("Virtual server") + " #" + list[vs_idx] + ": " + tjs.get("No icons were found");
                                            }
                                            setTimeout(function () {
                                                setTimeout(function () {
                                                    vs_idx++;
                                                    vs_next();
                                                });
                                            }, 900)
                                        });
                                    } else {

                                        let type = "success";
                                        let message = "";
                                        let redirect = window.location.href;
                                        if (broken > 0 && success > 0) {
                                            type = "warning";
                                            message = success + " " + tjs.get("icons") + " " + tjs.get('successfully imported') + "/ " + broken + " " + tjs.get("icons") + " " + tjs.get("could not be imported");
                                        } else if (broken > 0) {
                                            type = "error";
                                            message = broken + " " + tjs.get("icons") + " " + tjs.get("could not be imported");
                                        } else if (success < 1) {
                                            type = "warning"
                                            message = tjs.get('No icons were found');
                                        } else {
                                            message = success + " " + tjs.get("icons") + " " + tjs.get('successfully imported');
                                        }

                                        progress.parentElement.style.display = "none";
                                        win.setModalContentSize(480, 280);

                                        form.removeBlockMessages({except: 'no-hide'}).blockMessage(message, {
                                            type: type,
                                            position: 'top',
                                            noMargin: true
                                        });

                                        win.addButtons({
                                            'Close & Refresh': function (win) {
                                                if (redirect.indexOf("?") > -1) {
                                                    if (typeof sid === 'undefined') {
                                                        window.location.href = redirect + "&cache=update&cache_id=" + default_cache_id;
                                                    } else {
                                                        window.location.href = redirect + "&cache=update&cache_id=" + default_cache_id.substr(0, (default_cache_id.length - sid.length+1).toFixed(0));
                                                    }
                                                } else {
                                                    if (typeof sid === 'undefined') {
                                                        window.location.href = redirect + "?cache=update&cache_id=" + default_cache_id;
                                                    } else {
                                                        window.location.href = redirect + "?cache=update&cache_id=" + default_cache_id.substr(0, (default_cache_id.length - sid.length+1).toFixed(0));
                                                    }
                                                }
                                            }
                                        }, true);

                                        submitBt.enableBt();
                                    }
                                }
                                vs_next();
                            }
                        }
                    } else {
                        form.removeBlockMessages({except: 'no-hide'}).blockMessage(error, {
                            type: 'error',
                            position: 'top',
                            noMargin: true
                        });
                    }
                }).fail(function () {
                    form.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Error while contacting server, please try again'), {
                        type: 'error',
                        position: 'top',
                        noMargin: settings.noMargin
                    });
                });
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-import-icon-data').click(function (event) {
    event.preventDefault();

    let id = $(this).attr("data-id");
    let sid = $(this).attr("data-sid");
    let redirect = encodeURIComponent($(this).attr('href'));
    let progress;
    let submitBt;

    $.modal({
        title: tjs.get('Import/Update Icons (Server)'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=importServerIcons&id=" + id + "&sid=" + sid + "&redirect=" + redirect,
        width: 480,
        height: 280,
        complete: function () {
            progress = document.getElementById("icon-import-progress");
            submitBt = $('.block-footer.align-right').find('button[type=button]:first');
        },
        buttons: {
            'Import': function (win) {
                let form = win.getModalContentBlock().find('form');
                form.iconFileList({id: id, sid: sid}, function () {
                    let {data, form} = this;
                    let {icons = []} = data;

                    let next;
                    let idx = 0;
                    let size = Object.keys(icons).length;

                    let success = 0;
                    let broken = 0;
                    if (icons && icons !== [] && icons.hasOwnProperty(idx)) {
                        submitBt.disableBt();
                        progress.parentElement.style.display = "block"
                        win.setModalContentSize(480, 320)
                        next = function () {
                            if (idx < size) {
                                $.get('index.php?controller=ajax&action=importSingleServerIcon&id=' + id + '&sid=' + sid + '&name=' + encodeURIComponent(icons[idx]["name"]) + '&src=' + encodeURIComponent(icons[idx]["src"]), function (data, status) {
                                    let {valid = false, error = ""} = data;
                                    valid === false ? broken++ : success++;
                                    next();
                                });
                                if (icons[idx].hasOwnProperty("name")) {
                                    progress.nextElementSibling.firstElementChild.innerHTML = "../" + icons[idx]["name"] + " (" + (idx).toFixed(0) + "/" + size + ")";
                                }
                                progress.firstElementChild.firstElementChild.style.width = ((idx / size) * 100).toFixed(0) + "%";
                                progress.firstElementChild.firstElementChild.innerHTML = ((idx / size) * 100).toFixed(0) + "%";
                                idx++;
                            } else {

                                form.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Cache is being updated...'), {
                                    type: 'loading',
                                    position: 'top',
                                    noMargin: true
                                });

                                let prevIdx = (idx - 1).toFixed(0);
                                if (icons[prevIdx].hasOwnProperty("name")) {
                                    progress.nextElementSibling.firstElementChild.innerHTML = "../" + icons[prevIdx]["name"] + " (" + (idx).toFixed(0) + "/" + size + ")";
                                }

                                progress.firstElementChild.firstElementChild.style.width = ((idx / size) * 100).toFixed(0) + "%";
                                progress.firstElementChild.firstElementChild.innerHTML = ((idx / size) * 100).toFixed(0) + "%";
                                $.get('index.php?controller=ajax&action=refreshVirtualServerIcons&id=' + id + '&sid=' + sid, function (data, status) {
                                    let {valid = false, error = ""} = data;
                                    if (valid) {
                                        progress.parentElement.style.display = "none"
                                        win.setModalContentSize(480, 280)
                                        let type = "success";
                                        let message = "";
                                        let redirect = window.location.href;
                                        if (broken > 0 && success > 0) {
                                            type = "warning";
                                            message = success + " " + tjs.get("icons") + " " + tjs.get('successfully imported') + "/ " + broken + " " + tjs.get("icons") + " " + tjs.get("could not be imported");
                                        } else if (broken > 0) {
                                            type = "error";
                                            message = broken + " " + tjs.get("icons") + " " + tjs.get("could not be imported");
                                        } else {
                                            message = success + " " + tjs.get("icons") + " " + tjs.get('successfully imported');
                                        }
                                        form.removeBlockMessages({except: 'no-hide'}).blockMessage(message, {
                                            type: type,
                                            position: 'top',
                                            noMargin: true
                                        });

                                        win.addButtons({
                                            'Close & Refresh': function (win) {
                                                if (redirect.indexOf("?") > -1) {
                                                    window.location.href = redirect + "&cache=update&cache_id=" + default_cache_id;
                                                } else {
                                                    window.location.href = redirect + "?cache=update&cache_id=" + default_cache_id;
                                                }
                                            }
                                        }, true);

                                    } else {
                                        form.removeBlockMessages({except: 'no-hide'}).blockMessage(error, {
                                            type: 'error',
                                            position: 'top',
                                            noMargin: true
                                        });
                                    }
                                });
                                submitBt.enableBt();
                            }
                        }
                        next();
                    }
                })
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-confirm').click(function (event) {
    event.preventDefault();

    var link = $(this).attr("href");

    $.modal({
        content: '<p><div class="warnings align-center"><b>' + tjs.get("Do you really want to do this?") + '</b></div></p>',
        title: tjs.get('Confirm'),
        draggable: true,
        closeButton: false,
        maxWidth: 280,
        buttons: {
            'Continue': function (win) {
                document.location.href = link;
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-confirm-tpl').click(function (event) {
    event.preventDefault();

    var link = $(this).attr("href");
    var tpl_name = $(this).html();

    $.modal({
        content: '<p><div class="warnings align-center"><b>' + tjs.get("Are you sure you want to create a virtual server from this template?") + '</b></div></p>',
        title: tpl_name,
        draggable: true,
        closeButton: false,
        maxWidth: 280,
        buttons: {
            'Continue': function (win) {
                document.location.href = link;
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-confirm-submit').click(function (event) {
    event.preventDefault();

    var form = $(this).parents('form');

    $.modal({
        content: '<p><div class="warnings align-center"><b>' + tjs.get("Do you really want to do this?") + '</b></div></p>',
        title: tjs.get('Confirm'),
        draggable: true,
        closeButton: false,
        maxWidth: 280,
        buttons: {
            'Continue': function (win) {
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-edit-account').click(function (event) {
    event.preventDefault();

    var redirect = encodeURIComponent($(this).attr('href'));

    $.modal({
        title: tjs.get('Edit Profile'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=accountEdit&redirect=" + redirect,
        width: 480,
        height: 540,
        buttons: {
            'Save': function (win) {
                var form = win.getModalContentBlock().find('form');
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-add-account').click(function (event) {
    event.preventDefault();

    $.modal({
        title: tjs.get('Add Webuser'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=accountCreate",
        width: 640,
        height: 520,
        complete: function () {
            let oDropdown = $('#lang');
            oDropdown.msDropDown().data("dd");
        },
        buttons: {
            'Save & Proceed': function (win) {
                var form = win.getModalContentBlock().find('form');
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-add-reseller').click(function (event) {
    event.preventDefault();

    $.modal({
        title: tjs.get('Add Reseller'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=reseller&action=modalResellerCreate",
        width: 640,
        height: 520,
        complete: function () {
            let oDropdown = $('#lang');
            oDropdown.msDropDown().data("dd");
        },
        buttons: {
            'Save & Proceed': function (win) {
                var form = win.getModalContentBlock().find('form');
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-edit-reseller').click(function (event) {
    event.preventDefault();

    var uid = $(this).attr("data-uid");

    $.modal({
        title: tjs.get('Edit Reseller'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=reseller&action=modalResellerSaEdit&uid=" + encodeURIComponent(btoa(uid)),
        width: 640,
        height: 520,
        complete: function () {
            let oDropdown = $('#lang');
            oDropdown.msDropDown().data("dd");
        },
        buttons: {
            'Save & Proceed': function (win) {
                var form = win.getModalContentBlock().find('form');
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-edit-webuser').click(function (event) {
    event.preventDefault();

    var uid = $(this).attr("data-uid");

    $.modal({
        title: tjs.get('Edit Webuser'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=accountSaEdit&uid=" + encodeURIComponent(btoa(uid)),
        width: 640,
        height: 520,
        complete: function () {
            let oDropdown = $('#lang');
            oDropdown.msDropDown().data("dd");
        },
        buttons: {
            'Save & Proceed': function (win) {
                var form = win.getModalContentBlock().find('form');
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-simple-bots-log').click(function (event) {
    event.preventDefault();

    var url = $(this).attr('href');
    var id = $(this).attr('data-id');
    var sid = $(this).attr('data-sid');

    $.modal({
        title: tjs.get('Simple Bots Error Log'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=simpleBots&action=modalSimpleBotsLog&id=" + id + "&sid=" + sid,
        width: 640,
        height: 520,
        buttons: {
            'Clear Log': function (win) {
                document.location.href = url + "&cSimpleBotsLogs=true";
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});

/**
 *
 */
$('.modal-simple-bots-settings').click(function (event) {
    event.preventDefault();

    var url = $(this).attr('href');
    var id = $(this).attr('data-id');
    var sid = $(this).attr('data-sid');

    $.modal({
        title: tjs.get('Simple Bots Configuration'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=simpleBots&action=modalSimpleBotsConfig&id=" + id + "&sid=" + sid + "&redirect=" + encodeURIComponent(url),
        width: 640,
        height: 550,
        buttons: {
            'Save & Proceed': function (win) {
                var form = win.getModalContentBlock().find('form');
                form.submit();
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
});