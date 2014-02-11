javascript:
  (function () {
    var v = '1.10.2';
    if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
      var done_jquery = false;
      var script = document.createElement('script');
      script.src = 'http://code.jquery.com/jquery-' + v + '.min.js';
      script.onload = script.onreadystatechange = function () {
        if (!done_jquery && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
          done_jquery = true;
        }
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    } else {
      if (jQuery.ui === undefined || jQuery.ui.version < v || typeof(jQuery.ui.button) == 'undefined') {
        var done_jqueryui = false;
        var script_ui = document.createElement('script');
//      http://code.jquery.com/ui/1.10.2/jquery-ui.js
        script_ui.src = 'http://code.jquery.com/ui/' + v + '/jquery-ui.js';
        script_ui.onload = script_ui.onreadystatechange = function () {
          if (!done_jqueryui && !done_jqueryui && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
            done_jqueryui = true;
            initsimfy2spotify()
          }
        };
        document.getElementsByTagName('head')[0].appendChild(script_ui);       
      }
      var timestamp = new Date().getTime();
      
      var cssui = document.createElement('link');
      cssui.type = 'text/css';
      cssui.rel = 'stylesheet';
      cssui.href = 'http://code.jquery.com/ui/' + v + '/themes/smoothness/jquery-ui.css';
      document.getElementsByTagName('head')[0].appendChild(cssui);  
      
      var cssbookmarklet = document.createElement('link');
      cssbookmarklet.type = 'text/css';
      cssbookmarklet.rel = 'stylesheet';
      cssbookmarklet.href = 'http://ntiedt.github.io/simfy2spotify/simfy2spotify.css?timestamp='+timestamp;
      document.getElementsByTagName('head')[0].appendChild(cssbookmarklet); 
    }
    function initsimfy2spotify() {
      (window.simfy2spotify = function () {
        var lang = navigator.language.slice(0,2).toUpperCase();
        var titlebar = '<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-1" class="ui-dialog-title">simfy2spotify</span><button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" role="button" aria-disabled="false" title="close"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span></button><button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-reload" role="button" aria-disabled="false" title="reload"><span class="ui-button-icon-primary ui-icon ui-icon-refresh"></span><span class="ui-button-text">reload</span></button></div>';
        var simfyPlaylist = '';
        var simfyPlaylistOut = '<table class="simfy-playlist ui-widget ui-widget-content"><thead><tr class="ui-widget-header"><th>Playlist:</th><th>Album:</th><th>Artist-Name:</th><th>Track-Title:</th><th>Length:</th><th>State:</th><th>Spotify-Links:</th></tr></thead><tbody>';
        simfyPlaylistOut += '<tfoot><tr class="all"><td class="playlist_title"></td><td class="album"></td><td class="artist_name"></td><td class="track_title"></td><td class="length"></td><td><a href="" class="spot-tracks notchecked">Check All</a></td><td class="spotify"></td></tr></tfoot>';
        playlist_title = $('h2.playlist_title').text();
        if(playlist_title.lastIndexOf(' - ')!=-1){
          album = playlist_title.slice(playlist_title.lastIndexOf(' - ')+3);
        }else{
          album = '';
        }
        $.each($('.tracks .track'), function (nr) {
          artist_name = $('.artist_name a', this).attr('title');
          track_title = $('.track_title_and_version_title .title', this).attr('title');
          length = $('.length', this).text();
          simfyPlaylist += artist_name + ',' + track_title + '\r\n'
          simfyPlaylistOut += '<tr id="row_'+nr+'"><td class="playlist_title"><input name="playlist_title" value="'+playlist_title+'" /></td><td class="album"><input name="playlist_title" value="'+album+'" /></td><td class="artist_name"><input name="playlist_title" value="'+artist_name+'" /></td><td class="track_title"><input name="playlist_title" value="'+track_title+'" /></td><td class="length"><input name="playlist_title" value="'+length+'" /></td><td><a href="" class="spot-track notchecked" data-row="row_'+nr+'">Check</a></td><td class="spotify"></td></tr>';
        });
        simfyPlaylistOut += '</tbody></table>';
        var simfyResult = $('<div>')
          .attr('class', 'simfy-result ui-dialog ui-widget ui-widget-content ui-corner-all ui-front')
          .css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'z-index': '9999',
            'width': 'auto',
            'height': 'auto',
            'padding': '1em',
            'background': 'white',
            'border': '1px solid black'
          })
          .html(titlebar+simfyPlaylistOut);
        if($('.simfy-playlist').length<1){
          simfyResult.appendTo('body');
        }else{
          simfyResult.html('.simfy-result');
        }
//         alert(simfyPlaylist);
        
        // EVENT: Click: Titlebar: close
        $('.simfy-result .ui-dialog-titlebar-close').click(function(e){
          alert('simfy2spotify closes and u must reload the page if you want to reuse it!');
          $('.simfy-result').remove();
        });
        
        // EVENT: Click: Titlebar: reload
        $('.simfy-result .ui-dialog-titlebar-reload').click(function(e){
          $('.simfy-result').remove();
          initsimfy2spotify();
        });
        
        // EVENT: Click: Spot single track
        $('a.spot-track').click(function(e){
          e.preventDefault();
          
          var cur_a = $(this);
          var cur_row = $('#'+cur_a.data('row'));
          
//           http://ws.spotify.com/search/1/track.json?q=track:%22Rolling%20In%20The%20Deep%22+AND+artist:%22adele%22+AND+album:%2221%22
          var url = 'http://ws.spotify.com/search/1/track.json?q=';
          var album = cur_row.find('.album input').val().replace(/\s/gi,'+');
          var artist_name = cur_row.find('.artist_name input').val().replace(/\s/gi,'+');
          var track_title = cur_row.find('.track_title input').val().replace(/\s/gi,'+');
          $.getJSON( url+'track:'+track_title+'+AND+artist:'+artist_name+'+AND+album:'+album, function( json ) {
            var num_results = json.info.num_results;
            var langresults = 0;
            var resultkey = 0;
            if(num_results==0){
              cur_a.text('Not found').removeClass('notchecked').addClass('notfound');
              return;
            }else{
              cur_a.text('Found').removeClass('notfound').addClass('found');
            }
            var tracks = [];
            $.each( json.tracks, function( key, albums) {
              if(albums.album.availability.territories.indexOf(lang)!=-1){
                langresults++;
                resultkey = key;
              }
            });
            if(langresults==0){
              cur_a.text('No result in your territory found!');
              return;
            }else if(langresults>1){
              cur_a.text('Too much results in your territory found!');
              return;
            }else{
              cur_row.find('.spotify').html('');
              $( "<a/>", {
                "class": "artist-link",
                "href": json.tracks[resultkey].artists[0].href,
                html: 'Artist'
              }).appendTo( cur_row.find('.spotify') );
              $( "<a/>", {
                "class": "album-link",
                "href": json.tracks[resultkey].album.href,
                html: 'Album'
              }).appendTo( cur_row.find('.spotify') );
              $( "<a/>", {
                "class": "track-link",
                "href": json.tracks[resultkey].href,
                html: 'Track'
              }).appendTo( cur_row.find('.spotify') );
            }
          });
          return false;
        });
        
        
        // EVENT: Click: Spot all tracks
        $('a.spot-tracks').click(function(e){
          e.preventDefault();
          
          var cur_a = $(this);
          var cur_rows = $('.simfy-playlist > tbody tr');
          var spotifyPlaylist = '';
          
          $.each(cur_rows, function(){
            var cur_row_id = $(this).attr('id');
            var cur_row = $('#'+cur_row_id);
            var cur_row_a = cur_row.find('a.spot-track');
            var url = 'http://ws.spotify.com/search/1/track.json?q=';
            var album = cur_row.find('.album input').val().replace(/\s/gi,'+');
            var artist_name = cur_row.find('.artist_name input').val().replace(/\s/gi,'+');
            var track_title = cur_row.find('.track_title input').val().replace(/\s/gi,'+');
            $.getJSON( url+'track:'+track_title+'+AND+artist:'+artist_name+'+AND+album:'+album, function( json ) {
              var num_results = json.info.num_results;
              var langresults = 0;
              var resultkey = 0;
              if(num_results==0){
                cur_row_a.text('Not found').removeClass('notchecked').addClass('notfound');
                return;
              }else{
                cur_row_a.text('Found').removeClass('notfound').addClass('found');
              }
              var tracks = [];
              $.each( json.tracks, function( key, albums) {
                if(albums.album.availability.territories.indexOf(lang)!=-1){
                  langresults++;
                  resultkey = key;
                }
              });
              if(langresults==0){
                cur_row_a.text('No result in your territory found!');
                return;
              }else if(langresults>1){
                cur_row_a.text('Too much results in your territory found!');
                return;
              }else{
                cur_row.find('.spotify').html('');
                $( "<a/>", {
                  "class": "artist-link",
                  "href": json.tracks[resultkey].artists[0].href,
                  html: 'Artist'
                }).appendTo( cur_row.find('.spotify') );
                $( "<a/>", {
                  "class": "album-link",
                  "href": json.tracks[resultkey].album.href,
                  html: 'Album'
                }).appendTo( cur_row.find('.spotify') );
                $( "<a/>", {
                  "class": "track-link",
                  "href": json.tracks[resultkey].href,
                  html: 'Track'
                }).appendTo( cur_row.find('.spotify') );
                
                if($('textarea.spotify-playlist').length<1){
                  $( "<textarea/>", {
                    "class": "spotify-playlist"
                  }).appendTo( $('.simfy-playlist tr.all').find('.spotify') );
                }
                $('textarea.spotify-playlist').val( $('textarea.spotify-playlist').val() + '\r\n' + json.tracks[resultkey].href );
              }
              $('textarea.spotify-playlist').focus().select();
            });
          });
          
          return false;
        });
        
        
      })()
    }
  }())
