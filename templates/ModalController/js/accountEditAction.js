$(document).ready(function () {
    /**
     *
     */
    $('#multi-factor-authentication').click(function (event) {
        event.preventDefault();

        $.modal({
            title: tjs.get('Multi-factor authentication'),
            draggable: true,
            closeButton: true,
            url: "index.php?controller=modal&action=accountEditMFA",
            width: 480,
            height: 540,
            buttons: {
                'Save': function (win) {

                    let valid = false;

                    let block = $('#account-mfa-block');
                    block.parent().scrollTop(0);

                    let mfa_type_email = !!$('#mfa_type_email').prop("checked");
                    let mfa_type_google = !!$('#mfa_type_google').prop("checked");

                    let mfa_type = "none";
                    let mfa_secret = "";
                    let mfa_code = "";

                    if (mfa_type_email) {
                        mfa_type = "email";
                        mfa_code = $('#mfa_code_email').val();
                        if (mfa_code.length !== 6) {
                            block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('The code you entered is incorrect'), {type: 'error'});
                        } else {
                            valid = true;
                        }
                    } else if (mfa_type_google) {
                        mfa_type = "google";
                        mfa_secret = $('#mfa_secret').val();
                        mfa_code = $('#mfa_code_google').val();
                        if (mfa_code.length !== 6) {
                            block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('The code you entered is incorrect'), {type: 'error'});
                        } else {
                            valid = true;
                        }
                    } else {
                        valid = true;
                    }

                    if (valid === true) {
                        let submitBt = $('.block-footer.align-right').find('button[type=button]:first');
                        submitBt.disableBt();

                        let target = $('#account-mfa-form').attr('action');
                        if (!target || target === '') {
                            target = document.location.href.match(/^([^#]+)/)[1];
                        }

                        let data = {
                            a: $('#a').val(),
                            mfa_active: mfa_type !== "none",
                            mfa_type: mfa_type,
                            mfa_secret: mfa_secret,
                            mfa_code: mfa_code
                        };

                        let sendTimer = new Date().getTime();

                        $.ajax({
                            url: target,
                            dataType: 'json',
                            type: 'POST',
                            data: data,
                            success: function (data) {
                                if (data.valid) {
                                    let receiveTimer = new Date().getTime();
                                    if (receiveTimer - sendTimer < 500) {
                                        setTimeout(function () {
                                            block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Changes saved successfully'), {type: 'success'});
                                            submitBt.enableBt();
                                        }, 500 - (receiveTimer - sendTimer));
                                    } else {
                                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Changes saved successfully'), {type: 'success'});
                                        submitBt.enableBt();
                                    }
                                    setTimeout(function () {
                                        win.closeModal();
                                    }, 750);
                                } else if (data.error) {
                                    block.removeBlockMessages({except: 'no-hide'}).blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {
                                        type: 'error',
                                        position: 'top'
                                    });
                                    submitBt.enableBt();
                                } else if (data.warning) {
                                    block.removeBlockMessages({except: 'no-hide'}).blockMessage(data.warning || tjs.get('An unexpected error occurred, please try again'), {
                                        type: 'warning',
                                        position: 'top'
                                    });
                                    submitBt.enableBt();
                                }
                            },
                            error: function () {
                                block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error'});
                                submitBt.enableBt();
                            }
                        });

                        block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Please wait, processing...'), {type: 'loading'});
                    }
                },
                'Close': function (win) {
                    win.closeModal();
                }
            }
        });
    });

    $('#password').val('');
    $('#password-verify').val('');

    $('#account-form').submit(function (event) {

        event.preventDefault();

        let block = $('#account-block');
        block.parent().scrollTop(0);

        let first_name = $('#first_name').val();
        let last_name = $('#last_name').val();
        let email = $('#email').val();
        let password = $('#password').val();
        let password_verify = $('#password-verify').val();
        let query_nickname = $('#query_nickname').val();
        let icon_pkg = $('#icon_pkg').val();

        if (!first_name || first_name.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('First name is missing'), {type: 'warning'});
        } else if (!last_name || last_name.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Last name is missing'), {type: 'warning'});
        } else if (!email || email.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('E-Mail is missing'), {type: 'warning'});
        } else if (!isEmail(email)) {
            block.removeBlockMessages().blockMessage(tjs.get('E-Mail is invalid'), {type: 'warning'});
        } else {

            let valid = true;
            if (password && password.length > 0) {
                if (password_verify !== password) {
                    block.removeBlockMessages().blockMessage(tjs.get('Passwords not match'), {type: 'warning'});
                    valid = false;
                }
            }

            if (valid) {
                let submitBt = $('.block-footer.align-right').find('button[type=button]:first');
                submitBt.disableBt();

                let target = $(this).attr('action');
                if (!target || target === '') {
                    target = document.location.href.match(/^([^#]+)/)[1];
                }

                let data = {
                    a: $('#a').val(),
                    first_name: first_name,
                    last_name: last_name,
                    email: btoa(email)
                };

                if (password) {
                    data.password = btoa(password);
                }

                if (query_nickname.length > 0) {
                    data.query_nickname = query_nickname;
                }

                if (icon_pkg) {
                    data.icon_pkg = icon_pkg;
                }

                let redirect = $('#redirect');
                if (redirect.length > 0) {
                    data.redirect = redirect.val();
                }

                let sendTimer = new Date().getTime();

                $.ajax({
                    url: target,
                    dataType: 'json',
                    type: 'POST',
                    data: data,
                    success: function (data) {
                        if (data.valid) {
                            let receiveTimer = new Date().getTime();
                            if (receiveTimer - sendTimer < 500) {
                                setTimeout(function () {
                                    block.removeBlockMessages().blockMessage(tjs.get('Changes saved successfully'), {type: 'success'});
                                    submitBt.enableBt();
                                }, 500 - (receiveTimer - sendTimer));
                            } else {
                                block.removeBlockMessages().blockMessage(tjs.get('Changes saved successfully'), {type: 'success'});
                                submitBt.enableBt();
                            }
                            if (data.redirect) {
                                document.location.href = data.redirect;
                            }
                        } else if (data.error) {
                            block.removeBlockMessages().blockMessage(data.error || tjs.get('An unexpected error occurred, please try again'), {
                                type: 'error',
                                position: 'top'
                            });
                            submitBt.enableBt();
                        } else if (data.warning) {
                            block.removeBlockMessages().blockMessage(data.warning || tjs.get('An unexpected error occurred, please try again'), {
                                type: 'warning',
                                position: 'top'
                            });
                            submitBt.enableBt();
                        }
                    },
                    error: function () {
                        block.removeBlockMessages().blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error'});
                        submitBt.enableBt();
                    }
                });
                block.removeBlockMessages().blockMessage(tjs.get('Please wait, processing...'), {type: 'loading'});
            }
        }
    });

    /**
     * @param email
     * @returns {*|boolean}
     */
    function isEmail(email) {
        return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,99})+$/.test(email));
    }

});