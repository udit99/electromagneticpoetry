var emp = {};
emp.words = ["unconsciousness", "mosquito", "honey", "tears", "bright_eyes"]
emp.locationSortedWords = function(){
  var words = _.map(emp.words, function(a){ 
    return {
      name: a,
      left_location: $("#"+ a).offset().left
    };
  });
   return _.sortBy(words, function(b){return b.left_location});
}

emp.sortedWordsWithRelativeDistances = function(){
  var sortedWords = this.locationSortedWords();
  return _.map(sortedWords, function(word, index, words){
    var firstWordLeftOffset = words[0].left_location;
    return {
      name: word.name,
      relative_location: (word.left_location - firstWordLeftOffset)
    };
  });
}

emp.audio = {
  playSound: function(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.noteOn(time);
  }
};
emp.buffers = {};
emp.context = new webkitAudioContext();
emp.loadSound = function(url, hash_store, key) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    emp.context.decodeAudioData(request.response, function(buffer) {
      hash_store[key] = buffer;
    }, function(){console.log("erroe happened");});
  }
  request.send();
}
emp.playSound = function(bufferName, time) {
  var source = emp.context.createBufferSource();
  source.buffer = emp.buffers[bufferName];
  source.connect(emp.context.destination);
  source.noteOn(time);
} 

emp.playWords = function(){
  _.each(this.sortedWordsWithRelativeDistances(), function(word){
    emp.playSound(word.name, emp.context.currentTime + word.relative_location/1000)
  
  });

}

emp.createWords = function(){
  _.each(this.words, function(word){
    var wordElement = document.createElement("div");
    $(wordElement).attr("id", word);
    $(wordElement).attr("class", "word");
    $(wordElement).text(word);
    $("#holding").append(wordElement);
  })

}

$(function(){
  _.each(emp.words, function(word){
    emp.loadSound("http://localhost:3002/"+ word +".wav", emp.buffers,word);
  })
  $("#container").droppable({
    drop: function(evt, ui){
      console.log("drop");
    } 
  })
  emp.createWords();
  _.each(emp.words, function(word){$("#" + word).draggable({containment: "#jail"})});
})
