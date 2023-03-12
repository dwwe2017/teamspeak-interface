(function ($) {

    /**
     *
     * @param options
     * @param callback
     */
    $.fn.serverServergroupEdit = function serverServergroupEdit(options, callback) {

        // These are the defaults.
        var settings = $.extend({
            a: $('#a').val(),
            id: $('#id').val(),
            sid: $('#sid').val(),
            sgid: $('#sgid').val(),
            name: $('#sgname').val(),
            block: this
        }, options );

        var block = $(settings.block);

        if (!settings.id || settings.id.length === 0)
        {
            block.removeBlockMessages().blockMessage(tjs.get('Entity id is missing'), {type: 'warning', position: 'top'});
        }
        else if (!settings.sid || settings.sid.length === 0)
        {
            block.removeBlockMessages().blockMessage(tjs.get('Virtual server id is missing'), {type: 'warning', position: 'top'});
        }
        else if (!settings.sgid || settings.sgid.length === 0)
        {
            block.removeBlockMessages().blockMessage(tjs.get('Servergroup id is missing'), {type: 'warning', position: 'top'});
        }
        else if (!settings.name || settings.name.length === 0)
        {
            block.removeBlockMessages().blockMessage(tjs.get('Servergroup name is missing'), {type: 'warning', position: 'top'});
        }
        else
        {
            // Target url
            var target = 'index.php?controller=ajax&action=sgEdit';
            if (!target || target === '')
            {
                target = document.location.href.match(/^([^#]+)/)[1];
            }

            // Request
            var data = {
                a: settings.a,
                id: settings.id,
                sid: settings.sid,
                sgid: settings.sgid,
                name: settings.name
            };

            // Start timer
            var sendTimer = new Date().getTime();

            $.ajax({
                url: target,
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function(data, textStatus, XMLHttpRequest)
                {
                    if (data.valid)
                    {
                        // Small timer to allow the 'cheking' message to show when server is too fast
                        var receiveTimer = new Date().getTime();

                        if (receiveTimer-sendTimer < 500)
                        {
                            setTimeout(function()
                            {
                                document.location.href = data.redirect;

                            }, 500-(receiveTimer-sendTimer));
                        }
                        else
                        {
                            document.location.href = data.redirect;
                        }

                        if (typeof callback === 'function') {
                            callback.call(block);
                        }
                    }
                    else if(data.error)
                    {
                        block.removeBlockMessages().blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error', position: 'top'});
                    }
                    else if(data.warning)
                    {
                        block.removeBlockMessages().blockMessage(data.warning || tjs.get('An unexpected error occurred, please try again'), {type: 'warning', position: 'top'});
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown)
                {
                    block.removeBlockMessages().blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error', position: 'top'});
                }
            });

            block.removeBlockMessages().blockMessage(tjs.get('Please wait, processing...'), {type: 'loading', position: 'top'});
        }
    };

}(jQuery));