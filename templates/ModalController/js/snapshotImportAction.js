$(document).ready(function()
{
    $('#files').change(function()
    {
        let filename = $(this).val();
        let extension = filename.replace(/^.*\./, '');

        if (extension === filename)
        {
            extension = '';
        }
        else
        {
            extension = extension.toLowerCase();
            $('#en_type').find('option[value=' + extension + ']').attr('selected', true);
        }
    });
});