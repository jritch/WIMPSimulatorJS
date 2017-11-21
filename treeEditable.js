$(function(){
  $("#tree").fancytree({
    extensions: ["edit"],
    source: [  // Typically we would load using ajax instead...

      {title: "TV Shows", folder: true, expanded: true, children: [
        {title: "The.Good.Place.S01E01.HDTV.HebSubs.XviD-AFG.avi", key: "vlc_1"},
        {title: "The.Good.Place.S01E02.1080p.HDTV.x264-CROOKS.mp4", key: "vlc_2"},
        {title: "The.Good.Place.S01E03.HDTV.x264-KILLERS.mp4", key: "vlc_3"},
        {title: "The.Walking.Dead.S08E01.1080p.WEB-DL.DD5.1.H264-RARBG.mp4", key: "vlc_4"}
      ]},
      {title: "CHI Papers", folder: true, children: [
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
        setTimeout(function(){
          $(data.node.span).removeClass("pending");
          // Let's pretend the server returned a slightly modified
          // title:
          data.node.setTitle(data.node.title + "!");
        }, 2000);
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
    }
  });
});
