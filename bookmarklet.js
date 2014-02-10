javascript:
  (function () {
    if (window.simfy2spotify === undefined) {
      var done = false;
      var script = document.createElement('script');
      var timestamp = new Date().getTime();
      script.src = 'http://ntiedt.github.io/simfy2spotify/simfy2spotify.js?timestamp='+timestamp;
      document.getElementsByTagName('head')[0].appendChild(script)
    }
  }())