/**
 * 
 * @param id
 * @param sid
 * @param clid
 * @returns {boolean}
 */
function clientBan(id, sid, clid) {

    var block = $('#tsi-viewer-block');
    var a = "";
    var minutes = parseInt(prompt("TIME FOR BANN IN MINUTES (0 = FOREVER)", "60"), 10);
    var reasonmsg = prompt("REASON MESSAGE (optional)", "Bye bye");

    if (!id || id.length === 0)
    {
        block.removeBlockMessages().blockMessage(tjs.get('Entity id is missing'), {type: 'warning', position: 'top'});
    }
    else if (!sid || sid.length === 0)
    {
        block.removeBlockMessages().blockMessage(tjs.get('Virtual server id is missing'), {type: 'warning', position: 'top'});
    }
    else if (!clid || clid.length === 0)
    {
        block.removeBlockMessages().blockMessage(tjs.get('Client id is missing'), {type: 'warning', position: 'top'});
    }
    else if (!reasonmsg)
    {
        block.removeBlockMessages().blockMessage(tjs.get('Create ban aborted'), {type: 'warning', position: 'top'});
    }
    else if (!minutes)
    {
        block.removeBlockMessages().blockMessage(tjs.get('Create ban aborted'), {type: 'warning', position: 'top'});
    }
    else
    {

        // Target url
        var target = 'index.php?controller=ajax&action=clientBann';
        if (!target || target === '')
        {
            // Page url without hash
            target = document.location.href.match(/^([^#]+)/)[1];
        }

        // Request
        var data = {
            a: a,
            id: id,
            sid: sid,
            clid: clid,
            minutes: minutes,
            reasonmsg: reasonmsg
        };

        // Start timer
        var sendTimer = new Date().getTime();

        // Send
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
                            block.removeBlockMessages().blockMessage(tjs.get('Bann created successfully'), {type: 'success', position: 'top'});

                        }, 500-(receiveTimer-sendTimer));
                    }
                    else
                    {
                        block.removeBlockMessages().blockMessage(tjs.get('Bann created successfully'), {type: 'success', position: 'top'});
                    }

                    $('#tsi-viewer-block').find('.tsi-viewer-refresh:first').click();

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

        // Message
        block.removeBlockMessages().blockMessage(tjs.get('Please wait, processing...'), {type: 'loading', position: 'top'});
        return true;
    }
}