let controls_tabs_first = $('ul.controls-tabs:first');

controls_tabs_first.find('li').click(function(){
    let id = $(this).children('a:first').attr('href');
    let form = $(id).find('form');
    if(form.length === 0){
        $('button[type=submit]').disableBt();
        $('button[type=reset]').disableBt();
    }else{
        $('button[type=submit]').enableBt();
        $('button[type=reset]').enableBt();
    }
});

controls_tabs_first.find('li.current:first').click();

$('button[type=submit]').click(function(event){
    event.preventDefault();
    let current_tab = $(document).find('ul.controls-tabs:first').find('li.current:first');
    let tab_id = current_tab.children('a:first').attr('href');
    let form = $(tab_id).find('form');
    form.length === 0 || form.submit();
});

$('button[type=reset]').click(function(event){
    event.preventDefault();
    let current_tab = $(document).find('ul.controls-tabs:first').find('li.current:first');
    let tab_id = current_tab.children('a:first').attr('href');
    let form = $(tab_id).find('form');
    form.length === 0 || form[0].reset();
});