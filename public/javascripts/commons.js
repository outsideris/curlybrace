// # 공통 자바스크립트
$(document).ready(function() {
  "use strict";

  // 툴팁 설정
  var tooltipOpt = {
    placement: 'bottom'
  };
  if ($('.votecount').length) {
    $('.votecount').tooltip(tooltipOpt);
  }
  if ($('.votecount').length) {
    $('.answercount').tooltip(tooltipOpt);
  }

  // SNS 버튼
  if ($('.socialbox').length) {
    //Twitter Button
    (function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs"));

    //Facebook Like Button
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '176737185714840', // App ID
        channelUrl : '//curlybrace.com:3000/html/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
      });

      // Additional initialization code here
    };

    // Load the SDK Asynchronously
    (function(d){
      var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement('script'); js.id = id; js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      ref.parentNode.insertBefore(js, ref);
    }(document));

    //Google+ Button
    window.___gcfg = {lang: 'ko'};

    (function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/plusone.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
  }

  // 질문 등록 폼 관련 스크립트
  if ($('.question-form').length) {
    var editor = $('#editor').find('textarea');
    var preview = $('#preview-box');

    $('#editor-tab').click(function(e) {
      e.preventDefault();
      $(this).tab('show');
    });
    $('#preview-tab').click(function(e) {
      e.preventDefault();
      $(this).tab('show');

      preview.html(markdown.toHTML(editor.val()));
    });
  }

  // 질문 등록화면에서 태그 조회 스크립트
  if ($('#tags').length) {
    var opt = {
      jsonContainer: 'results',
      onResult:function(res) {
        $(res.results).each(function(index, elem) {
          elem.id = elem.name;
          elem.readonly = true;
        });
        return res;
      },
      theme: 'facebook',
      preventDuplicates: true
    };
    $('#tags').tokenInput('/v1/tags?how=startWith', opt);
  }
});