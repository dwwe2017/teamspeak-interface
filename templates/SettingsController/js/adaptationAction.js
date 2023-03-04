function custom_icon_remove(file) {
    var element = $(document).find("img[data-id='" + file + "']:first");

    element.tsiDeleteIcon({element: element}, function () {
            element.fadeOut("slow");
        }
    );
}

$(document).ready(function () {
    $('#show-sys-icons').change(function () {
        let checked = $(this).prop("checked");

        if (checked) {
            $('.adaptation-icon[data-sys="1"]').fadeIn("slow");
        } else {
            $('.adaptation-icon[data-sys="1"]').fadeOut("slow");
        }
    });

    function ini_mouseover_icons() {
        $('.adaptation-icon').mouseover(function (event) {
            event.preventDefault();

            !$(this).hasClass("active")
                ? $(this).addClass("active") : null;

            if ($(this).attr("data-sys") === "0") {
                $(this).unbind("contextMenu");

                $(this).bind("contextMenu", function (event, list) {
                    list.push({
                        text: tjs.get("Delete"),
                        link: 'javascript:void(0)',
                        onclick: "custom_icon_remove('" + $(this).attr("data-id") + "');",
                        icon: 'delete'
                    });
                });
            }

        }).mouseout(function (event) {
            event.preventDefault();

            $(this).hasClass("active")
                ? $(this).removeClass("active") : null;

            if ($(this).attr("data-sys") === "0") {
                $(this).unbind("contextMenu");
            }
        });
    }

    ini_mouseover_icons();

    function jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let editor = ace.edit('custom_css', {
        mode: 'ace/mode/css',
        selectionStyle: 'text'
    });

    editor.setOptions({
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: true,
        fontSize: '14px'
    });

    editor.setOption('mergeUndoDeltas', 'always');
    editor.setTheme('ace/theme/chrome');

    let controls_tabs_first = $('ul.controls-tabs:first');

    controls_tabs_first.find('li').click(function () {
        let id = $(this).children('a:first').attr('href');
        let form = $(id).find('form');
        if (form.length === 0) {
            $('button[type=submit]').disableBt();
            $('button[type=reset]').disableBt();
        } else {
            $('button[type=submit]').enableBt();
            $('button[type=reset]').enableBt();
        }
    });

    controls_tabs_first.find('li.current:first').click();

    $('button[type=submit]').click(function (event) {
        event.preventDefault();

        if ($('#tab-css').is(':visible')) {
            $('#custom_css_copy').val(editor.getValue());
        }

        let current_tab = $(document).find('ul.controls-tabs:first').find('li.current:first');
        let tab_id = current_tab.children('a:first').attr('href');
        let form = $(tab_id).find('form');
        form.length === 0 || form.submit();
    });

    $('button[type=reset]').click(function (event) {
        event.preventDefault();
        let current_tab = $(document).find('ul.controls-tabs:first').find('li.current:first');
        let tab_id = current_tab.children('a:first').attr('href');
        let form = $(tab_id).find('form');
        form.length === 0 || form[0].reset();
    });

    $('#logo').change(function (event) {
        event.preventDefault();

        $('#ajax-change-branding-form').tsiUpload('', function () {
            let response = this;
            $('#logo-preview').attr('src', 'templates/' + response.filename);
        });
    });

    $('#custom_icon_upload').change(function () {
        $('button[type=submit]').disableBt();
        $('button[type=reset]').disableBt();

        $(this).parents("form").tsiUploadIcon({}, function () {
            let base64 = this.base64;
            let id = this.id;

            $('#adaptation-icon-list').append("<img class=\"adaptation-icon\" data-id='" + id + "' data-sys=\"0\" alt=\"\" src='" + this.base64 + "'>");

            ini_mouseover_icons();
        });
    });

    $('.style-package-preview').click(function () {
        img_show_preview($(this).attr('src'));
    });

    $('#style-package-preview').click(function () {
        if (document.getElementById("package").files.length > 0) {
            img_show_preview($(this).attr('src'));
        }
    });

    $('#package').change(function () {
        let label = $(this).next('label');
        let pkg_info = $('#pkg-info');
        let pkg_author = $('#pkg-info-author');
        let pkg_website = $('#pkg-info-website');
        let pkg_copyright = $('#pkg-info-copyright');
        let pkg_license = $('#pkg-info-license');

        label.html(tjs.get('Select Style package'));
        pkg_info.hide();
        pkg_author.parent().hide();
        pkg_website.parent().hide();
        pkg_copyright.parent().hide();
        pkg_license.parent().hide();

        $('#style-package-preview').css('cursor', 'normal');
        $('button[type=submit]').disableBt();
        $('button[type=reset]').disableBt();

        $(this).parents('form').packageInfo('', function () {
            let name = this.name;
            let version = this.version !== '' ? ' (' + this.version + ')' : '';
            let preview = this.preview;
            let author = this.author;
            let website = this.website;
            let copyright = this.copyright;
            let license = this.license;

            $('button[type=submit]').enableBt();
            $('button[type=reset]').enableBt();

            if (this.type === 'ext') {
                label.html(jsUcfirst(name) + version + tjs.get("Style package for Modul") + jsUcfirst((this.modul).toLowerCase()));
            } else {
                label.html(jsUcfirst(name) + version + tjs.get("Style package"));
            }

            let style_package_preview = $('#style-package-preview');

            if (preview !== '') {
                style_package_preview.attr('src', preview);
                style_package_preview.css('cursor', 'zoom-in');
            }

            if (author !== '') {
                pkg_info.show();
                pkg_author.html(author).parent().show();
            }

            if (website !== '') {
                pkg_info.show();
                pkg_website.html(website).parent().show();
            }

            if (copyright !== '') {
                pkg_info.show();
                pkg_copyright.html(copyright).parent().show();
            }

            if (license !== '') {
                pkg_info.show();
                pkg_license.attr('href', copyright).parent().show();
            }
        });
    });
});