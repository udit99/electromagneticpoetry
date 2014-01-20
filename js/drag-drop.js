var amp = {};
amp.words = ["hello", "world", "steve"]
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
  var sortedWords = this.locationSortedWords();
  return _.map(sortedWords, function(word, index, words){
    var leftOffsetIncludingWidth = 0;
    if(index != 0){
      var previous_word = words[index - 1]
      leftOffsetIncludingWidth = previous_word.left_location + $("#" + previous_word.name).width();
    }else{
      leftOffsetIncludingWidth = word.left_location;
    }
    return {
      name: word.name,
      relative_location: (word.left_location - leftOffsetIncludingWidth)
    };
  });
}
$(function(){
  _.each(amp.words, function(word){$("#" + word).draggable({containment: "#jail"})});
  $("#hello").draggable({containment: "#jail"});
  $("#world").draggable({containment: "#jail"});
  $("#container").droppable({
    drop: function(evt, ui){
      console.log("drop");
    } 
  })
})
