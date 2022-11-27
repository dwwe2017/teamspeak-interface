$(document).ready(function () {
    $('#group_id').change(function () {
        let available_instances_el = $('#available-instances');

        if ($(this).val() === '1') {
            $('#reseller_id').find('option').prop('selected', false).parent('select').find('option:first').prop('select', true);
            available_instances_el.hide();
            available_instances_el.next('p').html(tjs.get('The Super Administrator has basically full powers and permissions'));
            $('#active').prop('disabled', true);
        } else {
            available_instances_el.show();
            available_instances_el.next('p').html(tjs.get('You can choose multiple servers from multiple instances'));
            $('#active').prop('disabled', false);
        }
    }).trigger('change');

    $('#account-form').submit(function (event) {
        event.preventDefault();

        let block = $('#account-block');
        block.parent().scrollTop(0);

        let uid = $('#uid').val();
        let first_name = $('#first_name').val();
        let last_name = $('#last_name').val();
        let email = $('#email').val();
        let username = $('#username').val();
        let password = $('#password').val();
        let password_verify = $('#password-verify').val();
        let group_id = $('#group_id').val();

        if (!uid || uid.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Uid is missing'), {type: 'warning'});
        } else if (!first_name || first_name.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('First name is missing'), {type: 'warning'});
        } else if (!last_name || last_name.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Last name is missing'), {type: 'warning'});
        } else if (!email || email.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('E-Mail is missing'), {type: 'warning'});
        } else if (!isEmail(email)) {
            block.removeBlockMessages().blockMessage(tjs.get('E-Mail is invalid'), {type: 'warning'});
        } else if (!username || username.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Username is missing'), {type: 'warning'});
        } else if (!group_id || group_id.length === 0) {
            block.removeBlockMessages().blockMessage(tjs.get('Permission role id is missing'), {type: 'warning'});
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

                let data = new FormData($(this)[0]);
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
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data.valid) {
                            let receiveTimer = new Date().getTime();
                            if (receiveTimer - sendTimer < 500) {
                                setTimeout(function () {
                                    if(data.redirect){
                                        document.location.href = data.redirect;
                                    }else{
                                        block.removeBlockMessages().blockMessage(tjs.get('Changes saved successfully'), {
                                            type: 'success',
                                            position: 'top'
                                        });
                                    }
                                }, 500 - (receiveTimer - sendTimer));
                            } else {
                                if(data.redirect){
                                    document.location.href = data.redirect;
                                }else{
                                    block.removeBlockMessages().blockMessage(tjs.get('Changes saved successfully'), {
                                        type: 'success',
                                        position: 'top'
                                    });
                                }
                            }

                            submitBt.enableBt();
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

    function isEmail(email) {
        return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,99})+$/.test(email));
    }

});