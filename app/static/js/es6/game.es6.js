/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#getForest', showForest);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
    $('#dashboard').on('click', '#trade', tradeWood);
  }
  function tradeWood(){
    var woodAmount= $('#woodAmount').val();
    var user = $(this).parent().prev().prev().prev();
    var userId = user.attr('data-id');

    $('#woodAmount').val('');
    ajax('/users/tradeWood', 'put', {wood: woodAmount, userId: userId}, response=>{
      console.log(response);
      $('#wood').text(`wood: ${response.user.wood}`);
      $('#cash').text(`cash: ${response.user.cash}`);
    }, 'json');
  }
  function chop(){
    var tree = $(this).closest('.tree');
    var treeID = tree.attr('data-id');
    ajax(`/trees/${treeID}/chop`, 'put', null, response=>{
      tree.replaceWith(response.html);
      $('#wood').text(`wood: ${response.user.wood}`);
    }, 'json');
  }

  function grow(){
    var tree = $(this).closest('.tree');
    var treeID = tree.attr('data-id');
    ajax(`/trees/${treeID}/grow`, 'put', null, html=>{
      tree.replaceWith(html);
    });
  }


  function showForest(){
    var userId = $('#getForest').parent().prev().prev().attr('data-id');
    ajax(`/trees?userId=${userId}`, 'get', null, html =>{
      $('#forest').empty();
      $('#forest').append(html);
    });
  }

  function login(){
    var userName = $('#userName').val();
    $('#userName').val('');
    ajax('/login', 'post', {userName: userName}, response=>{
      $('#dashboard').empty().append(response);
    });
  }

  function plant(){
    var userId = $('#plant').parent().prev().prev().attr('data-id');
    ajax('/trees/plant', 'post', {userId:userId}, html =>{
      $('#forest').append(html);
    });
  }

  function ajax(url, type,  data={}, success=response=>console.log(response), dataType='html'){
    $.ajax({url: url, type: type, data: data, dataType: dataType, success:success});
  }




})();
