$(document).ready(function () {

    let block = $('#account-mfa-block');

    if (block) {
        let option_email = $('#mfa_type_email');
        let option_google = $('#mfa_type_google');

        option_email.click(function () {
            if ($(this).prop("checked")) {
                option_google.prop("checked", false);
                $('#mfa_code').prop("required", false);
                $(this).css("opacity", "1");
                $('#account-mfa-google').hide();
                $('#account-mfa-email').css("opacity", "1").show();
            }
        })

        option_google.click(function () {
            if ($(this).prop("checked")) {
                option_email.prop("checked", false);
                $(this).css("opacity", "1");
                $('#mfa_code').attr("required", "required");
                $('#account-mfa-email').hide();
                $('#account-mfa-google').css("opacity", "1").show();
            }
        })

        $('#account-mfa-email-code-request').click(function () {

            let submitBt = $(this);
            submitBt.disableBt();

            let sendTimer = new Date().getTime();

            $.ajax({
                url: "index.php?controller=ajax&action=accountCreateMFA",
                type: 'GET',
                success: function (data) {
                    if (data.valid) {
                        let receiveTimer = new Date().getTime();
                        if (receiveTimer - sendTimer < 500) {
                            setTimeout(function () {
                                block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('The one-time password was sent to your email address. If you do not receive the notification within a few minutes, please check whether the email settings of the server are correct!'), {type: 'success'});
                                submitBt.enableBt();
                            }, 500 - (receiveTimer - sendTimer));
                        } else {
                            block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('The one-time password was sent to your email address. If you do not receive the notification within a few minutes, please check whether the email settings of the server are correct!'), {type: 'success'});
                            submitBt.enableBt();
                        }
                        submitBt.parent().prev().children().fadeIn("slow");
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
                        submitBt.parent().prev().children().fadeIn("slow");
                        submitBt.enableBt();
                    }
                },
                error: function () {
                    block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Error while contacting server, please try again'), {type: 'error'});
                    submitBt.enableBt();
                }
            });

            block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('Please wait, processing...'), {type: 'loading'});
        })

        block.find("form").submit(function (event) {

            event.preventDefault();

            block.scrollTop(0);

            let valid = false;

            let mfa_type = "";
            let mfa_secret = "";
            let mfa_code = "";

            if (!!option_google.prop("checked")) {
                mfa_type = "google";
                mfa_secret = $('#mfa_secret').val();
                mfa_code = $('#mfa_code_google').val();
                if (mfa_code.length !== 6) {
                    block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('The code you entered is incorrect'), {type: 'error'});
                } else {
                    valid = true;
                }
            } else {
                mfa_type = "email";
                mfa_code = $('#mfa_code_email').val();
                if (mfa_code.length !== 6) {
                    block.removeBlockMessages({except: 'no-hide'}).blockMessage(tjs.get('The code you entered is incorrect'), {type: 'error'});
                } else {
                    valid = true;
                }
            }

            if (valid === true) {
                let submitBt = $('#continue');
                submitBt.disableBt();

                let target = $('#account-mfa-form').attr('action');
                if (!target || target === '') {
                    target = document.location.href.match(/^([^#]+)/)[1];
                }

                let data = {
                    a: "",
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
                                window.location.href = "index.php?controller=index&action=index";
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
        })
    }
})