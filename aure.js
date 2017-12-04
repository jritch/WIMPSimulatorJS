jQuery = $;

class Action {
    constructor(args) {
        this.title = args.title;
        this.icon = args.icon;
        this.type = args.type;
        this.data = args.data;
        this.list = args.list;
    }
}
let actionList = [
    new Action({
        title: 'Test Action 1', 
        icon: 'copy'
    }),
    new Action({
        title: 'Test Action 1', 
        icon: 'paste'
    }),
    new Action({
        title: 'Test Action 1', 
        icon: 'file-excel-o'
    })
];

class Aure {
    constructor(args) {
        this.$aure = $(args.el);
        this.$recordHead = $(args.recordHead);
        this.State = {
            IDLE: 0,
            RECORD: 1,
            EDIT: 2,
        }
        this.currState = this.State.IDLE;
        this.actionList = [];

        this.$aure.draggable({handle: '.handle'});
        this.$recordHead.draggable({cancel: '#record-head'})
        .click(e => {
            if (this.currState == this.State.IDLE) {
                this.setState(this.State.RECORD);
            }
            else if (this.currState == this.State.RECORD) {
                this.buildActionList()
                this.setState(this.State.EDIT)
            }
            else if (this.currState == this.State.EDIT && !this.$recordHead.hasClass('disabled')) {
                this.setState(this.State.IDLE);
            }
        })
        this.$aure.find('#aure-cancel').click(e => { this.setState(this.State.IDLE) })
        this.$aure.find('#aure-save').click(e => {
            // $('#t1_1').on('copy', () => {console.log('copy')})
            this.buildActionList(actionList);
        });
    }
    setState(s) {
        if (s == this.State.IDLE) {
            this.actionList = [];
            this.$aure.find('#aure-action-editor').addClass('small')
            this.$recordHead.find('.icon').addClass('hidden');
            this.$recordHead.removeClass('edit')
        }
        else if (s == this.State.RECORD) {
            this.$recordHead.find('.icon').addClass('hidden');
            this.$recordHead.find('.fa-stop').removeClass('hidden');
            this.$recordHead.addClass('record');
        }
        else {
            this.$aure.find('#aure-action-editor').removeClass('small')
            this.$recordHead.removeClass('record').addClass('edit');
            this.$recordHead.find('.icon').addClass('hidden');
            this.$recordHead.find('.fa-play').removeClass('hidden');
        }
        this.currState = s;
    }
    buildActionList(acs) {
        if (acs == undefined) acs = this.actionList;
        let $el = acs.reduce((acc, a) => {
            let listClasses = (a) => {
                if (a.list == undefined) return ''
                else if (a.list.length == 0) return 'listable needs-list'
                else return 'listable has-list'
            }
            let $a = $(`
                <div class="aure-action ${listClasses(a)}">
                    <div class="aure-action-icon icon">
                        <i class="fa fa-${a.icon}"></i>
                    </div>
                    <div>
                        <p>${a.title}</p>
                    </div>
                    <div class="aure-add-list icon">
                        <i class="fa fa-plus-square"></i>
                    </div>
                </div>
            `)
            $a.find('.aure-add-list i').click(e => {
                this.buildFileList(a)
                this.$aure.find('#aure-list').toggleClass('visible')
            })
            acc.append($a);
            return acc;
        }, $('<div>', { id: 'aure-actions' }));
        $el.find('#aure-list-items').sortable();
        $el.find('#aure-list-items').disableSelection();
        $el.find('#aure-actions').sortable();
        $el.find('#aure-actions').disableSelection();
        $('#aure-actions').replaceWith($el);
    }
    buildFileList(a) {
        let $el;
        if (a.list == undefined || a.list.length == 0) {
            $el = $(`<input type="button" class="aure-list-items" class="btn" value="Add files">`)
        }
        else {
            $el = a.list.reduce()
        }
        console.log(this.$aure.find('#aure-list'));
        this.$aure.find('.aure-list-items').remove();
        this.$aure.find('#aure-list').append($el);
    }
    addAction(a) {
        if (this.currState == this.State.RECORD) {
            this.actionList.push(a);
            this.$recordHead.addClass('flash');
            setTimeout(() => this.$recordHead.removeClass('flash'), 250)
        }
    }
}

var aure;

$(function(){
    aure = new Aure({
        el: '#aure',
        recordHead: '#record-head'
    });
});