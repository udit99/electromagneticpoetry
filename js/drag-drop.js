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

amp.sortedWordsWithRelativeDistances = function(){
  var startingOffset = this.locationSortedWords()[0].left_location;
  var sortedWords = this.locationSortedWords();
  return _.map(sortedWords, function(word){
    return {
      name: word.name,
      relative_location: (word.left_location - startingOffset)
    };
  });
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
