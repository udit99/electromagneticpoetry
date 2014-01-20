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

amp.audio = {
  playSound: function(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.noteOn(time);
  }
};
amp.buffers = {};
amp.buffers.snare = null;
amp.buffers.hihat = null;
amp.context = new webkitAudioContext();
amp.loadSound = function(url, hash_store, key) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    amp.context.decodeAudioData(request.response, function(buffer) {
      hash_store[key] = buffer;
    }, function(){console.log("erroe happened");});
  }
  request.send();
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
