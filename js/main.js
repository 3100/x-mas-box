window.onload = function()
{
  var min = 5;
  var max = 20;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new window.AudioContext();
  var source;
  var files;

  var playing = false;

  // for pause
  var startOffset = 0;
  var startTime = 0;
  var duration;
  var oldbuf;

  function playSound(arraybuffer) {
    playing = true;
    startTime = context.currentTime;
    context.decodeAudioData(arraybuffer, function (buf) {
      this.source = context.createBufferSource();
      this.source.connect(context.destination);
      this.source.buffer = buf;
      this.source.loop = true;
      duration = buf.duration;
      oldbuf = buf;
      this.source.start(0, startOffset % duration);
    });
  }

  function replay() {
    playing = true;
    this.source = context.createBufferSource();
    this.source.connect(context.destination);
    this.source.buffer = oldbuf;
    this.source.loop = true;
    duration = oldbuf.duration;
    this.source.start(0, startOffset % duration);
  }

  function stopSound(sec, pauses) {
    window.setTimeout(function() {
      this.source.stop(0);
      playing = false;
      startOffset += context.currentTime - startTime;
      if (pauses && Math.random() < 0.5) {
        window.setTimeout(function() {
          replay();
          stopSound(sec);
        }, 1200);
      }
    }, sec * 1000);
  }

  function handleFileSelect(evt) {
    files = evt.target.files; // FileList object
    listdom = document.getElementById('list');
    for (var i = 0; i < files.length; ++i) {
      li = document.createElement("li");
      li.setAttribute("class", "alert");
      li.innerHTML = files[i].name;
      listdom.appendChild(li);
    }
  }

  function playFile(file, pauses) {
    var freader = new FileReader();

    freader.onload = function (e) {
      console.log(e.target.result);
      playSound(e.target.result);
      stopSound(randomSec(min, max), pauses);
    };
    freader.readAsArrayBuffer(file);
  }

  function randomSec(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  player = document.getElementById('player');
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  document.getElementById('play').onclick = function () {
    if (playing == true) {
      return false;
    }
    startOffset = 0;
    fileindex = Math.floor(Math.random() * (files.length - 1) + 1);
    f = files[fileindex];
    pauses = document.getElementById('pauses').checked;
    playFile(f, pauses);
    lis = document.getElementsByClassName('alert');
    for(var i = 0; i < lis.length; ++i) {
      if (i == fileindex) {
        lis[fileindex].setAttribute("class", "alert primary");
      } else {
        lis[i].setAttribute("class", "alert");
      }
    }
  };
};
