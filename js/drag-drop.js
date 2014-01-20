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
    var firstWordLeftOffset = words[0].left_location;
    return {
      name: word.name,
      relative_location: (word.left_location - firstWordLeftOffset)
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
amp.playSound = function(bufferName, time) {
  var source = amp.context.createBufferSource();
  source.buffer = amp.buffers[bufferName];
  source.connect(amp.context.destination);
  source.noteOn(time);
} 

amp.playWords = function(){
  _.each(this.sortedWordsWithRelativeDistances(), function(word){
    amp.playSound(word.name, amp.context.currentTime + word.relative_location/1000)
  
  });

}

$(function(){
  _.each(amp.words, function(word){
    amp.loadSound("http://localhost:3002/"+ word +".wav", amp.buffers,word);
  })
  _.each(amp.words, function(word){$("#" + word).draggable({containment: "#jail"})});
  $("#hello").draggable({containment: "#jail"});
  $("#world").draggable({containment: "#jail"});
  $("#container").droppable({
    drop: function(evt, ui){
      console.log("drop");
    } 
  })
})
