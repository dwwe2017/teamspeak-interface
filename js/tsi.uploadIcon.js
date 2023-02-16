(function ($) {

    /**
     * 
     * @param options
     * @param callback
     */
    $.fn.tsiUploadIcon = function tsiUploadIcon(options, callback) {

        // These are the defaults.
        var settings = $.extend({
            a: '',
            noMargin: true
        }, options );

        var form = this;

        // Target url
        var target = 'index.php?controller=ajax&action=tsiUploadIcon';
        if (!target || target === '')
        {
            target = document.location.href.match(/^([^#]+)/)[1];
        }

        data = new FormData(form[0]);
        data.append('a', settings.a);

        // Start timer
        var sendTimer = new Date().getTime();

        $.ajax({
            url: target,
            dataType: 'json',
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            success: function(data, textStatus, XMLHttpRequest)
            {
                if (data.valid)
                {
                    var receiveTimer = new Date().getTime();
                    if (receiveTimer-sendTimer < 500)
                    {
                        setTimeout(function()
                        {
                            form.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Icon successfully uploaded'), {type: 'success', position: 'top', noMargin: settings.noMargin});

                        }, 500-(receiveTimer-sendTimer));
                    }
                    else
                    {
                        form.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Icon successfully uploaded'), {type: 'success', position: 'top', noMargin: settings.noMargin});
                    }

                    if(typeof callback === 'function'){
                        callback.call(data);
                    }

                }
                else if(data.error)
                {
                    form.removeBlockMessages({except: 'no-hide'}).blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error', position: 'top', noMargin: settings.noMargin});
                }
                else if(data.warning)
                {
                    form.removeBlockMessages({except: 'no-hide'}).blockMessage(data.warning || tjs.get('An unexpected error occurred, please try again'), {type: 'warning', position: 'top', noMargin: settings.noMargin});
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown)
            {
                form.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error', position: 'top', noMargin: settings.noMargin});
            }
        });

        form.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Please wait, sending data to server...'), {type: 'loading', position: 'top', noMargin: settings.noMargin});
    }

}(jQuery));