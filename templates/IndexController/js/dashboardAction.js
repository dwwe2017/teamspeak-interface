$(document).ready(function ()
{
    let is_allowed_instances_reseller_dashboard = source.is_allowed_instances_reseller_dashboard;

    let instances = $('ul.grid.dark-grey-gradient').find('.instance');

    $(".instance-reseller-selection").click(function (event)
    {
        event.preventDefault();

        let instance_reseller_id = $(this).find("a:first").attr("data-reseller-id");
        let instance_reseller_name = tjs.get("Filter") + ": " + $(this).find("a:first").html();

        let instance_reseller_info = $("#current-reseller-instances");

        if(instance_reseller_id !== "NaN")
        {
            instance_reseller_info.find("li:first").html(instance_reseller_name);
            instance_reseller_info.fadeIn("slow");

            instances.each(function ()
            {
                !$(this).hasClass(instance_reseller_id) ? $(this).parent("li").fadeOut("slow")
                    : $(this).parent("li").fadeIn("slow");
            })
        }
        else
        {
            instance_reseller_info.fadeOut("slow");

            instances.parent("li").fadeIn("slow");
        }
    });

    if(instances.length > 0)
    {
        instances.each(function()
        {
            $(this).instanceCheck();
        });
    }
    else if(is_allowed_instances_reseller_dashboard === 1)
    {
        $('.modal-instance-add:first').trigger('click');
    }

    $('.error-instance').click(function()
    {
        $(this).parent().parent().instanceCheck();
    });

    $('.ajax-refresh-instance-status:first').click(function(event)
    {
        event.preventDefault();

        $('ul.grid.dark-grey-gradient').find('.instance').each(function()
        {
            $(this).instanceCheck();
        });
    });

    $('.select-all').click(function()
    {
        $(this).parent().parent('form').find('input[type=checkbox]').each(function()
        {
            this.checked = true;
        });
    });

    $('.unselect-all').click(function()
    {
        $(this).parent().parent('form').find('input[type=checkbox]').each(function()
        {
            this.checked = false;
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
    });
});