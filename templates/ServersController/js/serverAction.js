$(document).ready(function ()
{
    $(document).ready(function()
    {
        $('#ajax-image-container').loadWithEffect('index.php?controller=ajax&action=serverImage', { 'id': id, 'sid': sid});

        $('#upload-hostbanner').change(function(event)
        {
            event.preventDefault();

            let form = $('#ajax-upload-hostbanner');

            form.serverHostbannerUpload({ 'id': id, 'sid': sid}, function()
            {
                $('#ajax-image-container').loadWithEffect('index.php?controller=ajax&action=serverImage', { 'id': id, 'sid': sid}, function(){
                    setTimeout(function(){
                        form.removeBlockMessages({except: 'no-hide'});
                    },1000);
                });
            });
        });

        $('.ajax-virtualserver-status-toggle:first').click(function(event)
        {
            event.preventDefault();

            let block = $('#ajax-upload-hostbanner');

            $(this).serverSetStatus({ 'block': block, 'id': id, 'sid': sid, 'position': 'top'}, function()
            {
                this.find('span').toggle();

                setTimeout(function()
                {
                    block.removeBlockMessages({except: 'no-hide'});
                },1000);
            });
        });
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
    })
});