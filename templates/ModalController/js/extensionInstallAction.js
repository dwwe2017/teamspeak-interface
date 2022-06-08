$(document).ready(function()
{
    $('#extension').change(function()
    {
        let label = $(this).next('label');

        label.html(tjs.get('Choose an extension/update package'));

        $('#serial_key').val('');

        $(this).parents('form').extensionInfo('', function()
        {
            let name = this.name;
            let version = this.version;
            let serial_key = this.serial_key;

            label.html(name + ' ' + version);

            if(serial_key.lenght !== 0)
            {
                $('#serial_key').val(serial_key);
            }
        });
    });

    $('#extension-add-block').find('form').submit(function(event){
        event.preventDefault();
    });
});