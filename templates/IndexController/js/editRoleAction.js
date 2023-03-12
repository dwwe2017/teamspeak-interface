$(document).ready(function () {

    let roles_select_el = $('#role_icon_list');
    let tab_create_role_custom = $("#tab-create-role-custom");

    if (tab_create_role_custom.is(":visible")) {
        roles_select_el.msDropDown("dd");
    }

    tab_create_role_custom.onTabShow(function () {
        roles_select_el.msDropDown("dd");
    }, true);

    roles_select_el.change(function () {
        let prev = $(this).find("option:selected").attr("data-prev");
        let target = $(this).parents("div").find(".roles");
        target.attr("style", "background-image: url(" + prev + ");");
    }).trigger("change");

    $('.toggle-all-checkboxes').click(function () {
        $(this).parent().parent().parent().find('fieldset').each(function () {
            $(this).find('input').each(function () {
                if (!$(this).parent().parent().is(":hidden")) {
                    if ($(this).prop('checked')) {
                        $(this).prop('checked', false);
                    } else {
                        $(this).prop('checked', true);
                    }
                }
            });
        });
    });

    $('.filter-perms').on("keyup keypress blur paste change", function () {
        let value = $(this).val();
        if (value.length > 2) {
            $(this).parent().parent().parent().find("fieldset").each(function () {
                $(this).find("div").each(function () {
                    if (!$(this).find("label:first").html().includes(value)) {
                        $(this).hide();
                    } else {
                        $(this).addClass("full-width-i");
                        $(this).show();
                    }
                })
            });
        } else {
            $(this).parent().parent().parent().find("fieldset").each(function () {
                $(this).find("div").each(function () {
                    $(this).removeClass("full-width-i");
                    $(this).show();
                });
            });
        }
    });

    let confirmed = false;
    let form = $('#edit_role_form');
    form.on("submit", function (event) {
        if (!confirmed) {
            event.preventDefault();
            let relevant = $(this).find("input.mini-switch[type=checkbox]:checked");
            let relevant_permissions = "";
            relevant.each(function () {
                if (!$(this).hasClass("toggle-all-checkboxes")) {
                    let label = $(this).parent().find('label');
                    if (label && label.attr("style") === "color: red") {
                        relevant_permissions += label.html() + ", "
                    }
                }
            });
            if (relevant_permissions.length > 0) {
                relevant_permissions = "<small style='text-transform: none; font-size: 12px;' class='align-left'>(" + relevant_permissions.substr(0, (relevant_permissions.length - 2)) + ")</small>";
                modalConfirmMsg(tjs.get("The role has security-related permissions, do you want to continue?") + " " + relevant_permissions, function () {
                    this.closeModal();
                    confirmed = true;
                    form.submit();
                });
            } else {
                confirmed = true;
                form.submit();
            }
        }
    });
});