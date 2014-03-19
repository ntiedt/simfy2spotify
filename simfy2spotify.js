javascript:
  (function () {
    var v = '1.10.2';
    var url = '';
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
        var tracks = [];
        // Get language for territory restriction
        var lang = navigator.language.slice(0,2).toUpperCase();
        var ll = {
          tBarHomeUrl: 'http://ntiedt.github.io/simfy2spotify/',
          tBarTitle: 'simfy2spotify (1.2.4)',
          tBarBtClose: 'Close',
          tBarBtMaximize: 'Maximize',
          tBarBtMaximizeText: '&#9723;',
          tBarBtMinimize: 'Minimize',
          tBarBtMinimizeText: '_',
          tBarBtReload: 'Reload',
          tBarBtClose: 'Maximize',
          tBarBtClose: 'Maximize',
          tBarBtClose: 'Maximize',
          tBarBtClose: 'Maximize',
          tBarBtClose: 'Maximize',
          tBarBtClose: 'Maximize',
          
          tableHeader1: 'Playlist:',
          tableHeader2: 'Album:',
          tableHeader3: 'Artist-Name:',
          tableHeader4: 'Track-Title:',
          tableHeader5: 'Length:',
          tableHeader6: 'State:',
          tableHeader7: 'Results: (Sorted by Popularity)',
          tableHeader8: 'Length:',
          tableHeader9: 'Spotify-Links:',
          btCheck: 'Check',
          btCheckAll: 'Check All',
          btClose: 'simfy2spotify closes and u must reload the page if you want to reuse it!',
          buildPlaylist: 'Build playlist',
          select1: 'Please select!',
          noResultFound: 'No result found! Recheck track-title only?',
          found: 'Found',
          foundLength: 'Found with different length',
          noResultFoundButWithOtherLength1: 'Found: Same length:',
          noResultFoundButWithOtherLength2: ' Other length:',
          noResultFoundButWithOtherLength3: ' First selected!',
          tooMuch1: 'Found: Same length:',
          tooMuch2: ' First selected!',
          errorNoSpotifyLinks: 'Error! No spotify links could be found! Please verify your inputs and recheck!',
          errorNotAllSpotifyLinks1: 'Warning! Could not extract all(',
          errorNotAllSpotifyLinks2: ') spotify link from all(',
          errorNotAllSpotifyLinks3: ') rows!',
          copyC: 'After closing this message press CTRL + C to copy your playlist!'
        }
        
        /**
         * Extract simfy playlist and build table with buttons
         */
        function extractSimfy() {
          var titlebar = '<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-1" class="ui-dialog-title"><a href="'+ll.tBarHomeUrl+'" target="_blank" class="simfy2spotify-home">'+ll.tBarTitle+'</a><span class="title-playlist"></span></span><div class=""><button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" role="button" aria-disabled="false" title="'+ll.tBarBtClose+'"><span class="ui-button-icon-primary ui-icon ui-icon-close"></span><span class="ui-button-text">'+ll.tBarBtClose+'</span></button><button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-dialog-titlebar-maximize" role="button" aria-disabled="false" title="'+ll.tBarBtMaximize+'"><span class="ui-button-text">'+ll.tBarBtMaximizeText+'</span></button><button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-dialog-titlebar-minimize" role="button" aria-disabled="false" title="'+ll.tBarBtMinimize+'"><span class="ui-button-text">'+ll.tBarBtMinimizeText+'</span></button><button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-reload" role="button" aria-disabled="false" title="'+ll.tBarBtReload+'"><span class="ui-button-icon-primary ui-icon ui-icon-refresh"></span><span class="ui-button-text">'+ll.tBarBtReload+'</span></button></div></div>';
          var simfyPlaylistOut = '<table class="simfy-playlist ui-widget ui-widget-content"><thead><tr class="ui-widget-header"><th>'+ll.tableHeader1+'</th><th>'+ll.tableHeader2+'</th><th>'+ll.tableHeader3+'</th><th>'+ll.tableHeader4+'</th><th>'+ll.tableHeader5+'</th><th>'+ll.tableHeader6+'</th><th>'+ll.tableHeader7+'</th><th>'+ll.tableHeader8+'</th></tr></thead><tbody>';
          simfyPlaylistOut += '<tfoot><tr class="all"><td class="playlist_title"></td><td class="album"></td><td class="artist_name"></td><td class="track_title"></td><td class="length"></td><td><a href="" class="spot-tracks notchecked">'+ll.btCheckAll+'</a><a href="" class="build-playlist notchecked">'+ll.buildPlaylist+'</a></td><td class="results"></td><td class="spotify"></td></tr></tfoot>';
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
            simfyPlaylistOut += '<tr id="row_'+nr+'"><td class="playlist_title"><input value="'+playlist_title+'" /></td><td class="album"><input value="'+album+'" /></td><td class="artist_name"><input value="'+artist_name+'" /></td><td class="track_title"><input value="'+track_title+'" /></td><td class="length"><input value="'+length+'" /></td><td><a href="" class="spot-track notchecked" data-row="row_'+nr+'">'+ll.btCheck+'</a></td><td class="results"></td><td class="spotify"></td></tr>';
          });
          simfyPlaylistOut += '</tbody></table>';
          var simfyResult = $('<div>')
            .attr('class', 'simfy-result ui-dialog ui-widget ui-widget-content ui-corner-all ui-front')
            .html(titlebar+simfyPlaylistOut);
          if($('.simfy-playlist').length<1){
            simfyResult.appendTo('body');
          }else{
            simfyResult.html('.simfy-result');
          }
          $('.title-playlist').html(' [Simfy Playlist: '+playlist_title+']');
          
//           $('.simfy-result').append('<table class="dbg"></table>');
        }
        
        
        /**
         * Build spotify search url for json request
         * @param {Object} cur_row - current row
         * @param {Boolean} recheck - but only track title
         * @return {string} url
         */
        function getUrl(cur_row,recheck) {
          var url = 'http://ws.spotify.com/search/1/track.json?q=track:';
          var track_title = encodeURIComponent(cur_row.find('.track_title input').val()).replace(/\s/gi,'+');
          if(recheck){
            url = url+track_title;
          }else{
            var album = (cur_row.find('.album input').length>0)? encodeURIComponent(cur_row.find('.album input').val()).replace(/\s/gi,'+').replace(/:/g,'+') : encodeURIComponent(cur_row.find('.album select').val()).replace(/\s/gi,'+').replace(/:/g, '+');
            var artist_name = encodeURIComponent(cur_row.find('.artist_name input').val().replace(/\s/gi,'+'));
            url = (album=='')?url+track_title+'+AND+artist:'+artist_name:url+track_title+'+AND+artist:'+artist_name+'+AND+album:'+album;
          }
          return url;
        }
        
        /**
         * Convert time(min:sek e.g. 04:41) to seconds
         * @param {string} time
         * @return {string} seconds
         */
        function getSeconds(time){
          var ts = time.split(':');
          return Date.UTC(1970, 0, 1, 0, ts[0], ts[1]) / 1000;
        }
        
        /**
         * Convert seconds to time(min:sec)
         * @param {int} seconds
         * @return {string} time
         */
        function getTrackTime(time){
          var min = Math.floor(time / 60);
          var sec = time - min * 60;
          return min+':'+sec;
        }
        
        /**
         * Build album drop down
         * @param {json} results - found album results
         * @param {object} cur_row
         * @param {int} resultkey - first found track with correct specified length
         */
        function buildAlbums(results,cur_row,resultkey) {
          cur_row.find('.results').html($( '<select/>').html( $('<option/>', {'value': '', 'text': ll.select1}) ));
          $.each( results, function( key, track) {
            if(resultkey==key){
              $('<option/>', {'selected': 'selected', 'value': track.album.name, 'data-length': Math.round(track.length), 'data-album-href': track.album.href, 'data-track-href': track.href, 'data-artist-href': track.artists[0].href, 'text': track.album.name + ' / Released: ' + track.album.released + ' Length: ' + getTrackTime(Math.round(track.length)) + ' Track-Nr.: ' + track['track-number'] + ' Track-Popularity: ' + track.popularity }).appendTo( cur_row.find('.results > select') );
            }else{
              $('<option/>', {'value': track.album.name, 'data-length': Math.round(track.length), 'data-album-href': track.album.href, 'data-track-href': track.href, 'data-artist-href': track.artists[0].href, 'text': track.album.name + ' / Released: ' + track.album.released + ' Length: ' + getTrackTime(Math.round(track.length)) + ' Track-Nr.: ' + track['track-number'] + ' Track-Popularity: ' + track.popularity }).appendTo( cur_row.find('.results > select') );
            }
            cur_row.find('.results > select').on('change',function(){
              if($(this).val()!=''){
                artist = cur_row.find('.results select option:selected').data('artist-href');
                album = cur_row.find('.results select option:selected').data('album-href');
                track = cur_row.find('.results select option:selected').data('track-href');
                buildSpotifyLinksFromOption(artist,album,track,cur_row.find('.spotify'));
              }
            });
          });
        }
        
        /**
         * extract spotify results from json
         * @param {json} json
         * @param {object} cur_a
         */
        function extractResults(json,cur_a){
          var cur_row = $('#'+cur_a.data('row'));
          var num_results = json.info.num_results;
          var num_langresults = -1;
          var num_lengthresults = -1;
          var resultkey = -1;
          var resultkeywithoutlength = -1;
          var results = [];
          var resultswithoutlength = [];
          var length = (cur_row.find('.results select').length>0) ? cur_row.find('.results select option:selected').data('length') : getSeconds(cur_row.find('.length input').val());
          if(num_results==0){
            cur_a.text('Not found').removeClass('notchecked notfound toomuch found').addClass('notfound');
            return;
          }
          $.each( json.tracks, function( key, track) {
            if(track.album.availability.territories.indexOf(lang)!=-1){
              num_langresults++;
              resultswithoutlength.push(track);
              if(resultkeywithoutlength==-1) {
                resultkeywithoutlength = num_langresults;
              }
              if(Math.round(track.length)==length){
                num_lengthresults++;
                results.push(track);
                if(resultkey==-1) {
                  resultkey = num_lengthresults;
                }
              }
            }
          });
          // No results with corresponding length
          if(num_lengthresults==-1){
            // No results with corresponding lang -> No result
            if(num_langresults==-1){
              cur_a.text(ll.noResultFound).removeClass('notchecked notfound toomuch found').addClass('notfound recheck');
              return;
            // Single result with corresponding lang
            }else if(num_langresults==0){
              cur_a.text(ll.foundLength).removeClass('notchecked notfound toomuch found recheck').addClass('found');
              buildSpotifyLinks(resultswithoutlength[resultkeywithoutlength],cur_row.find('.spotify'));
            // Too much results with corresponding lang
            }else{
              cur_a.html(ll.noResultFoundButWithOtherLength1+(num_lengthresults+1)+ll.noResultFoundButWithOtherLength2+(num_langresults+1)+ll.noResultFoundButWithOtherLength3).removeClass('notchecked notfound toomuch found recheck').addClass('toomuch');
//               cur_a.html(ll.noResultFoundButWithOtherLength1+(num_langresults+1)+ll.noResultFoundButWithOtherLength2).removeClass('notchecked notfound toomuch found').addClass('toomuch');
              buildAlbums(resultswithoutlength,cur_row,resultkeywithoutlength);
              buildSpotifyLinks(resultswithoutlength[resultkeywithoutlength],cur_row.find('.spotify'));
            }
          // Too much results with corresponding length
          }else if(num_lengthresults>0){
            cur_a.text(ll.tooMuch1+(num_lengthresults+1)+ll.tooMuch2).removeClass('notchecked notfound toomuch found recheck').addClass('toomuch');
            buildAlbums(results,cur_row,resultkeywithoutlength);
            buildSpotifyLinks(resultswithoutlength[resultkeywithoutlength],cur_row.find('.spotify'));
          // Single result with corresponding length
          }else{
            cur_a.text(ll.found).removeClass('notchecked notfound toomuch found recheck').addClass('found');
            buildSpotifyLinks(results[resultkey],cur_row.find('.spotify'));
          }
        }
        
        /**
         * Build spotify links from single json
         * @param {json} track
         * @param {object} target - where to insert
         */
        function buildSpotifyLinks(track,target) {
          target.html('');
          $( '<a/>', {
            'class': 'artist-link',
            'href': track.artists[0].href,
            html: 'Artist'
          }).appendTo( target );
          $( '<a/>', {
            'class': 'album-link',
            'href': track.album.href,
            html: 'Album'
          }).appendTo( target );
          $( '<a/>', {
            'class': 'track-link',
            'href': track.href,
            html: 'Track'
          }).appendTo( target );
        }
        
        /**
         * Build spotify links from option datas
         * @param {string} artist
         * @param {string} album
         * @param {string} track
         * @param {object} target - where to insert
         */
        function buildSpotifyLinksFromOption(artist,album,track,target) {
          target.html('');
          $( '<a/>', {
            'class': 'artist-link',
            'href': artist,
            html: 'Artist'
          }).appendTo( target );
          $( '<a/>', {
            'class': 'album-link',
            'href': album,
            html: 'Album'
          }).appendTo( target );
          $( '<a/>', {
            'class': 'track-link',
            'href': track,
            html: 'Track'
          }).appendTo( target );
        }
        
        /**
         * Build spotify playlist (all)
         * @param {string} spotifylink
         */
        function buildPlaylist(spotifylink) {
          if($('textarea.spotify-playlist').length<1){
            $( '<textarea/>', {
              'class': 'spotify-playlist'
            }).appendTo( $('.simfy-playlist tr.all').find('.spotify') );
          }
          $('textarea.spotify-playlist').val( $('textarea.spotify-playlist').val() + '\r\n' + spotifylink );
        }
        
        /**
         * Converts json to string for debugging purpose
         * @param {json} json
         * @return {string} json
         */
        function jsontostring(json) {
          return JSON.stringify(json).replace(',', ', ').replace('[', '').replace(']', '');
        }
        
        // Extract simfy datas
        extractSimfy();
        
        // EVENT: Titlebar: Click: reload
        $('.simfy-result .ui-dialog-titlebar-reload').click(function(e){
          $('.simfy-result').remove();
          initsimfy2spotify();
        });
        
        // EVENT: Titlebar: Click: maximize
        $('.simfy-result .ui-dialog-titlebar-maximize').click(function(e){
          $('.simfy-playlist').show();
        });
        
        // EVENT: Titlebar: Click: minimize
        $('.simfy-result .ui-dialog-titlebar-minimize').click(function(e){
          $('.simfy-playlist').hide();
        });
        
        // EVENT: Titlebar: Click: close
        $('.simfy-result .ui-dialog-titlebar-close').click(function(e){
          alert(ll.btClose);
          $('.simfy-result').remove();
        });
        
        // EVENT: Click: Spot single track
        $('a.spot-track').click(function(e){
          e.preventDefault();
          
          var cur_a = $(this);
          var cur_row = $('#'+$(this).data('row'));
          
          $.getJSON( getUrl($(cur_row),cur_a.is('.recheck')), function( json ) {
            extractResults(json,cur_a);
          });
          return false;
        });
        
        
        // EVENT: Click: Spot all tracks
        $('a.spot-tracks').click(function(e){
          e.preventDefault();
          
          var cur_rows = $('.simfy-playlist > tbody tr');
          var spotifyPlaylist = '';
          
          $.each(cur_rows, function(){
            var cur_row = $(this);
            var cur_a = cur_row.find('a.spot-track');
            $.getJSON( getUrl($(cur_row)), function( json ) {
              extractResults(json,cur_a,1);
            });
          });
          
          return false;
        });
        
        
        // EVENT: Click: Build playlist
        $('a.build-playlist').click(function(e){
          e.preventDefault();
          
          var num_rows = $('.simfy-playlist > tbody tr').length;
          var tracks = $('.simfy-playlist > tbody .track-link');
          var num_tracks = tracks.length;
          
          $('textarea.spotify-playlist').val('');
          $.each(tracks, function(nr,track){
            buildPlaylist(track);
          });
          
          if(num_rows<1){
            alert(ll.errorNoSpotifyLinks);
            return;
          }else{
            if(num_tracks<num_rows){
              alert(ll.errorNotAllSpotifyLinks1+num_tracks+ll.errorNotAllSpotifyLinks2+num_rows+ll.errorNotAllSpotifyLinks3);
            }
            alert(ll.copyC);
          }
          $('textarea.spotify-playlist').focus().select();
          
          return false;
        });
        
        
      })()
    }
    
  }())
