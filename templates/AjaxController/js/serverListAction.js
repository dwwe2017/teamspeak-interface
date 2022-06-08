$(document).ready(function () {
    let has_cache_lifetime_serverList = source.has_cache_lifetime_serverList;
    let tsi_instance_notes_manage = source.tsi_instance_notes_manage;
    let cookie_date_1_serverList = source.cookie_date_1_serverList;
    let cookie_date_0_serverList = source.cookie_date_0_serverList;
    let servers_count_serverList = source.servers_count_serverList;

    let accessible_on_start = false;
    let accessible_start_page = 1;

    /**
     *
     * @param element
     * @returns {boolean}
     */
    function getAccessibleOnStart(element) {
        return accessible_on_start;
    }

    /**
     *
     * @param element
     */
    function updateAccessibleOnStart(element = false) {
        if (element === false) {
            accessible_on_start = false;
        } else if (JSON.stringify(element) !== "{}") {
            accessible_on_start = $(element).parent("div").find("a.search-less").length > 0;
        }
    }

    /**
     *
     * @returns {boolean}
     */
    function getAccessibleStartPage() {
        return accessible_start_page;
    }

    /**
     *
     * @param element
     */
    function updateAccessibleStartPage(element = false) {
        if (element === false) {
            accessible_start_page = 1
        } else if (JSON.stringify(element) !== "{}") {
            accessible_start_page = $(element).next("ul").find("li.current:first").find("a").html() || 1;
        }
    }

    /**
     *
     */
    $("a.ajax-get-assigned-users-refresh").click(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if ($(this).attr("style") !== "display: none;") {
            let element = $(this);
            let element_icon = $(this).children("img");
            let info_icon = element_icon.attr("src");
            element_icon.attr("src", "images/ajax-loader.gif");
            let instance_id = $(this).attr("data-id");
            let virtualserver_id = $(this).attr("data-sid");

            $.get("index.php?controller=ajax&action=getAssignedUsers&instance_id=" + instance_id + "&virtualserver_id=" + virtualserver_id, function (data) {
                let result = "";
                let accessible_identifier;
                let {error = null, response = {}} = data;
                if (error) {
                    result = "<span style=\"font-style: oblique; font-weight: normal; font-size: 11px; color: rgb(255, 0, 0);\">" + error + "</span>";
                } else if (response !== {}) {
                    let {users = [], resellers = []} = response;

                    if (users.length > 0 || resellers.length > 0) {
                        accessible_identifier = "assigned-users-accessible-" + virtualserver_id;
                        result = "<br/><ul class=\"simple-list with-icon\" id=\"" + accessible_identifier + "\">"

                        if (resellers.length > 0) {
                            let reseller_desc = tjs.get("Reseller");
                            let edit_desc = tjs.get("Edit Reseller");
                            $.each(resellers, function (index) {
                                let {id, username, first_name = "", last_name = ""} = resellers[index];
                                let pname = first_name !== "" && last_name !== "" ? " - " + first_name + " " + last_name + "" : ""
                                result += "<li class='icon-reseller'>"
                                result += "<a href=\"javascript:void(0)\" title=\"" + edit_desc + "\" onclick=\"modalEditReseller(" + id + ", '" + element.attr("id") + "')\"><strong>[" + reseller_desc + "#" + id + "]</strong> <b>" + username + "</b>" + pname + "</a>"
                                result += "</li>"
                            });
                        }

                        if (users.length > 0) {
                            let user_desc = tjs.get("User");
                            let reseller_desc = tjs.get("Reseller");
                            let edit_desc = tjs.get("Edit Webuser");
                            $.each(users, function (index) {
                                let {id, username, first_name = "", last_name = "", reseller_id = null} = users[index];
                                let pname = first_name !== "" && last_name !== "" ? " - " + first_name + " " + last_name + "" : ""
                                result += "<li class='icon-user'>"
                                result += "<a href=\"javascript:void(0)\" title=\"" + edit_desc + "\" onclick=\"modalEditWebuser(" + id + ", '" + element.attr("id") + "')\"><strong>[" + user_desc + "#" + id + "]</strong> <b>" + username + "</b>" + pname
                                if (reseller_id > 0) {
                                    result += "<small> (" + reseller_desc + ": #" + reseller_id + ")</small>"
                                }
                                result += "</a>"
                                result += "</li>"
                            });
                        }

                        result += "</ul>";
                    } else {
                        result = "<span style=\"font-style: oblique; font-weight: normal; font-size: 11px;\">" + tjs.get("No users are assigned to this virtual server") + "</span>";
                    }
                } else {
                    result = "<span style=\"font-style: oblique; font-weight: normal; font-size: 11px;\">" + tjs.get("No users are assigned to this virtual server") + "</span>";
                }

                element_icon.attr("src", info_icon);
                element.parent("div").next("div").hide();
                element.parent("div").next("div").html(result);
                element.parent("div").next("div").fadeIn("slow");

                if (accessible_identifier) {
                    let accessible_identifier_element = $("#" + accessible_identifier);
                    accessible_identifier_element.find("a").tip({position: "right"});
                    accessible_identifier_element.accessibleList({
                        moreAfter: 2,
                        pageSize: 4,
                        //startPage: getAccessibleStartPage(),
                        moreText: tjs.get("show more"),
                        lessText: tjs.get("show less"),
                        openedOnStart: getAccessibleOnStart(this),
                        after: function () {
                            updateAccessibleOnStart(this);
                            updateAccessibleStartPage(this);
                        }
                    });

                    if (getAccessibleStartPage() > 1) {
                        accessible_identifier_element.parent("div").find("ul.small-pagination:first").find('a[title="Page ' + getAccessibleStartPage() + '"]').trigger("click");
                    }
                }
            })
        }

        return false;
    })

    /**
     *
     */
    $("a.ajax-get-assigned-users").click(function (event) {
        event.preventDefault();
        event.stopPropagation();

        let element = $(this);

        $('img.ajax-get-assigned-users-icon[style="width: 16px; height: 16px; vertical-align: sub; opacity: 0.5;"]').each(function () {
            if ($(this).parent("a").attr("id") !== element.attr("id")) {
                updateAccessibleOnStart(false);
                updateAccessibleStartPage(false);
                $(this).attr("style", "width: 16px; height: 16px; vertical-align: sub;");
                $(this).parent("a").parent("div").next("div").fold("normal", function () {
                    $(this).html("");
                });
                $(this).parent("a").next("a").fadeOut("slow");
            }
        });

        let element_icon = $(this).children("img");
        let info_icon = element_icon.attr("src");

        if (element_icon.attr("style") === "width: 16px; height: 16px; vertical-align: sub; opacity: 0.5;") {
            updateAccessibleOnStart(false);
            updateAccessibleStartPage(false);
            element_icon.attr("style", "width: 16px; height: 16px; vertical-align: sub;");
            element.parent("div").next("div").fold("normal", function () {
                $(this).html("");
            });
            element.next("a").fold();
        } else {
            element_icon.attr("src", "images/ajax-loader.gif");
            let instance_id = $(this).attr("data-id");
            let virtualserver_id = $(this).attr("data-sid");
            $.get("index.php?controller=ajax&action=getAssignedUsers&instance_id=" + instance_id + "&virtualserver_id=" + virtualserver_id, function (data) {
                let result = "";
                let accessible_identifier;
                let {error = null, response = {}} = data;
                if (error) {
                    result = "<span style=\"font-style: oblique; font-weight: normal; font-size: 11px; color: rgb(255, 0, 0);\">" + error + "</span>";
                } else if (response !== {}) {
                    let {users = [], resellers = []} = response;

                    if (users.length > 0 || resellers.length > 0) {

                        accessible_identifier = "assigned-users-accessible-" + virtualserver_id;
                        result = "<br/><ul class=\"simple-list with-icon\" id=\"" + accessible_identifier + "\">"

                        if (resellers.length > 0) {
                            let reseller_desc = tjs.get("Reseller");
                            let edit_desc = tjs.get("Edit Reseller");
                            $.each(resellers, function (index) {
                                let {id, username, first_name = "", last_name = ""} = resellers[index];
                                let pname = first_name !== "" && last_name !== "" ? " - " + first_name + " " + last_name + "" : ""
                                result += "<li class='icon-reseller'>"
                                result += "<a href=\"javascript:void(0)\" title=\"" + edit_desc + "\" onclick=\"modalEditReseller(" + id + ", '" + element.attr("id") + "')\"><strong>[" + reseller_desc + "#" + id + "]</strong> <b>" + username + "</b>" + pname + "</a>"
                                result += "</li>"
                            });
                        }

                        if (users.length > 0) {
                            let user_desc = tjs.get("User");
                            let reseller_desc = tjs.get("Reseller");
                            let edit_desc = tjs.get("Edit Webuser");
                            $.each(users, function (index) {
                                let {id, username, first_name = "", last_name = "", reseller_id = null} = users[index];
                                let pname = first_name !== "" && last_name !== "" ? " - " + first_name + " " + last_name + "" : ""
                                result += "<li class='icon-user'>"
                                result += "<a href=\"javascript:void(0)\" title=\"" + edit_desc + "\" onclick=\"modalEditWebuser(" + id + ", '" + element.attr("id") + "')\"><strong>[" + user_desc + "#" + id + "]</strong> <b>" + username + "</b>" + pname
                                if (reseller_id > 0) {
                                    result += "<small> (" + reseller_desc + ": #" + reseller_id + ")</small>"
                                }
                                result += "</a>"
                                result += "</li>"
                            });
                        }

                        result += "</ul>";
                    } else {
                        result = "<span style=\"font-style: oblique; font-weight: normal; font-size: 11px;\">" + tjs.get("No users are assigned to this virtual server") + "</span>";
                    }
                } else {
                    result = "<span style=\"font-style: oblique; font-weight: normal; font-size: 11px;\">" + tjs.get("No users are assigned to this virtual server") + "</span>";
                }

                element_icon.attr("src", info_icon);
                element_icon.attr("style", "width: 16px; height: 16px; vertical-align: sub; opacity: 0.5;");
                element.parent("div").next("div").hide();
                element.parent("div").next("div").html(result);
                element.parent("div").next("div").fadeIn("slow", function () {
                    element.next("a").fadeIn("slow");
                });

                if (accessible_identifier) {
                    let accessible_identifier_element = $("#" + accessible_identifier);
                    accessible_identifier_element.find("a").tip({position: "right"});
                    accessible_identifier_element.accessibleList({
                        moreAfter: 2,
                        pageSize: 4,
                        startPage: 1,
                        moreText: tjs.get("show more"),
                        lessText: tjs.get("show less"),
                        openedOnStart: getAccessibleOnStart(this),
                        after: function () {
                            updateAccessibleOnStart(this);
                            updateAccessibleStartPage(this);
                        }
                    });
                }
            })
        }

        return false;
    });

    let select = $('#table-action');

    $("button[type=submit]").click(function (event) {
        event.preventDefault();

        if (select.val() === "instanceMsg") {
            let message = prompt(tjs.get("TEXT MESSAGE:"), tjs.get("Max. 300 characters"));

            if (message) {
                $(this).parent().append("<input type=\"hidden\" name=\"text_msg\" value=\"" + message + "\">");

                let form = $(this).parents('form');

                $.modal({
                    content: '<p><div class=\"warnings align-center\"><b>' + tjs.get("Do you really want to do this?") + '</b></div></p>',
                    title: tjs.get('Confirm'),
                    draggable: true,
                    closeButton: false,
                    maxWidth: 280,
                    buttons: {
                        'Continue': function () {
                            form.submit();
                        },
                        'Close': function (win) {
                            win.closeModal();
                        }
                    }
                });
            }
        }
    });

    if (servers_count_serverList < 1) {
        $(document).ready(function () {
            $('.modal-virtual-server-create:first').trigger('click');
        });
    } else {
        if (has_cache_lifetime_serverList === 1) {
            $('.not-cached').click(function () {
                init_caching(100);
            });
        } else {
            $('.not-cached').click(function () {
                init_loading(100);
            });
        }

        if (tsi_instance_notes_manage === 1) {
            $('.virtualserver-note').click(function (event) {
                let noteId = $(this).attr('data-attached');

                let ranCol = $('#randomColor').prop('checked');

                let tresd = $(this).find('img:first').attr('src').indexOf('pkg-default') >= 0;

                $.PostItAll.new(
                    {
                        id: noteId,
                        content: '(' + $(this).parent('td').prev('td').text() + ') ' + $(this).prev('a').children('strong').text(),
                        attachedTo: {
                            element: '#' + noteId,
                            position: 'right',
                            arrow: true,
                            fixed: true
                        },
                        meta: {},
                        cssclases: {
                            note: ranCol ? '' : 'customNote'
                        },
                        style: {
                            tresd: tresd,
                            fontFamily: 'verdana',
                            fontsize: '11px',
                            textshadow: false
                        },
                        features: $.extend({}, $.fn.postitall.globals, true)
                    });

                event.preventDefault();
            });

            $('.virtualserver-note-pinned').click(function (event) {
                let postIt = $('#PIApostit_' + $(this).attr('data-attached'));

                if (!postIt.is(':visible')) {
                    postIt.postitall('show');
                } else if ($('#pia_minimize_' + $(this).attr('data-attached')).attr('title') === 'Restore note') {
                    $('#pia_minimize_' + $(this).attr('data-attached')).trigger('click');
                } else {
                    postIt.postitall('options', {
                        attachedTo: {
                            element: '#' + $(this).attr('data-attached'),
                            position: 'right',
                            arrow: true,
                            fixed: true
                        }
                    });
                }

                event.preventDefault();
            });

            $('#randomColor').click(function () {
                if ($(this).prop('checked')) {
                    document.cookie = 'tsi-instance-notes-random-color=true; samesite=lax; expires=' + cookie_date_1_serverList + '';
                } else {
                    document.cookie = 'tsi-instance-notes-random-color=false; samesite=lax; expires=' + cookie_date_0_serverList + '';
                }
            });

            $('.notes-hide-all').click(function (event) {
                $.PostItAll.hide();
                event.preventDefault();
            });

            $('.notes-show-all').click(function (event) {
                $.PostItAll.show();
                event.preventDefault();
            });

            $('.notes-delete-all').click(function (event) {
                $.PostItAll.remove();
                if (typeof refreshNoteCount === "function") {
                    refreshNoteCount();
                }
                event.preventDefault();
            });
        }

        $('.ajax-virtualserver-status-toggle').click(function () {
            let loader = $(this).parent('li').parent('ul').find('.loader:first');
            loader.show();

            $(this).serverSetStatus({}, function () {
                this.parent('li').parent('ul').find('li:hidden').show();
                this.parent('li').hide();
                loader.hide();
            });
        });

        $('.ajax-virtualserver-autostart-toggle').click(function () {
            let loader = $(this).parent('td').find('.loader:first');
            loader.show();

            $(this).serverSetAutoStart({}, function () {
                this.parent('td').find('a:hidden').show();
                this.hide();
                loader.hide();
            });
        });

        $('.modal-confirm-submit').click(function (event) {
            if (select.val() !== "instanceMsg") {
                event.preventDefault();

                let form = $(this).parents('form');

                $.modal({
                    content: '<p><div class=\"warnings align-center\"><b>' + tjs.get("Do you really want to do this?") + '</b></div></p>',
                    title: tjs.get('Confirm'),
                    draggable: true,
                    closeButton: false,
                    maxWidth: 280,
                    buttons: {
                        'Continue': function () {
                            form.submit();
                        },
                        'Close': function (win) {
                            win.closeModal();
                        }
                    }
                });
            }
        });

        $('.modal-confirm').click(function (event) {
            event.preventDefault();
            let link = $(this).attr("href");

            $.modal({
                content: '<p><div class=\"warnings align-center\"><b>' + tjs.get("Do you really want to do this?") + '</b></div></p>',
                title: tjs.get('Confirm'),
                draggable: true,
                closeButton: false,
                maxWidth: 280,
                buttons: {
                    'Continue': function () {
                        document.location.href = link;
                    },
                    'Close': function (win) {
                        win.closeModal();
                    }
                }
            });
        });

        $('.select-all').click(function () {
            $(this).parent().parent().parent('form').find('input[type=checkbox]').each(function () {
                this.checked = true;
            });
        });

        $('.unselect-all').click(function () {
            $(this).parent().parent().parent('form').find('input[type=checkbox]').each(function () {
                this.checked = false;
            });
        });

        $.fn.dataTableExt.oStdClasses.sWrapper = 'no-margin last-child';
        $.fn.dataTableExt.oStdClasses.sInfo = 'message no-margin table-message';
        $.fn.dataTableExt.oStdClasses.sLength = 'float-left';
        $.fn.dataTableExt.oStdClasses.sFilter = 'float-right';
        $.fn.dataTableExt.oStdClasses.sPaging = 'sub-hover paging_';
        $.fn.dataTableExt.oStdClasses.sPagePrevEnabled = 'control-prev';
        $.fn.dataTableExt.oStdClasses.sPagePrevDisabled = 'control-prev disabled';
        $.fn.dataTableExt.oStdClasses.sPageNextEnabled = 'control-next';
        $.fn.dataTableExt.oStdClasses.sPageNextDisabled = 'control-next disabled';
        $.fn.dataTableExt.oStdClasses.sPageFirst = 'control-first';
        $.fn.dataTableExt.oStdClasses.sPagePrevious = 'control-prev';
        $.fn.dataTableExt.oStdClasses.sPageNext = 'control-next';
        $.fn.dataTableExt.oStdClasses.sPageLast = 'control-last';

        $('.sortable').each(function () {
            let table = $(this),
                oTable = table.dataTable({
                    bDestroy: true,
                    sDom: '<\"block-controls\"<\"controls-buttons\"p>>rti<\"block-footer clearfix\"lf>',
                    language: {
                        "paginate": {
                            "previous": tjs.get("control-prev"),
                            "next": tjs.get("control-next"),
                            "last": tjs.get("Last page"),
                            "first": tjs.get("First page"),
                            "search": tjs.get("Search"),
                            "info": tjs.get("Showing _START_ to _END_ of _TOTAL_ entries"),
                            "sInfoEmpty": tjs.get("Showing 0 to 0 of 0 entries"),
                            "sLengthMenu": tjs.get("Show _MENU_ entries")
                        }
                    },
                    fnDrawCallback: function () {
                        this.parent().applyTemplateSetup();
                    },
                    fnInitComplete: function () {
                        this.parent().applyTemplateSetup();
                    }
                });

            table.find('thead .sort-up').click(function (event) {
                event.preventDefault();
                let column = $(this).closest('th'),
                    columnIndex = column.parent().children().index(column.get(0));
                oTable.fnSort([[columnIndex, 'asc']]);
                return false;
            });

            table.find('thead .sort-down').click(function (event) {
                event.preventDefault();
                let column = $(this).closest('th'),
                    columnIndex = column.parent().children().index(column.get(0));
                oTable.fnSort([[columnIndex, 'desc']]);
                return false;
            });
        });
    }
});

/**
 *
 * @param uid
 * @param element_id
 */
function modalEditWebuser(uid, element_id) {
    $.modal({
        title: tjs.get('Edit Webuser'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=modal&action=accountSaEdit&uid=" + encodeURIComponent(btoa(uid)) + "&redirect=",
        width: 640,
        height: 520,
        complete: function () {
            let oDropdown = $('#lang');
            oDropdown.msDropDown().data("dd");
        },
        buttons: {
            'Save & Proceed': function (win) {
                let form = win.getModalContentBlock().find('form');
                form.submit();
                setTimeout(function () {
                    parent.$("#" + element_id).next("a").trigger("click");
                }, 200);
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}

/**
 *
 * @param uid
 * @param element_id
 */
function modalEditReseller(uid, element_id) {
    $.modal({
        title: tjs.get('Edit Reseller'),
        draggable: true,
        closeButton: true,
        url: "index.php?controller=reseller&action=modalResellerSaEdit&uid=" + encodeURIComponent(btoa(uid)) + "&redirect=",
        width: 640,
        height: 520,
        complete: function () {
            let oDropdown = $('#lang');
            oDropdown.msDropDown().data("dd");
        },
        buttons: {
            'Save & Proceed': function (win) {
                let form = win.getModalContentBlock().find('form');
                form.submit();
                setTimeout(function () {
                    parent.$("#" + element_id).next("a").trigger("click");
                }, 200);
            },
            'Close': function (win) {
                win.closeModal();
            }
        }
    });
}