window.onload = function()
{
  var min = 5;
  var max = 20;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new window.AudioContext();
  var source;
  var files;
  function playSound(arraybuffer) {
    context.decodeAudioData(arraybuffer, function (buf) {
      this.source = context.createBufferSource();
      this.source.connect(context.destination);
      this.source.buffer = buf;
      this.source.start(0);
    });
  }

  function stopSound(sec) {
    window.setTimeout(function() {
      this.source.stop(0);
    }, sec * 1000);
  }

  function handleFileSelect(evt) {
    files = evt.target.files; // FileList object
  }

  function playFile(file) {
    var freader = new FileReader();

    freader.onload = function (e) {
      console.log(e.target.result);
      playSound(e.target.result);
      stopSound(randomSec(min, max));
    };
    freader.readAsArrayBuffer(file);
  }

  function randomSec(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  player = document.getElementById('player');
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  document.getElementById('play').onclick = function () {
    fileindex = Math.floor(Math.random() * (files.length - 1) + 1);
    f = files[fileindex]
    playFile(f);
    document.getElementById('playing').innerHTML = f.name;
  };
};
