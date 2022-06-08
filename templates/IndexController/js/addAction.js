$(document).ready(function()
{
    var oDropdown = $('#instance_icon').msDropDown().data("dd");

    $('#instance_icon').change(function ()
    {
        let prev = $(this).find("option:selected").attr("data-prev");

        $('#instance_icon_preview').attr("src", prev);
    });

    let favorites = $("ul.favorites");
    let btn_prev = favorites.find(".favorites-prev:first");
    let btn_next = favorites.find(".favorites-next:first");

    if(favorites.find("li:hidden").length > 0)
    {
        btn_next.show();
        btn_next.css("opacity", 0.7);
        btn_prev.show();
    }

    btn_next.click(function (event)
    {
        event.preventDefault();

        let btn_next = $(this);

        let opt_prev = favorites.find("li:visible:first");
        let opt_next = favorites.find("li:visible:last").next("li");

        if(opt_next.is(":hidden"))
        {
            opt_prev.hide();
            opt_next.show();
            btn_prev.css("opacity", 0.7);

            if(!opt_next.next("li").is(":hidden"))
            {
                btn_next.css("opacity", 0.0);
            }
        }
        else
        {
            btn_next.css("opacity", 0.0);
            btn_prev.css("opacity", 0.7);
        }
    });

    btn_prev.click(function (event)
    {
        event.preventDefault();

        let btn_prev = $(this);

        let opt_prev = favorites.find("li:visible:first").prev("li");
        let opt_next = favorites.find("li:visible:last");

        if(opt_prev.is(":hidden"))
        {
            opt_prev.show();
            opt_next.hide();
            btn_next.css("opacity", 0.7);

            if(!opt_prev.prev("li").is(":hidden"))
            {
                btn_prev.css("opacity", 0.0);
            }
        }
        else
        {
            btn_next.css("opacity", 0.7);
            btn_prev.css("opacity", 0.0);
        }
    });

    $('input[name=basis]').click(function()
    {
        if($(this).val() === 'ts3') {
            $('#tls').parent().parent().hide();
            $('#athp_link').parent().parent().show();
            $('#query-port').attr('placeholder', '10011');
        } else {
            $('#athp_link').parent().parent().hide();
            $('#tls').parent().parent().show();
            $('#query-port').attr('placeholder', '10101');
        }
    });

    $('#server-form').submit(function(event)
    {
        event.preventDefault();

        let basis = btoa($('input[name=basis]:checked').val());
        let server_ip = btoa($('#server-ip').val());
        let query_port = btoa($('#query-port').val());
        let serveradmin = $('#serveradmin').val();
        let password = btoa($('#server-pass').val());
        let import_icons = ($('#import-icons').prop('checked') === true);
        var custom_icon = btoa($('#instance_icon').val());

        let athp_link_el = $('#athp_link');
        let tls_el = $('#tls');

        let athp_link = athp_link_el.length ? btoa(athp_link_el.val()) : btoa('');
        let tls = tls_el.length ? (tls_el.prop('checked') ? 1 : 0) : 0;

        let block = $('#server-block');

        if (!serveradmin || serveradmin.length === 0)
        {
            block.removeBlockMessages().blockMessage(tjs.get('Please enter username for query access'), {type: 'warning'});
        }
        else if (serveradmin === 'serveradmin' && !confirm(tjs.get('You are about to add the instance as serveradmin (root), but it is recommended to use a custom query client for it! Do you want to continue at your own risk?')))
        {
            block.removeBlockMessages().blockMessage(tjs.get('Process canceled'), {type: 'warning'});
        }
        else if (!password || password.length === 0)
        {
            block.removeBlockMessages().blockMessage(tjs.get('Please enter password for query access'), {type: 'warning'});
        }
        else
        {
            let submitBt = $(this).find('button[type=submit]');
            submitBt.disableBt();

            let target = $(this).attr('action');
            if (!target || target === '')
            {
                target = document.location.href.match(/^([^#]+)/)[1];
            }

            let data = {
                a: $('#a').val(),
                basis: basis,
                server_ip: server_ip,
                query_port: query_port,
                serveradmin: btoa(serveradmin),
                password: password,
                athp_link: athp_link,
                tls: btoa(tls),
                custom_icon: custom_icon
            };

            let redirect = $('#redirect');
            if (redirect.length > 0)
            {
                data.redirect = redirect.val();
            }

            // Start timer
            let sendTimer = new Date().getTime();

            $.ajax({
                url: target,
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function(data)
                {
                    if (data.valid)
                    {
                        let redirect = data.redirect;
                        let id = data.id;
                        let options = { id: id };

                        let receiveTimer = new Date().getTime();
                        if (receiveTimer-sendTimer < 500)
                        {
                            setTimeout(function()
                            {
                                block.importPerms(options, function()
                                {
                                    if(import_icons)
                                    {
                                        block.instanceImportIcons(options, function()
                                        {
                                            oDropdown.destroy();

                                            document.location.href = redirect;

                                            submitBt.enableBt();
                                        });
                                    }
                                    else
                                    {
                                        oDropdown.destroy();

                                        document.location.href = redirect;

                                        submitBt.enableBt();
                                    }
                                });

                            }, 500-(receiveTimer-sendTimer));
                        }
                        else
                        {
                            block.importPerms(options, function()
                            {
                                if(import_icons)
                                {
                                    block.instanceImportIcons(options, function()
                                    {
                                        oDropdown.destroy();

                                        document.location.href = redirect;

                                        submitBt.enableBt();
                                    });
                                }
                                else
                                {
                                    oDropdown.destroy();

                                    document.location.href = redirect;

                                    submitBt.enableBt();
                                }
                            });
                        }
                    }
                    else
                    {
                        block.removeBlockMessages().blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error'});
                        submitBt.enableBt();
                    }
                },
                error: function()
                {
                    block.removeBlockMessages().blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error'});
                    submitBt.enableBt();
                }
            });

            block.removeBlockMessages().blockMessage(tjs.get('Please wait, checking...'), {type: 'loading'});
        }
    });
});