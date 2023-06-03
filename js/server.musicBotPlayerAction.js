(function ($) {

    /**
     *
     * @param options
     * @param callback
     */
    $.fn.musicBotPlayerAction = function musicBotPlayerAction(options, callback) {

        // These are the defaults.
        var settings = $.extend({
            a: '',
            id: '',
            sid: '',
            cldbid: '',
            player_action: $(this).attr('data-action'),
            block: '#client-properties'
        }, options );

        var block_action = settings.player_action !== "refresh";
        var block = $(settings.block);
        var item = this;

        if (!settings.id || settings.id.length === 0)
        {
            !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Entity id is missing'), {type: 'warning', position: 'current'});
        }
        else if (!settings.sid || settings.sid.length === 0)
        {
            !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Virtual server id is missing'), {type: 'warning', position: 'current'});
        }
        else if (!settings.cldbid || settings.cldbid.length === 0)
        {
            !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Client database id is missing'), {type: 'warning', position: 'current'});
        }
        else if (!settings.player_action || settings.player_action.length === 0)
        {
            !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Action is missing'), {type: 'warning', position: 'current'});
        }
        else
        {
            var target = 'index.php?controller=ajax&action=musicBotPlayerAction';
            if (!target || target === '')
            {
                target = document.location.href.match(/^([^#]+)/)[1];
            }

            var data = {
                a: settings.a,
                id: settings.id,
                sid: settings.sid,
                cldbid: settings.cldbid,
                player_action: settings.player_action
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
                        var receiveTimer = new Date().getTime();

                        if (receiveTimer-sendTimer < 500)
                        {
                            setTimeout(function()
                            {
                                !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Action executed successfully'), {type: 'success', position: 'current'});

                            }, 500-(receiveTimer-sendTimer));
                        }
                        else
                        {
                            !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Action executed successfully'), {type: 'success', position: 'current'});
                        }

                        if(typeof callback === 'function'){
                            callback.call(data);
                        }
                    }
                    else if(data.error)
                    {
                        !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error', position: 'current'});
                    }
                    else if(data.warning)
                    {
                        !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(data.warning || tjs.get('An unexpected error occurred, please try again'), {type: 'warning', position: 'current'});
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown)
                {
                    !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error', position: 'current'});
                }
            });

            !block_action || block.removeBlockMessages({except: 'table-message'}).blockMessage(tjs.get('Please wait, processing...'), {type: 'loading', position: 'current'});
        }
    };

}(jQuery));