$(document).ready(function () {
    $('#instance_icon').change(function () {
        let prev = $(this).find("option:selected").attr("data-prev");

        $('#instance_icon_preview').attr("src", prev);

    }).trigger("change");

    $('#instance-edit-form').submit(function (event) {
        event.preventDefault();

        var id = $('#instance-edit-id').val();
        var server_ip = btoa($('#server-ip').val());
        var query_port = btoa($('#query-port').val());
        var label = btoa(encodeURIComponent($('#label').val()));
        var serveradmin = btoa($('#serveradmin').val());
        var password = btoa($('#server-pass').val());
        var custom_icon = btoa($('#instance_icon').val());

        var athp_link_el = $('#athp_link');
        var tls_el = $('#tls');

        var athp_link = athp_link_el.length ? btoa(athp_link_el.val()) : btoa('');
        var tls = tls_el.length ? (tls_el.prop('checked') ? 1 : 0) : 0;

        var block = $('#server-block');
        block.parent().scrollTop(0);

        if (!id || id.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Entity id is missing'), {type: 'warning'});
        } else if (!server_ip || server_ip.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Please enter the server ip address'), {type: 'warning'});
        } else if (!query_port || query_port.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Please enter the server query port'), {type: 'warning'});
        } else if (!serveradmin || serveradmin.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Please enter username for query access'), {type: 'warning'});
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
                id: id,
                server_ip: server_ip,
                query_port: query_port,
                label: label,
                serveradmin: serveradmin,
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
                        var receiveTimer = new Date().getTime();
                        if (receiveTimer - sendTimer < 500) {
                            setTimeout(function () {
                                block.removeBlockMessages().blockMessage(tjs.get('Instance changes successfully saved'), {type: 'success'});

                                if (data.redirect) {
                                    document.location.href = data.redirect;
                                    submitBt.enableBt();
                                } else {
                                    submitBt.enableBt();
                                }

                            }, 500 - (receiveTimer - sendTimer));
                        } else {
                            block.removeBlockMessages().blockMessage(tjs.get('Instance changes successfully saved'), {type: 'success'});

                            if (data.redirect) {
                                document.location.href = data.redirect;
                                submitBt.enableBt();
                            } else {
                                submitBt.enableBt();
                            }
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