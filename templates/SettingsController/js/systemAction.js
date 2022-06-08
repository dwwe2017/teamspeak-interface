$(document).ready(function()
{
    let controls_tabs_first = $('ul.controls-tabs:first');

    controls_tabs_first.find('li').click(function(){
        let id = $(this).children('a:first').attr('href');
        if($(id).is('form')){
            $('button[type=submit]').enableBt();
            $('button[type=reset]').enableBt();
        }else{
            $('button[type=submit]').disableBt();
            $('button[type=reset]').disableBt();
        }
    });

    controls_tabs_first.find('li.current:first').click();

    $('button[type=submit]').click(function(event){
        event.preventDefault();
        let current_tab = $(document).find('ul.controls-tabs:first').find('li.current:first');
        let tab_id = current_tab.children('a:first').attr('href');
        let form = $(tab_id);
        form.length === 0 || form.submit();
    });

    $('button[type=reset]').click(function(event){
        event.preventDefault();
        let current_tab = $(document).find('ul.controls-tabs:first').find('li.current:first');
        let tab_id = current_tab.children('a:first').attr('href');
        let form = $(tab_id);
        form.length === 0 || form[0].reset();
    });

    let $csr_auth = $('#cache-settings-auth'),
        $csr_db = $('#cache-settings-db'),
        $csr_main = $('#cache-settings'),
        $csr_host = $('#cache-settings-connect-host'),
        $csr_port = $('#cache-settings-connect-port'),
        $csr_timeout = $('#cache-settings-timout'),
        $csr_user = $('#cache-settings-auth-user'),
        $rcoc_auth = $('#cache-options-checkbox-auth'),
        $rcoc_ssl = $('#cache-options-checkbox-ssl'),
        $rcoc_persistent = $('#cache-options-checkbox-persistent'),
        $rcoc_compression = $('#cache-options-checkbox-compression'),
        $rcoc_logging = $('#cache-options-checkbox-logging');

    let handleSettings = function($objekt,$init)
    {
        let cache_options_checkbox = $('#cache-options-checkbox-0');
        let selected = $objekt.find('option:selected');
        let $show = selected.data('settings');
        let $type = selected.data('type');

        if($init) {
            cache_options_checkbox.change(function () {
                if (cache_options_checkbox.prop('checked')) {
                    $csr_auth.show();
                } else {
                    $csr_auth.hide();
                    $('#cache-user').val('');
                    $('#cache-pwd').val('');
                }
            });
        }

        //Show / Hidden Settings
        if($show === "show") {
            $csr_main.show();
        } else {
            $csr_main.hide();
        }

        for (let i = 1; i < 6; i++) {
            if(!$init) {
                $('#cache-options-checkbox-' + i).removeAttr('checked');
            }
        }

        switch ($type) {
            case 1: //Host/Port/Persistent/Timeout/Logging/Compress
                $csr_auth.hide();
                $csr_db.hide();
                $csr_host.show();
                $csr_port.show();
                $csr_timeout.show();
                $rcoc_auth.hide();
                $rcoc_ssl.hide();
                $rcoc_persistent.show();
                $rcoc_compression.show();
                $rcoc_logging.hide();
                break;
            case 2: //Couchbase
                if(cache_options_checkbox.prop('checked')) {
                    $csr_auth.show();
                } else {
                    $csr_auth.hide();
                }

                $csr_host.show();
                $csr_port.hide();
                $csr_timeout.hide();
                $csr_db.show();
                $rcoc_auth.show();
                $rcoc_ssl.show();
                $rcoc_persistent.hide();
                $rcoc_compression.hide();
                $rcoc_logging.hide();
                break;
            case 3: //Logging/Compress
                $csr_auth.hide();
                $csr_db.hide();
                $csr_host.hide();
                $csr_port.hide();
                $csr_timeout.hide();
                $rcoc_auth.hide();
                $rcoc_ssl.hide();
                $rcoc_persistent.hide();
                $rcoc_compression.show();
                $rcoc_logging.hide();
                break;
            case 4:
                if(cache_options_checkbox.prop('checked')) {
                    $csr_auth.show();
                } else {
                    $csr_auth.hide();
                }

                $csr_host.show();
                $csr_port.show();
                $csr_timeout.show();
                $csr_db.show();
                $rcoc_auth.show();
                $rcoc_ssl.show();
                $rcoc_persistent.hide();
                $rcoc_compression.show();
                $rcoc_logging.hide();
                break;
            case 5: //Without username
                if(cache_options_checkbox.prop('checked')) {
                    $csr_auth.show();
                } else {
                    $csr_auth.hide();
                }

                $csr_user.hide();
                $csr_host.show();
                $csr_port.show();
                $csr_timeout.show();
                $csr_db.show();
                $rcoc_auth.show();
                $rcoc_ssl.hide();
                $rcoc_persistent.show();
                $rcoc_compression.hide();
                $rcoc_logging.hide();
                break;
        }
    };

    let cache_driver = $('#cacheDriver');

//Init
    handleSettings(cache_driver,true);

//OnChange
    cache_driver.change(function() {
        handleSettings($(this),false);
    });
});