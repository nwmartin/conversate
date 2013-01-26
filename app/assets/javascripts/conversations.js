(function() {
  var setupConversationEditor = function() {
    var header = $("#column-conversation .conversation-info");
    var titleEditor = header.find("form.title input[type='text']");
    var userEditor = header.find("form.participants input[type='text']");

    // addressBook defined in index.html.erb.
    if (window.addressBook && window.participants) {
      tokenize(userEditor, addressBook, participants);
    }

    // TODO: Once this is done via AJAX instead of page refresh, update
    // currentTitle on title change.
    var currentTitle = titleEditor.val();

    var userIds = function() {
      return $.map($("form.participants .token"), function(u) { return $(u).attr("data-token-id"); }).sort();
    };
    var currentUsers = userIds();

    titleEditor.on("blur", function(e) {
      titleEditor.parents("form").submit();
    });

    titleEditor.on("keydown", function(e) {
      if (e.keyCode == 13) { // Enter
        if (titleEditor.val() == currentTitle) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    });

    $('html').on('click', function(e) {
      var target = $(e.target);
      if (target.closest('html').length > 0 &&
          target.closest('.token-container').length == 0) {
        var nowUsers = userIds();
      console.log(currentUsers);
      console.log(nowUsers);
        if (currentUsers.toString() !== nowUsers.toString()) {
          userEditor.hide();
          userEditor.val(nowUsers);
          userEditor.parents("form").submit();
        }
      }
    })
  };

  var setupCompose = function() {
    $("#compose textarea").on("keydown", function(e) {
      if (e.keyCode == 13) { // Enter
        $("#compose form").submit();
        return false;
      }
    });
  };

  $(function() {
    setupConversationEditor();
    setupCompose();

    // Scroll the thread to the bottom when loading the page
    var thread = $('#thread');
    if (thread.length > 0) {
      thread.scrollTop(thread[0].scrollHeight - thread.height());
    }

    // The page will only open in editing mode if it's a new conversation.
    // new_conversation is defined in index.html.erb.
    if (window.new_conversation) {
      $('.conversation-info').click();
      $('form.participants input[type="text"]').focus();
    }
    else {
      $('#compose textarea').focus();
    }


    $('.topics-group .topics-title').click(function(){
      $(this).parent().toggleClass('collapsed');
    });

    $('#column-list').css('left', $('#column-navigation').outerWidth() + 1);
    $('#column-conversation').css('left',
      $('#column-navigation').outerWidth() + $('#column-list').outerWidth() + 2);
  });
})();
