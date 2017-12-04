 var slide_information = {
	text: {},
	image_titles: {}
}

function pressDown() {
	$('.w2ui-node w2ui-selected').click().focus().mousedown().mouseup().trigger();
	let ke = $.Event('keydown')
	ke.keyCode = 40;
	$(document).trigger(ke)
}

var ppt_config = {
	layout: {
		name: 'layout',
		padding: 0,
		panels: [
			{ type: 'left', size: 200, resizable: false, minSize: 120, title: 'Slides'	},
			{ type: 'main', minSize: 550, overflow: 'hidden' }
		]
	},
	sidebar: {
		name: 'sidebar',
		keyboard: false,
		nodes: [
			{ id: '1', text: 'Slide 1', img: 'MyIcon1', selected: true },
		],
		onRender: function(event) { this.sidebar.onClick(event) },
		onClick: function (event) {
			if (event) {
				var id = Number(event.target) - 1;
			}
			else {
				var id = +w2ui.sidebar.selected - 1;
			}

			w2ui.layout.content('main', `
				<div style="width:80%;padding:20px;height:80%; margin: auto; background-color:white">
					<div class="ppt-text" style="padding: 10px;border: 1px; border-style:dashed" contenteditable="true">
						<span id=slide_txt>Edit to Insert Text.</span>
					</div>
					<br>
					<div class="ppt-image" style="padding: 10px; border: 1px; border-style:dashed;height:90%">
						<span id="prompt">Click to Insert Image.</span>
						<br>
						<img style="margin:auto;" id="active_img">
					</div>
				</div>
			`
			);

			$(w2ui.layout.el('main'))
				.css({
					'border-left': '1px solid silver',
					'padding ': '100px'
				});
			$('.ppt-text').blur(e => {
				slide_information['text'][id] = $('.ppt-text').text().trim();
				aure.addAction(new Action({
					type: 'ppt-insert-text',
					data: {
						id: id,
						text: slide_information['text'][id]
					},
					title: 'Add slide text', 
					icon: 'font'
				}))
			})
			$('.ppt-image').click(e => $('#dialog').dialog('open'));

			// show an image if it's been added

			if (slide_information.image_titles[id]){
				$('#active_img').attr('src','data/img/' + slide_information['image_titles'][id]);
				$('#prompt').remove();
			}

			// Show the correct text if it's been added
			if (slide_information.text[id]) {
				$('#slide_txt').text(slide_information['text'][id]);
			}
		},
	},
};

var toolbar = {
	name: 'toolbar',
	items : [
		{type:'button', caption: 'Insert Slide', img: 'icon-folder'}
	],
	onClick: function(event) {
		num = String(w2ui['sidebar'].nodes.length + 1)
		w2ui['sidebar'].add({ id: num, text: 'Slide '+ num, img: 'MyIcon1', })
		aure.addAction(new Action({
			type: 'ppt-insert-slide',
			data: num,
			title: 'Insert a slide',
			icon: 'copy',
		}));
	}
};

var config = {
	layout: {
		name: 'myLayout',
		padding: 0,
		panels: [
			{ type: 'main', minSize: 550, overflow: 'hidden', title: '' }
		]
	},
	notepad: {
		content: ''
	}
};

$(function(){
	$('#tree').fancytree({
		extensions: ['edit'],
		selectMode: 2,
		checkbox: false,
		source: [
			{title: 'TV Shows', folder: true, children: [
				{title: 'The.Good.Place.S01E01.HDTV.HebSubs.XviD-AFG.avi', key: 'vlc_1'},
				{title: 'The.Good.Place.S01E02.1080p.HDTV.x264-CROOKS.mp4', key: 'vlc_2'},
				{title: 'The.Good.Place.S01E03.HDTV.x264-KILLERS.mp4', key: 'vlc_3'},
				{title: 'The.Walking.Dead.S08E01.1080p.WEB-DL.DD5.1.H264-RARBG.mp4', key: 'vlc_4'}
			]},
			{title: 'CHI Papers', folder: true, children: [
				{title: 'PAPER_TITLES.txt'},
				{title: 'p76-wilson.pdf'},
				{title: 'p255-lobiaonco.pdf'},
				{title: 'W10-Baecker.pdf'},
				{title: 'W10-Benjamin.pdf'},
				{title: 'W10-Consolvo.pdf'},
				{title: 'W10-Gerling.pdf'},
				{title: 'W10-Hwang.pdf'},
				{title: 'W10-Lazar-1.pdf'},
				{title: 'W10-Lazar-2.pdf'},
			]},
			{title: 'Screenshots', folder: true, expanded: true, children: [
				{title: 'SCREENSHOTS.ppt'},
				{title: '1.jpg'},
				{title: '2.jpg'},
				{title: '3.jpg'},
				{title: '4.jpg'},
				{title: '5.jpg'},
				{title: '6.jpg'},
				{title: '7.jpg'},
				{title: '8.jpg'},
				{title: '9.jpg'},
				{title: '10.jpg'},
				{title: '11.jpg'},
				{title: '12.jpg'},
				{title: '13.jpg'},
				{title: '14.jpg'},
			]}
		],
		edit: {
			triggerStart: ['f2', 'dblclick', 'mac+enter']
		},
		activate: function(event, data) {
			// save notepad state
			config.notepad.content = $('#notepad').length ? $('#notepad').val() : config.notepad.content;
			
			if (data.node.title == 'PAPER_TITLES.txt') {
				console.log('Open Notepad!');
				if(w2ui['layout']) {
					w2ui['layout'].destroy();
					w2ui['sidebar'].destroy();
					w2ui['toolbar'].destroy();
				}
				html = `<textarea id="notepad" style="height:100%;width:100%">${config.notepad.content}</textarea>`;
				w2ui.myLayout.set('main',{title:'Notepad'});
				w2ui.myLayout.content('main', html);
			}
			else if (data.node.title == 'SCREENSHOTS.ppt') {
				console.log('Open Powerpoint!');
				html = `
					<div class="row">
						<div class="col-sm-12">
							<div id="toolbar"></div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12">
							<div id="main" style="height: 700px"></div>
						</div>
					</div>
				`;
				w2ui.myLayout.set('main', {title:'Screenshots'});
				w2ui.myLayout.content('main', html);

				$('#main').w2layout(ppt_config.layout);
				w2ui.layout.content('left', $().w2sidebar(ppt_config.sidebar));
				$('#toolbar').w2toolbar(toolbar);
				$(document).on('keydown', function(e) {
					if (e.keyCode == 40) {
						var n = Number(w2ui.sidebar.selected) % Number(w2ui.sidebar.nodes.length) + 1;
						w2ui.sidebar.select(n.toFixed())
						w2ui.sidebar.onClick()
						aure.addAction(new Action({
							type: 'keydown',
							data: 40,
							title: 'Keys: Down',
							icon: 'keyboard-o',
						}))
					}
				}) 

				w2ui['sidebar'].on('render',function(event) {
					ppt_config.sidebar.onClick();
				})

				$('#insert_button').on('click', function () {
					$('#dialog').dialog('close');
					$('#prompt').remove();
					id = Number(w2ui['sidebar'].selected)-1;
					if($('#tree').fancytree('getActiveNode')) {
						slide_information['image_titles'][id]	= $('#tree').fancytree('getActiveNode').title
					}
					else {
						slide_information['image_titles'][id] = 'ex.gif'
					}
					$('#active_img').attr('src','data/img/' + slide_information['image_titles'][id])
					aure.addAction(new Action({
						type: 'ppt-insert-image',
						data: {
							id: id,
							src: slide_information['image_titles'][id]
						},
						title: 'Insert a slide image', 
						icon: 'paperclip',
						list: []
					}))
				});
			}
			else if (data.node.title.indexOf('.pdf') !== -1) {
				if (w2ui['layout']) {
					w2ui['layout'].destroy();
					w2ui['sidebar'].destroy();
					w2ui['toolbar'].destroy();
				}
				console.log('Opening PDF!');
				w2ui.myLayout.set('main',{title:'PDF Viewer'});
				// Get the content to display on the PDF viewer
				var pdfContent = `
					<div id="pdf-content" style="height:100%">
						<object style="height:100%;width:100%" data="data/pdfs/CHI2011/1.html">
							Your browser doesn't support object tag :(
						</object>
					</div>`;
				w2ui.myLayout.content('main', pdfContent);
			}
		},
		// click: function(e, data) {
		// 	if( !data.node.folder ) {
		// 		console.log('onclick');
		// 		data.node.toggleSelected();
		// 	}
		// }
	});

	$('#myApps').w2layout(config.layout);
	w2ui.myLayout.content('main', '');

	$('#dialog').dialog({
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
});
