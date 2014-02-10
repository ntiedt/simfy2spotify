javascript:
  (function () {
    if (window.simfy2spotify === undefined) {
      var done = false;
      var script = document.createElement('script');
      var timestamp = new Date().getTime();
      script.src = 'http://rawgithub.com/ntiedt/simfy2spotify/master/simfy2spotify.js?timestamp='+timestamp;
      document.getElementsByTagName('head')[0].appendChild(script)
    }
  }())