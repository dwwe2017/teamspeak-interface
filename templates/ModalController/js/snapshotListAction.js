$(document).ready(function () {
    let options = {
        id: id,
        sid: sid,
        block: $('#view-snapshots-block')
    };

    $('.ajax-delete-snapshot').click(function (event) {
        event.preventDefault();
        $(this).serverSnapshotDelete(options, function () {
            $(this).parent().parent().fadeOut();
        });
    });

    $('.ajax-deploy-snapshot').click(function (event) {
        event.preventDefault();
        $(this).serverSnapshotDeploy(options);
    });

    $('.ajax-deploy-snapshot-icons').click(function (event) {
        event.preventDefault();

        let options2 = {
            id: id,
            sid: sid,
            block: $('#view-snapshots-block'),
            target: 'index.php?controller=ajax&action=snapshotDeploy&icons=true'
        };

        $(this).serverSnapshotDeploy(options2, function () {
            let {data, block, item} = this;
            let {icons = []} = data;

            let element = document.getElementById(item[0].id);
            let loading = document.getElementById(item[0].id + "-loading");
            let tag = document.getElementById(item[0].id + "-tag");
            let progress = document.getElementById(item[0].id + "-progress");

            let next;
            let idx = 0;
            let size = icons.length;

            let success = 0;
            let broken = 0;

            if (icons && icons !== [] && icons.hasOwnProperty(idx)) {

                tag.style.display = "none";
                progress.style.display = "block"
                element.style.display = "none";
                loading.style.display = "unset";

                next = function () {
                    if (idx < size) {
                        $.get('index.php?controller=ajax&action=pushIcon&id=' + id + '&sid=' + sid + '&from=' + encodeURIComponent(icons[idx]), function (data, status) {
                            let {valid = false, error = ""} = data;
                            valid === false ? broken++ : success++;
                            next();
                        });
                        idx++;
                        progress.firstElementChild.firstElementChild.style.width = ((idx / size) * 100).toFixed(0) + "%";
                        progress.firstElementChild.firstElementChild.innerHTML = ((idx / size) * 100).toFixed(0) + "%";
                    } else {
                        $.get('index.php?controller=ajax&action=refreshVirtualServerIconFileList&id=' + id + '&sid=' + sid, function (data, status) {
                            element.style.display = "unset";
                            loading.style.display = "none";
                            let {valid = false, error = "", redirect = ""} = data;
                            if (valid) {
                                tag.style.display = "block";
                                progress.style.display = "none"
                                let type = "success";
                                let message = "";
                                if (broken > 0 && success > 0) {
                                    redirect = "";
                                    type = "warning";
                                    message = success + " " + tjs.get("icons") + " " + tjs.get('successfully imported') + "/ " + broken + " " + tjs.get("icons") + " " + tjs.get("could not be imported");
                                } else if (broken > 0) {
                                    redirect = "";
                                    type = "error";
                                    message = broken + " " + tjs.get("icons") + " " + tjs.get("could not be imported");
                                } else {
                                    message = success + " " + tjs.get("icons") + " " + tjs.get('successfully imported');
                                }
                                block.removeBlockMessages({except: 'table-message'}).blockMessage(message, {
                                    type: type,
                                    position: 'top'
                                });
                                if (redirect !== "") {
                                    setTimeout(function () {
                                        document.location.href = redirect;
                                    }, 1000);
                                }
                            } else {
                                block.removeBlockMessages({except: 'table-message'}).blockMessage(error, {
                                    type: 'error',
                                    position: 'top'
                                });
                            }
                        });
                    }
                }
                next();
            }
        });
    });

    $('.ajax-download-snapshot').click(function (event) {
        event.preventDefault();
        $(this).serverSnapshotDownload(options);
    });
});