$(document).ready(function()
{
    $('#send-report').submit(function(event)
    {
        event.preventDefault();

        var confirm = window.confirm("Privacy Policy: The report contains only data that was optionally specified, such as: For example, the e-mail address or description of the error. Furthermore, information about the system and the cause of the error are transmitted. Further data will not be transmitted. A transfer to third parties under no circumstances. If you submit the form, you agree to the processing of this data for troubleshooting purposes.");

        if(confirm === true)
        {
            var submitBt = $(this).find('button[type=submit]');
            submitBt.disableBt();

            var target = $(this).attr('action');

            if (!target || target === '')
            {
                // Page url without hash
                target = document.location.href.match(/^([^#]+)/)[1];
            }

            var data = {
                a: $('#a').val(),
                report: $('#report').val(),
                description: $('#description').val(),
                sender: $('#sender').val()
            };

            $.ajax({
                url: target,
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function(data, textStatus, XMLHttpRequest)
                {
                    if (data.valid)
                    {
                        $('#send-report').removeBlockMessages().blockMessage('Report sent, thank you for your help!', {type: 'success'});
                    }
                    else
                    {
                        // Message
                        $('#send-report').removeBlockMessages().blockMessage('An unexpected error occurred, please try again', {type: 'error'});

                        submitBt.enableBt();
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown)
                {
                    // Message
                    $('#send-report').removeBlockMessages().blockMessage('Error while contacting server, please try again', {type: 'error'});

                    submitBt.enableBt();
                }
            });

            // Message
            $('#send-report').removeBlockMessages().blockMessage('Please wait, sending report...', {type: 'loading'});
        }
        else
        {
            return false;
        }
    });
});