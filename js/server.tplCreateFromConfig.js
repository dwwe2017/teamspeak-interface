(function ($) {

    /**
     *
     * @param options
     */
    $.fn.serverTplCreateFromConfig = function serverTplCreateFromConfig(options) {

        // These are the defaults.
        var settings = $.extend({
            a: '',
            id: '',
            sid: '',
            block: this
        }, options );

        var block = settings.block;

        if (!settings.id || settings.id.length === 0)
        {
            block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get(tjs.get('Entity id is missing')), {type: 'warning', position: 'top'});
        }
        else if (!settings.sid || settings.sid.length === 0)
        {
            block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Virtual server id is missing'), {type: 'warning', position: 'top'});
        }
        else
        {
            var target = "index.php?controller=ajax&action=serverTplCreateFromConfig";
            if (!target || target === '')
            {
                target = document.location.href.match(/^([^#]+)/)[1];
            }

            // Request
            var data = {
                a: settings.a,
                id: settings.id,
                sid: settings.sid
            };

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
                                block.removeBlockMessages({ except: 'no-hide' }).blockMessage(data.success || tjs.get('Template created successfully'), {type: 'success', position: 'top'});

                            }, 500-(receiveTimer-sendTimer));
                        }
                        else
                        {
                            block.removeBlockMessages({ except: 'no-hide' }).blockMessage(data.success || tjs.get('Template created successfully'), {type: 'success', position: 'top'});
                        }
                    }
                    else if(data.error)
                    {
                        block.removeBlockMessages({ except: 'no-hide' }).blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error', position: 'top'});
                    }
                    else if(data.warning)
                    {
                        block.removeBlockMessages({ except: 'no-hide' }).blockMessage(data.warning || tjs.get('An unexpected error occurred, please try again'), {type: 'warning', position: 'top'});
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown)
                {
                    block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error', position: 'top'});
                }
            });

            block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Please wait, processing...'), {type: 'loading', position: 'top'});
        }
    };

}(jQuery));