$(function(){
    let aure = $('#aure');
    let recordHead = $('#record-head')

    let State = {
        IDLE: 0,
        RECORD: 1,
        EDIT: 2,
    };
    var currState = State.IDLE;

    function setState(s) {
        currState = s;
        if (currState == State.IDLE) {
            aure.find('#aure-editor').addClass('small')
            recordHead.find('.icon').addClass('hidden');
            recordHead.removeClass('edit').addClass('record');
        }
        else if (currState == State.RECORD) {
            recordHead.find('.icon').addClass('hidden');
            recordHead.find('.fa-stop').removeClass('hidden');
        }
        else {
            aure.find('#aure-editor').removeClass('small')
            recordHead.removeClass('record').addClass('edit');
            recordHead.find('.icon').addClass('hidden');
            recordHead.find('.fa-play').removeClass('hidden');
        }
    }

    aure.draggable({handle: '.handle'});
    recordHead.draggable({cancel: '#record-head'})
    .click(function(e) {
        if (currState == State.IDLE) {
            setState(State.RECORD);
        }
        else if (currState == State.RECORD) {
            setState(State.EDIT)
        }
        else if (currState == State.EDIT && !recordHead.hasClass('disabled')) {
            setState(State.IDLE);
        }
    })
    aure.find('#aure-cancel').click(function(e) { setState(State.IDLE) })

    setState(State.EDIT);
});