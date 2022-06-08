(function ($) {

    /**
     *
     * @param options
     * @param callback
     */
    $.fn.simpleBotRun = function simpleBotRun(options, callback) {

        // These are the defaults.
        var settings = $.extend({
            a: '',
            id: '',
            sid: '',
            button: this
        }, options );

        var button = $(settings.button);

        if (!settings.id || settings.id.length === 0)
        {
            $.modal({
                content: '<p><div class="warnings align-center"><b>' + tjs.get('Entity id is missing') + '</b></div></p>',
                title: tjs.get('Attention'),
                draggable: true,
                closeButton: false,
                maxWidth: 280,
                buttons: {
                    'Close': function (win) {
                        win.closeModal();
                    }
                }
            });
        }
        else if (!settings.sid || settings.sid.length === 0)
        {
            $.modal({
                content: '<p><div class="warnings align-center"><b>' + tjs.get('Virtual server id is missing') + '</b></div></p>',
                title: tjs.get('Attention'),
                draggable: true,
                closeButton: false,
                maxWidth: 280,
                buttons: {
                    'Close': function (win) {
                        win.closeModal();
                    }
                }
            });
        }
        else
        {

            // Target url
            var target = 'index.php?controller=ajax&action=runSimpleBot';
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
                                if(typeof callback === 'function'){
                                    callback.call(data);
                                }
                            }, 500-(receiveTimer-sendTimer));
                        }
                        else
                        {
                            if(typeof callback === 'function'){
                                callback.call(data);
                            }
                        }
                    }
                    else if(data.error)
                    {
                        if(button.attr('data-status') > '0'){
                            $.modal({
                                content: '<p><div class="warnings align-center"><b>' + data.error || tjs.get('An unexpected error occurred, please try again') + '</b></div></p>',
                                title: tjs.get('Attention'),
                                draggable: true,
                                closeButton: false,
                                maxWidth: 280,
                                buttons: {
                                    'Close': function (win) {
                                        win.closeModal();
                                    }
                                }
                            });
                        }

                        if(typeof callback === 'function'){
                            callback.call(data);
                        }
                    }
                    else if(data.warning)
                    {
                        if(button.attr('data-status') > '0'){
                            $.modal({
                                content: '<p><div class="warnings align-center"><b>' + data.warning || tjs.get('An unexpected error occurred, please try again') + '</b></div></p>',
                                title: tjs.get('Attention'),
                                draggable: true,
                                closeButton: false,
                                maxWidth: 280,
                                buttons: {
                                    'Close': function (win) {
                                        win.closeModal();
                                    }
                                }
                            });
                        }

                        if(typeof callback === 'function'){
                            callback.call(data);
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown)
                {
                    /*
                    if(typeof callback === 'function'){
                        callback.call(button);
                    }
                    */
                }
            });
        }
    };

}(jQuery));