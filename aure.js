jQuery = $;

let nActions = 0;
class Action {
    constructor(args) {
        this.title = args.title;
        this.icon = args.icon;
        this.type = args.type;
        this.data = args.data;
        this.list = args.list;
        this.id = nActions++;
    }
}

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
                this.replay()
                this.setState(this.State.IDLE);
            }
        })
        this.$aure.find('#aure-cancel').click(e => { this.setState(this.State.IDLE) })
        this.$aure.find('#aure-save').click(e => {
            this.buildActionList(actionList);
        });

        $('#dialog2').dialog({
            autoOpen: false,
            show: {
                effect: 'blind',
                duration: 100
            },
            hide: {
                effect: 'explode',
                duration: 1000
            }
        });
    }
    setState(s) {
        if (s == this.State.IDLE) {
            this.actionList = [];
            nActions = 0;
            this.$aure.find('#aure-list').removeClass('visible')

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
                <div id="aure-action-${a.id}" class="aure-action ${listClasses(a)}">
                    <div class="aure-action-icon icon">
                        <i class="fa fa-${a.icon}"></i>
                    </div>
                    <div>
                        <p>${a.title}</p>
                    </div>
                    <div class="aure-action-buttons">
                        <div class="aure-add-list icon">
                            <i class="fa fa-plus-square"></i>
                        </div>
                        <div class="aure-remove-action icon">
                            <i class="fa fa-times"></i>
                        </div>
                    </div>
                </div>
            `)
            $a.find('.aure-add-list i').click(e => {
                if (!this.$aure.find('#aure-list').hasClass('visible')) {
                    this.buildFileList(a)
                }
                this.$aure.find('#aure-list').toggleClass('visible')
            });
            $a.find('.aure-remove-action').click(e => {
                let i = this.actionList.indexOf(a);
                if (i > -1) {
                    this.actionList.splice(i, 1);
                    this.buildActionList(this.actionList);
                }
            });
            acc.append($a);
            return acc;
        }, $('<div>', { id: 'aure-actions' }));
        $el.sortable({
            update: (e, ui) => {
                this.actionList = this.$aure.find('.aure-action')
                    .map((i, el) => +$(el).attr('id').split('-')[2])
                    .map((i, n) => this.actionList[n])
                    .toArray();
            }
        }).disableSelection();
        $('#aure-actions').replaceWith($el);
    }
    buildFileList(a) {
        let $el;
        if (a.list == undefined || a.list.length == 0) {
            $el = $(`<input type="button" class="aure-list-items aure-add-files" class="btn" value="Add files">`)
            $el.click(e => {
                $('#dialog2').dialog('open')
                $('#tree').fancytree({selectMode: 2, checkbox: true})
                $('#dialog2').find('button').off().click(e => {
                    let getName = n =>  n.parent.title == 'root' ? `${n.title}` : getName(n.parent) + `/${n.title}`;
                    a.list = $('#tree').fancytree('getTree').getSelectedNodes().map(getName);
                    $('#dialog2').dialog('close')
                    this.buildFileList(a)
                    $('#tree').fancytree({selectMode: 1, checkbox: false})
                })
            })
        }
        else {
            $el = a.list.reduce((acc, f) => {
                acc.append(`<li class="aure-list-item">${f}</li>`)
                return acc
            }, $('<ul>', { class: 'aure-list-items' }));
            this.$aure.find(`#aure-action-${a.id}`).removeClass('needs-list').addClass('has-list');
            $el.sortable({
                update: (e, ui) => {
                    a.list = $el.find('.aure-list-item')
                        .map((i, el) => $(el).text())
                        .toArray();
                }
            })

        }
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
    replay() {
        let nFiles = this.actionList.find(a => a.list != undefined).list.length;
        // TODO: iterate over file list
        [...Array(nFiles).keys()].forEach(f => {
            this.actionList.forEach((a, i) => {
                if (a.type == 'ppt-insert-slide') {
                    w2ui.toolbar.onClick();
                }
                if (a.type == 'keydown') {
                    let ev = $.Event('keydown')
                    ev.keyCode = a.data
                    $(document).trigger(ev)
                }
                if (a.type == 'ppt-insert-text') {
                    console.log('ppt-insert-text');
                    console.log('selected slide:', +w2ui.sidebar.selected - 1);
                    console.log('text:', a.data.text);
                    slide_information.text[+w2ui.sidebar.selected - 1] = a.data.text;
                    w2ui.sidebar.onClick();
                }
                if (a.type == 'ppt-insert-image') {
                    let fileName = a.list[f].split('/').pop()
                    slide_information.image_titles[+w2ui.sidebar.selected - 1] = fileName
                    w2ui.sidebar.onClick();
                }
            });
        });
    }
}

var aure;

$(function(){
    aure = new Aure({
        el: '#aure',
        recordHead: '#record-head'
    });
});