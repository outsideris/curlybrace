/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 14.
 * Time: 오전 3:08
 */
// # 공통 자바스크립트
/*global FB, markdown, Handlebars */
/*jshint browser:true, jquery:true */
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
    $('#tags').tokenInput('/tags?how=startWith', opt);
  }

  // 질문 보기 화면일 경우
  if ($('#qid').length) {
    var questionId = $('#qid').val(),
    // define templates
      commentsTemplate = Handlebars.compile($("#commentsTmpl").html());

    $('form.commentForm').submit(function(event) {
      event.preventDefault();

      var contents$ = $(this).find('textarea'),
        commentList$ = $(this).parent().prev(),
        comment = {
          contents: contents$.val()
        };

      var answerId = $(this).find('input.aid').val();
      if (questionId && !answerId) {
        $.post('/questions/' + questionId + '/comments',
          comment,
          function(data) {
            contents$.val('');
            updateComments(commentList$);
          });
      } else if (questionId) {
        $.post('/questions/' + questionId + '/answers/' + answerId + '/comments',
          comment,
          function(data) {
            contents$.val('');
            updateComments(commentList$, answerId);
          });
      } else {
        //TODO: do notification
      }
    });

    $('.commentMessage').click(function(event) {
      var commentWrap$ = $(this).parent().next();
      if (commentWrap$.hasClass('commentsWrap')) {
        event.preventDefault();

        var answerId = commentWrap$.find('input.aid').val(),
          commentList$ = commentWrap$.find('.comments-list');

        if (!helper.isVisible(commentList$)) {
          updateComments(commentList$, answerId);
        }

        commentWrap$.toggle();
      }
    });

    // 댓글 목록을 가져와서 화면에 갱신한다.
    var updateComments = function(commentList$, answerId) {
      var url = '/questions/' + questionId + '/comments';
      if (answerId) {
        url = '/questions/' + questionId + '/answers/' + answerId + '/comments';
      }

      $.get(url, function(data) {
        if (data.results && data.results.length > 0) {
          var commentsHTML = commentsTemplate(data);
          commentList$.html(commentsHTML);

          // 댓글 갯수 표시 갱신
          updateCommentCount(
            commentList$.parent().prev().find('.commentMessage').find('span'),
            data.results.length
          );
        }
      });
    };

    var updateCommentCount = function(commentCount$, count) {
      commentCount$.text(count);
    };
  }

  var helper = {
    // jQuery 엘리먼트가 visible 상태인지 검사한다.
    isVisible: function(domElement$) {
      return domElement$.is(':visible');
    }
  };
});
