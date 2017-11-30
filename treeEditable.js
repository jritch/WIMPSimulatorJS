
function blur_event (id)   {
  console.log("???????")
  slide_information["text"][id] = $("#slide_txt").text();
  // TODO: Add to action list an append text action
  // #TODO: Add to action list an insert action
  a = new Action('Add slide text', 'font');
  actionList.push(a)
}

 var slide_information = {
     text:[],
     image_titles:[]
   }

var ppt_config = {
    layout: {
        name: 'layout',
        padding: 0,
        panels: [
            { type: 'left', size: 200, resizable: false, minSize: 120, title: 'Slides'  },
            { type: 'main', minSize: 550, overflow: 'hidden' }
        ]
    },
    sidebar: {
        name: 'sidebar',
        nodes: [
                { id: '1', text: 'Slide 1', img: 'MyIcon1', selected: true },
        ],

        onLoad: function (event) {sidebar.onClick(event);},

        onClick: function (event) {
            if (event) {
                var id = Number(event.target) - 1;
            }
            else {
              var id = 0;
            }

            w2ui.layout.content('main', '<div style="width:80%;padding:20px;height:80%; margin: auto; background-color:white">'+
              '<div style="padding: 10px;border: 1px; border-style:dashed" onblur="blur_event('+String(id)+ ')" contenteditable="true">'
              + "<span id=slide_txt>Edit to Insert Text.</span>" +  '</div><br><div onclick="$(\'#dialog\' ).dialog( \'open\' );" style="padding: 10px; border: 1px; border-style:dashed;height:90%">'
              + "<span id='prompt'>Click to Insert Image.</span>" +'<br><img style="margin:auto;" id="active_img"></div></div>'
            );

            $(w2ui.layout.el('main'))
                .css({
                    'border-left': '1px solid silver',
                    'padding ': '100px'
                });

            if (event){

              // show an image if it's been added
              if (slide_information["image_titles"].length > id){
                //console.log("YEAH WE IN THIS CASE BOY")
                $("#active_img").attr("src",slide_information["image_titles"][id]);
                $("#prompt").remove();
              }

              // Show the correct text if it's been added
              if (slide_information["text"].length > id){
                $("#slide_txt").text(slide_information["text"][id]);
              }

            }
        }
    },

};

var toolbar = {
  name: 'toolbar',
  items : [
    {type:'button', caption: 'Insert Slide', img: 'icon-folder'}
  ],
  onClick: function(event) {
    num = String(w2ui["sidebar"].nodes.length + 1)
    w2ui['sidebar'].add({ id: num, text: 'Slide '+ num, img: 'MyIcon1', })
    a = new Action('Insert a slide', 'copy');
    actionList.push(a);
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
    content: ""
  },
  pdfviewer: {
    HTML: "<textarea id='PDFViewer' rows='50' cols='100'></textarea>",
    content: ""
  },

};

$(function(){
  $("#tree").fancytree({
    extensions: ["edit"],
    selectMode: 2,
    source: [  // Typically we would load using ajax instead...

      {title: "TV Shows", folder: true, expanded: true, children: [
        {title: "The.Good.Place.S01E01.HDTV.HebSubs.XviD-AFG.avi", key: "vlc_1"},
        {title: "The.Good.Place.S01E02.1080p.HDTV.x264-CROOKS.mp4", key: "vlc_2"},
        {title: "The.Good.Place.S01E03.HDTV.x264-KILLERS.mp4", key: "vlc_3"},
        {title: "The.Walking.Dead.S08E01.1080p.WEB-DL.DD5.1.H264-RARBG.mp4", key: "vlc_4"}
      ]},
      {title: "CHI Papers", folder: true, children: [
        {title: "PAPER_TITLES.txt"},
        {title: "p76-wilson.pdf"},
        {title: "p255-lobiaonco.pdf"},
        {title: "W10-Baecker.pdf"},
        {title: "W10-Benjamin.pdf"},
        {title: "W10-Consolvo.pdf"},
        {title: "W10-Gerling.pdf"},
        {title: "W10-Hwang.pdf"},
        {title: "W10-Lazar-1.pdf"},
        {title: "W10-Lazar-2.pdf"},
      ]},
      {title: "Screenshots", folder: true, children: [
        {title: "SCREENSHOTS.ppt"},
        {title: "1.png"},
        {title: "2.png"},
        {title: "3.png"},
        {title: "4.png"},
        {title: "5.png"},
        {title: "6.png"},
        {title: "7.png"},
        {title: "8.png"},
        {title: "9.png"},
        {title: "10.png"},
        {title: "11.png"},
        {title: "12.png"},
        {title: "13.png"},
        {title: "14.png"},
      ]}
    ],
    lazyLoad: function(event, data) {
      data.result = { url: "ajax-sub2.json", debugDelay: 1000 };
    },
    edit: {
      triggerStart: ["f2", "dblclick", "shift+click", "mac+enter"],
      beforeEdit: function(event, data){
        // Return false to prevent edit mode
      },
      edit: function(event, data){
        // Editor was opened (available as data.input)
      },
      beforeClose: function(event, data){
        // Return false to prevent cancel/save (data.input is available)
        console.log(event.type, event, data);
        if( data.originalEvent.type === "mousedown" ) {
          // We could prevent the mouse click from generating a blur event
          // (which would then again close the editor) and return `false` to keep
          // the editor open:
//                  data.originalEvent.preventDefault();
//                  return false;
          // Or go on with closing the editor, but discard any changes:
//                  data.save = false;
        }
      },
      save: function(event, data){
        // Save data.input.val() or return false to keep editor open
        console.log("save...", this, data);
        // Simulate to start a slow ajax request...
        //setTimeout(function(){
          //$(data.node.span).removeClass("pending");
          // Let's pretend the server returned a slightly modified
          // title:
          //data.node.setTitle(data.node.title + "!");
        //}, 2000);
        // We return true, so ext-edit will set the current user input
        // as title
        return true;
      },
      close: function(event, data){
        // Editor was removed
        if( data.save ) {
          // Since we started an async request, mark the node as preliminary
          $(data.node.span).addClass("pending");
        }
      }
    },
    activate: function(event, data){
        var textArea = document.getElementById("notepad");
        if (textArea != null) config.notepad.content = textArea.value;
        if (data.node.title == 'PAPER_TITLES.txt') {
          if(w2ui['layout']) {
            w2ui['layout'].destroy();
            w2ui['sidebar'].destroy();
            w2ui['toolbar'].destroy();
          }
          console.log("Open Notepad!");
          html = "<textarea id='notepad' style='height:100%;width:100%'>" + config.notepad.content + "</textarea>";
          w2ui.myLayout.set('main',{title:"Notepad"});
          w2ui.myLayout.content('main', html);
        }
        else if (data.node.title == "SCREENSHOTS.ppt"){
          console.log("Open Powerpoint!");
          html = '<div class="row"><div class="col-sm-12"><div id="toolbar"></div></div></div><div class="row"><div class="col-sm-12"><div id="main" style="height: 700px"></div></div></div>';
          w2ui.myLayout.set('main',{title:"Screenshots"});
          w2ui.myLayout.content('main', html);

          $('#main').w2layout(ppt_config.layout);
          w2ui.layout.content('left', $().w2sidebar(ppt_config.sidebar));
          // in memory initialization
          $().w2grid(ppt_config.grid2);

          $('#toolbar').w2toolbar(toolbar);
          w2ui["sidebar"].on('render',function(event){

            ppt_config.sidebar.onClick();})
          w2ui["sidebar"].on("refresh", function(event){
            $(".hack").remove();
            $(".MyIcon1").after("<br class='hack' clear=all>");

          })

          $('#insert_button').on("click", function () {
            $("#dialog").dialog("close");
            $("#prompt").remove();
            id = Number(w2ui['sidebar'].selected)-1;
            //TODO: change this to the correct image title
            if($("#tree").fancytree("getActiveNode")) {
              slide_information["image_titles"][id]  = $("#tree").fancytree("getActiveNode").title
            }
            else {
              slide_information["image_titles"][id] = "ex.gif"
            }
            $("#active_img").attr("src",slide_information["image_titles"][id])

            // #TODO: Add to action list an insert action
            a = new Action('Insert a slide image', 'paperclip');
            actionList.push(a)
          });


        }
         else if (data.node.title.indexOf(".pdf") !== -1) {
          if(w2ui['layout']) {
            w2ui['layout'].destroy();
            w2ui['sidebar'].destroy();
            w2ui['toolbar'].destroy();
          }
          console.log("Opening PDF!");
          w2ui.myLayout.set('main',{title:"PDF Viewer"});
          // Get the content to display on the PDF viewer
          var pdfcontent = "<div id='PDFContent' style='height:100%'><object style='height:100%;width:100%' data='data/pdfs/CHI2011/index.html'>Your browser doesn't support object tag :(</object></div>";
          w2ui.myLayout.content('main', pdfcontent);
        }
      },
      click: function(e, data) {
   if( ! data.node.folder ){
     data.node.toggleSelected();
   }
  }
  });
});

$(function () {
  $('#myApps').w2layout(config.layout);
  w2ui.myLayout.content('main', "");
});

$(function() {
  $( "#dialog" ).dialog({
    autoOpen: false,
    show: {
      effect: "blind",
      duration: 100
    },
    hide: {
      effect: "explode",
      duration: 1000
    }
  });
});
