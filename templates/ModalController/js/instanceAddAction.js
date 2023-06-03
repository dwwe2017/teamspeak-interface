$(document).ready(function () {
    $('#instance_icon').change(function () {
        let prev = $(this).find("option:selected").attr("data-prev");

        $('#instance_icon_preview').attr("src", prev);
    });

    $('input[name=basis]').click(function (event) {
        if ($(this).val() === 'ts3') {
            $('#tls').parent().parent().hide();
            $('#athp_link').parent().parent().show();
            $('#query-port').attr('placeholder', '10011');
        } else {
            $('#athp_link').parent().parent().hide();
            $('#tls').parent().parent().show();
            $('#query-port').attr('placeholder', '10101');
        }
    });

    $('#server-form').submit(function (event) {
        event.preventDefault();

        var basis = btoa($('input[name=basis]:checked').val());
        var server_ip = btoa($('#server-ip').val());
        var query_port = btoa($('#query-port').val());
        var label = btoa(encodeURIComponent($('#label').val()));
        var serveradmin = $('#serveradmin').val();
        var password = btoa($('#server-pass').val());
        var import_icons = ($('#import-icons').prop('checked') === true);
        var custom_icon = btoa($('#instance_icon').val());

        var athp_el = $('#athp_link');
        var tls_el = $('#tls');

        var athp_link = athp_el.length ? btoa(athp_el.val()) : btoa('');
        var tls = tls_el.length ? (tls_el.prop('checked') ? 1 : 0) : 0;

        var block = $('#server-block');
        block.parent().scrollTop(0);

        if (!serveradmin || serveradmin.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Please enter username for query access'), {type: 'warning'});
        } else if (serveradmin === 'serveradmin' && !confirm(tjs.get('You are about to add the instance as serveradmin (root), but it is recommended to use a custom query client for it! Do you want to continue at your own risk?'))) {
            block.removeBlockMessages().blockMessage(tjs.get('Process canceled'), {type: 'warning'});
        } else if (!password || password.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Please enter password for query access'), {type: 'warning'});
        } else {
            var submitBt = $('.block-footer.align-right').find('button[type=button]:first');
            submitBt.disableBt();

            var target = $(this).attr('action');
            if (!target || target === '') {
                target = document.location.href.match(/^([^#]+)/)[1];
            }

            var data = {
                a: $('#a').val(),
                basis: basis,
                server_ip: server_ip,
                query_port: query_port,
                label: label,
                serveradmin: btoa(serveradmin),
                password: password,
                athp_link: athp_link,
                tls: btoa(tls),
                custom_icon: custom_icon
            };

            var redirect = $('#redirect');
            if (redirect.length > 0) {
                data.redirect = redirect.val();
            }

            var sendTimer = new Date().getTime();

            $.ajax({
                url: target,
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function (data, textStatus, XMLHttpRequest) {
                    if (data.valid) {
                        var redirect = data.redirect;
                        var id = data.id;
                        var options = {id: id};

                        var receiveTimer = new Date().getTime();
                        if (receiveTimer - sendTimer < 500) {
                            setTimeout(function () {
                                block.importPerms(options, function () {
                                    if (import_icons) {
                                        block.instanceImportIcons(options, function () {
                                            document.location.href = redirect;
                                            submitBt.enableBt();
                                        });
                                    } else {
                                        document.location.href = redirect;
                                        submitBt.enableBt();
                                    }
                                });

                            }, 500 - (receiveTimer - sendTimer));
                        } else {
                            block.importPerms(options, function () {
                                if (import_icons) {
                                    block.instanceImportIcons(options, function () {
                                        document.location.href = redirect;
                                        submitBt.enableBt();
                                    });
                                } else {
                                    document.location.href = redirect;
                                    submitBt.enableBt();
                                }
                            });
                        }
                    } else if (data.error) {
                        block.removeBlockMessages().blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error'});
                        submitBt.enableBt();
                    } else if (data.warning) {
                        block.removeBlockMessages().blockMessage(data.warning || tjs.get('An unexpected error occurred, please try again'), {type: 'warning'});
                        submitBt.enableBt();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    block.removeBlockMessages().blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error'});
                    submitBt.enableBt();
                }
            });

            block.removeBlockMessages().blockMessage(tjs.get('Please wait, checking...'), {type: 'loading'});
        }
    });
});