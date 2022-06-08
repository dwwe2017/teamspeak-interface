(function ($) {

    /**
     *
     * @param options
     */
    $.fn.tsiCronjobEdit = function tsiCronjobEdit(options) {

        // These are the defaults.
        var settings = $.extend({
            a: '',
            cronjobId: $('#cronjobId').val(),
            namespace: $('#namespace').val(),
            class: $('#class').val(),
            method: $('#method').val(),
            expression: $('#expression').val(),
            description: $('#description').val(),
            redirect: $('#redirect').val(),
            active: $('#active').is(':checked') ? '1' : '0',
            block: this
        }, options );

        var block = settings.block;

        if (!settings.cronjobId || settings.cronjobId.length === 0)
        {
            block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Cronjob id is missing'), {type: 'warning', position: 'top'});
        }
        else if (!settings.namespace || settings.namespace.length === 0)
        {
            block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Namespace is missing'), {type: 'warning', position: 'top'});
        }
        else if (!settings.class || settings.class.length === 0)
        {
            block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Class is missing'), {type: 'warning', position: 'top'});
        }
        else if (!settings.method || settings.method.length === 0)
        {
            block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Method is missing'), {type: 'warning', position: 'top'});
        }
        else if (!settings.expression || settings.expression.length === 0)
        {
            block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Cron expression is missing'), {type: 'warning', position: 'top'});
        }
        else if (!settings.description || settings.description.length === 0)
        {
            block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Description is missing'), {type: 'warning', position: 'top'});
        }
        else
        {
            var target = block.attr("action");
            if (!target || target === '')
            {
                target = document.location.href.match(/^([^#]+)/)[1];
            }

            // Request
            var data = {
                a: settings.a,
                cronjobId: settings.cronjobId,
                namespace: settings.namespace,
                class: settings.class,
                method: settings.method,
                expression: settings.expression,
                description: settings.description,
                redirect: settings.redirect,
                active: settings.active
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
                                block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Changes saved successfully'), {type: 'success', position: 'top'});
                                document.location.href = data.redirect;

                            }, 500-(receiveTimer-sendTimer));
                        }
                        else
                        {
                            block.removeBlockMessages({ except: 'no-hide' }).blockMessage(tjs.get('Changes saved successfully'), {type: 'success', position: 'top'});
                            document.location.href = data.redirect;
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