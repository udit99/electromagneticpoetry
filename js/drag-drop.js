var amp = {};
amp.words = ["hello", "world"]
amp.locationSortedWords = function(){
  var words = _.map(amp.words, function(a){ 
    return {
      name: a,
      left_location: $("#"+ a).offset().left
    };
  });
   return _.sortBy(words, function(b){return b.left_location});

}
$(function(){
  $("#hello").draggable({containment: "#jail"});
  $("#world").draggable({containment: "#jail"});
  $("#container").droppable({
    drop: function(evt, ui){
      console.log("drop");
    } 
  })
})
