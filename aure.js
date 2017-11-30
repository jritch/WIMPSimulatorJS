jQuery = $;

class Action {
    constructor(name, icon, list) {
        this.name = name;
        this.icon = icon;
        this.list = list;
    }
}
let actionList = [
    new Action('Test Action 1', 'copy'),
    new Action('Test Action 2', 'paste'),
    new Action('Test Action 3', 'file-excel-o'),
];

let State = {
    IDLE: 0,
    RECORD: 1,
    EDIT: 2,
};
var currState = State.IDLE;

function setState(s, aure, recordHead) {
    if (s == State.IDLE) {
        actionList = [];
        aure.find('#aure-action-editor').addClass('small')
        recordHead.find('.icon').addClass('hidden');
        recordHead.removeClass('edit').addClass('record');
    }
    else if (s == State.RECORD) {
        recordHead.find('.icon').addClass('hidden');
        recordHead.find('.fa-stop').removeClass('hidden');
    }
    else {
        aure.find('#aure-action-editor').removeClass('small')
        recordHead.removeClass('record').addClass('edit');
        recordHead.find('.icon').addClass('hidden');
        recordHead.find('.fa-play').removeClass('hidden');
    }
    currState = s;
}

function buildActionList(as) {
    let $el = as.reduce((acc, a) => {
        $a = $(document.createElement('div')).addClass('aure-action');
        $a.append($('<div>', { class: 'aure-action-icon icon' })
            .append($('<i>', { class: `fa fa-${a.icon}` })));
        $a.append($('<div>').append($('<p>').text(a.name)));
        acc.append($a);
        return acc;
    }, $('<div>', { id: 'aure-actions' }));
    $('#aure-actions').replaceWith($el);
}

$(function(){
    let aure = $('#aure');
    let recordHead = $('#record-head')

    aure.draggable({handle: '.handle'});
    recordHead.draggable({cancel: '#record-head'})
    .click(function(e) {
        if (currState == State.IDLE) {
            setState(State.RECORD, aure, recordHead);
        }
        else if (currState == State.RECORD) {
            setState(State.EDIT, aure, recordHead)
        }
        else if (currState == State.EDIT && !recordHead.hasClass('disabled')) {
            setState(State.IDLE, aure, recordHead);
        }
    })
    aure.find('#aure-cancel').click(function(e) { setState(State.IDLE, aure, recordHead) })
    aure.find('#aure-save').click(e => {
        // $('#t1_1').on('copy', () => {console.log('copy')})
        buildActionList(actionList);
    });
    aure.find('.aure-add-list i').click(e => {
        // buildFileList()
        aure.find('#aure-list').toggleClass('visible')
    })
    $('#aure-list-items').sortable();
    $('#aure-list-items').disableSelection();
    $('#aure-actions').sortable();
    $('#aure-actions').disableSelection();
});