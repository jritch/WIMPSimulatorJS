$(function(){
  $("#tree").fancytree({
    selectMode: 3,

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
    activate: function(event, data){
      $("#statusLine").text(event.type + ": " + data.node);
    },
    select: function(event, data){
      $("#statusLine").text(event.type + ": " + data.node.isSelected() +
                            " " + data.node);
    }
  });

  // Select a node on click
  $("#button1").click(function(){
    var tree = $("#tree").fancytree("getTree"),
        node = tree.getNodeByKey("id3.1");

    node.toggleSelected();
  });
});
