$(document).ready(function () {

    let option_none = $('#mfa_type_none');
    let option_google = $('#mfa_type_google');
    let option_email = $('#mfa_type_email');

    option_none.click(function () {
        if ($(this).prop("checked")) {
            option_email.prop("checked", false);
            option_google.prop("checked", false);
            $('#mfa_code').prop("required", false);
            $('#account-mfa-email').css("opacity", "0.3");
            $('#account-mfa-google').css("opacity", "0.3");
        }
    })

    option_email.click(function () {
        if ($(this).prop("checked")) {
            option_none.prop("checked", false);
            option_google.prop("checked", false);
            $('#mfa_code').prop("required", false);
            $(this).css("opacity", "1");
            $('#account-mfa-google').hide();
            $('#account-mfa-email').css("opacity", "1").show();
        }
    })

    option_google.click(function () {
        if ($(this).prop("checked")) {
            option_none.prop("checked", false);
            option_email.prop("checked", false);
            $(this).css("opacity", "1");
            $('#mfa_code').attr("required", "required");
            $('#account-mfa-email').hide();
            $('#account-mfa-google').css("opacity", "1").show();
        }
    })

    $('#account-mfa-email-code-request').click(function () {

        let block = $('#account-mfa-block');

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
})