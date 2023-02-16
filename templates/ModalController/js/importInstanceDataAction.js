$(document).ready(function()
{
    $('#import-form').submit(function(event)
    {
        event.preventDefault();

        var import_id = $('#import-id').val();
        if (!import_id || import_id.length === 0)
        {
            $('#import-block').removeBlockMessages().blockMessage(tjs.get('Entity id is missing'), {type: 'warning'});
        }
        else
        {
            var submitBt = $('.block-footer.align-right').find('button[type=button]:first');
            submitBt.disableBt();

            var target = $(this).attr('action');
            if (!target || target === '')
            {
                target = document.location.href.match(/^([^#]+)/)[1];
            }

            var data = {
                a: $('#a').val(),
                id: import_id
            };

            var redirect = $('#redirect');
            if (redirect.length > 0)
            {
                data.redirect = redirect.val();
            }

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
                                document.location.href = data.redirect;

                            }, 500-(receiveTimer-sendTimer));
                        }
                        else
                        {
                            document.location.href = data.redirect;
                        }
                    }
                    else if(data.error)
                    {
                        $('#import-block').removeBlockMessages().blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {type: 'error'});
                        submitBt.enableBt();
                    }
                    else if(data.warning)
                    {
                        $('#import-block').removeBlockMessages().blockMessage(data.warning || tjs.get('An unexpected error occurred, please try again'), {type: 'warning'});
                        submitBt.enableBt();
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown)
                {
                    $('#import-block').removeBlockMessages().blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error'});
                    submitBt.enableBt();
                }
            });

            $('#import-block').removeBlockMessages().blockMessage(tjs.get('Please wait, import is running...'), {type: 'loading'});
        }
    });
});