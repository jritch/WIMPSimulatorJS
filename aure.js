$(function(){
    let aure = $('#aure');
    let recordHead = $('#record-head')

    let State = {
        IDLE: 0,
        RECORD: 1,
        EDIT: 2,
    };
    var currState = State.IDLE;

    aure.draggable({handle: '.handle'});
    recordHead.draggable({cancel: '#record-head'})
    .click(function(e) {
        if (currState == State.IDLE) {
            currState = State.RECORD;
            recordHead.find('.icon').hide();
            recordHead.find('#stop-icon').show();
        }
        else if (currState == State.RECORD) {
            currState = State.EDIT;
            recordHead.removeClass('record').addClass('edit');
            recordHead.find('.icon').hide();
            recordHead.find('#play-icon').show();
        }
        else {
            currState = State.IDLE;
            recordHead.find('.icon').hide();
            recordHead.removeClass('edit').addClass('record');
        }
    })
});