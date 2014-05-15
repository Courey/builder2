(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#getForest', showForest);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
    $('#dashboard').on('click', '#trade', tradeWood);
  }
  function tradeWood() {
    var woodAmount = $('#woodAmount').val();
    var user = $(this).parent().prev().prev().prev();
    var userId = user.attr('data-id');
    $('#woodAmount').val('');
    ajax('/users/tradeWood', 'put', {
      wood: woodAmount,
      userId: userId
    }, (function(response) {
      console.log(response);
      $('#wood').text(("wood: " + response.user.wood));
      $('#cash').text(("cash: " + response.user.cash));
    }), 'json');
  }
  function chop() {
    var tree = $(this).closest('.tree');
    var treeID = tree.attr('data-id');
    ajax(("/trees/" + treeID + "/chop"), 'put', null, (function(response) {
      tree.replaceWith(response.html);
      $('#wood').text(("wood: " + response.user.wood));
    }), 'json');
  }
  function grow() {
    var tree = $(this).closest('.tree');
    var treeID = tree.attr('data-id');
    ajax(("/trees/" + treeID + "/grow"), 'put', null, (function(html) {
      tree.replaceWith(html);
    }));
  }
  function showForest() {
    var userId = $('#getForest').parent().prev().prev().attr('data-id');
    ajax(("/trees?userId=" + userId), 'get', null, (function(html) {
      $('#forest').empty();
      $('#forest').append(html);
    }));
  }
  function login() {
    var userName = $('#userName').val();
    $('#userName').val('');
    ajax('/login', 'post', {userName: userName}, (function(response) {
      $('#dashboard').empty().append(response);
    }));
  }
  function plant() {
    var userId = $('#plant').parent().prev().prev().attr('data-id');
    ajax('/trees/plant', 'post', {userId: userId}, (function(html) {
      $('#forest').append(html);
    }));
  }
  function ajax(url, type) {
    var data = arguments[2] !== (void 0) ? arguments[2] : {};
    var success = arguments[3] !== (void 0) ? arguments[3] : (function(response) {
      return console.log(response);
    });
    var dataType = arguments[4] !== (void 0) ? arguments[4] : 'html';
    $.ajax({
      url: url,
      type: type,
      data: data,
      dataType: dataType,
      success: success
    });
  }
})();

//# sourceMappingURL=game.map
