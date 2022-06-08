$(document).ready(function () {
    let cid_channelBrowse = source.cid_channelBrowse;
    let fcount_channelBrowse = source.fcount_channelBrowse;
    let tsi_virtualserver_files_download = source.tsi_virtualserver_files_download;
    let tsi_virtualserver_files_delete = source.tsi_virtualserver_files_delete;

    let a_ts_file_el = $('a.ts-file');

    a_ts_file_el.bind('contextMenu', function (event, list) {
        let cid = $(this).attr('data-cid');
        let fkey = $(this).attr('id');

        if (tsi_virtualserver_files_download === 1) {
            list.push({
                text: tjs.get('Download'),
                link: 'javascript:void(0)',
                onclick: "fileDownload('" + id + "', '" + sid + "', '" + cid + "', '" + fkey + "');",
                icon: 'down'
            });
            list.push(false);
        }

        if (tsi_virtualserver_files_delete === 1) {
            list.push({
                text: tjs.get('Delete'),
                link: 'javascript:void(0)',
                onclick: "fileDelete('" + id + "', '" + sid + "', '" + cid + "', '" + fkey + "');",
                icon: 'delete'
            });
        }
    });

    a_ts_file_el.draggable({
        helper: 'clone'
    });

    $('#message-files-found').html('<li>' + fcount_channelBrowse + ' ' + tjs.get(" files found") + '</li>');

    $('.png, .jpg, .jpeg, .gif, .bmp').click(function () {

        $.modal({
            title: tjs.get('Image Preview'),
            draggable: true,
            closeButton: true,
            url: 'index.php?controller=modal&action=imagePrev&id=' + id + '&sid=' + sid + '&cid=' + $(this).attr('data-cid') + '&fkey=' + $(this).attr('id'),
            width: 900,
            height: 530
        });

    });

    $('.modal-upload-to-channel').click(function () {

        $.modal({
            title: 'Upload Files To Channel',
            draggable: true,
            closeButton: true,
            url: 'index.php?controller=modal&action=filesUpload&id=' + id + '&sid=' + sid + '&cid=' + cid_channelBrowse,
            buttons:
                {
                    'Upload': function (win) {
                        let form = win.getModalContentBlock().find('form');
                        form.fileUpload({'id': id, 'sid': sid, 'cid': cid_channelBrowse}, function () {
                                let folder = parent.$('#tsi-file-browser-block').find('a[id="' + cid_channelBrowse + '"]').children('span');

                                folder.click();

                                if (!folder.children('b').length) {
                                    folder.wrapInner('<b></b>');
                                }
                            }
                        );
                    },
                    'Close': function (win) {
                        win.closeModal();
                    }
                }
        });

    });

    $('.modal-upload-icons').click(function () {
        $.modal({
            title: tjs.get('Upload Icons To Server'),
            draggable: true,
            closeButton: true,
            url: 'index.php?controller=modal&action=iconsUpload&id=' + id + '&sid=' + sid + '',
            buttons:
                {
                    'Upload': function (win) {
                        let form = win.getModalContentBlock().find('form');
                        form.iconUpload(
                            {'id': id, 'sid': sid}, function () {
                                let folder = parent.$('#tsi-file-browser-block').find('a[id=0]').children('span');
                                folder.click();
                                if (!folder.children('b').length) {
                                    folder.wrapInner('<b></b>');
                                }
                            }
                        );
                    },
                    'Close': function (win) {
                        win.closeModal();
                    }
                }
        });

    });

    $('.modal-transfer-sys-icons').click(function () {
        let progress;

        $.modal({
            title: tjs.get('Transfer TSI Icons'),
            draggable: true,
            closeButton: true,
            url: 'index.php?controller=modal&action=iconsTransfer&id=' + id + '&sid=' + sid + '',
            complete: function () {
                progress = document.getElementById("icon-transfer-progress");
                let {icons_transfer_max_file_uploads = 999999} = source;
                let sys_icons_transfer = $('#sys_icons_transfer');
                sys_icons_transfer.msDropDown().data("dd");
            },
            buttons:
                {
                    'Transfer': function (win) {
                        let form = win.getModalContentBlock().find('form');
                        form.iconTransfer(
                            {'id': id, 'sid': sid}, function () {
                                let {data, form} = this;
                                let {icons = []} = data;

                                let next;
                                let idx = 0;
                                let size = icons.length;

                                let success = 0;
                                let broken = 0;
                                if (icons && icons !== [] && icons.hasOwnProperty(idx)) {
                                    progress.parentElement.style.display = "block"
                                    next = function () {
                                        if (idx < size) {
                                            $.get('index.php?controller=ajax&action=pushIcon&id=' + id + '&sid=' + sid + '&from=' + encodeURIComponent(icons[idx]) + '&base64ToPng=true', function (data, status) {
                                                let {valid = false, error = ""} = data;
                                                valid === false ? broken++ : success++;
                                                next();
                                            });
                                            idx++;
                                            progress.firstElementChild.firstElementChild.style.width = ((idx / size) * 100).toFixed(0) + "%";
                                            progress.firstElementChild.firstElementChild.innerHTML = ((idx / size) * 100).toFixed(0) + "%";
                                        } else {
                                            $.get('index.php?controller=ajax&action=refreshVirtualServerIconFileList&id=' + id + '&sid=' + sid, function (data, status) {
                                                let {valid = false, error = ""} = data;
                                                if (valid) {
                                                    progress.parentElement.style.display = "none"
                                                    let type = "success";
                                                    let message = "";
                                                    let redirect = "";
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
                                                } else {
                                                    form.removeBlockMessages({except: 'no-hide'}).blockMessage(error, {
                                                        type: 'error',
                                                        position: 'top',
                                                        noMargin: true
                                                    });
                                                }
                                                let folder = parent.$('#tsi-file-browser-block').find('a[id=0]').children('span');
                                                folder.click();
                                                if (!folder.children('b').length) {
                                                    folder.wrapInner('<b></b>');
                                                }
                                            });
                                        }
                                    }
                                    next();
                                }
                            }
                        );
                    },
                    'Close': function (win) {
                        win.closeModal();
                    }
                }
        });

    });

    $(this).applyTemplateSetup();
});

/**
 *
 * @param id
 * @param sid
 * @param cid
 * @param fkey
 */
function fileDownload(id, sid, cid, fkey) {
    $('#tsi-file-browser-block').fileDownload(
        {'id': id, 'sid': sid, 'cid': cid, 'fkey': fkey}, function () {
            download($(this));
        });
}

/**
 *
 * @param id
 * @param sid
 * @param cid
 * @param fkey
 */
function fileDelete(id, sid, cid, fkey) {
    let tsi_files_el = $('#tsi-files');

    $('#tsi-file-browser-block').fileDelete(
        {'id': id, 'sid': sid, 'cid': cid, 'fkey': fkey}, function () {

            let folder = tsi_files_el.find('a[id="' + fkey + '"]').parent('li');
            folder.fadeOut('slow');

            let fcount = --(tsi_files_el.find('li:visible').length);
            $('#message-files-found').children('li').html(fcount + ' ' + tjs.get(' files found'));

            if (fcount < 2) {
                folder.children('b').contents().unwrap();
            }

            tsi_files_el.find('a.ts-file').each(function () {
                let cfkey = parseInt($(this).attr('id'));
                if (cfkey > fkey) {
                    $(this).attr('id', (cfkey - 1));
                }
            });
        });
}