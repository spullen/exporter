var $search = $('#search');

$search.on('keypress', function(e) {
  if(e.which === 13) {
    var searchTerm = $.trim($search.val());

    if(searchTerm !== undefined && searchTerm !== '') {
      $search.parent().removeClass('has-error');
      
      var searchUUID = guid();

      $.ajax({
        url: '/search',
        method: 'POST',
        data: {
          search: searchTerm,
          search_uuid: searchUUID
        }
      }).then(function() {
        $search.val('');
        displaySearchModal(searchUUID);
      }).fail(function() {
        // display error
      });
    } else {
      $search.parent().addClass('has-error');
    }
    return false;
  }
});

function displaySearchModal(searchUUID) {
  var $searchModal = $('#search-status');

  $searchModal.modal({
    keyboard: false
  });

  $searchModal.find('.loading').show();
  $searchModal.find('.search-results').hide();
  $searchModal.find('.search-results-download').attr('href', '#');

  $searchModal.on('hide.bs.modal', function() {
    console.log('search model close');
    // handle clean up, potentially cancelling the request
  });

  var search =  App.cable.subscriptions.create({
    channel: "SearchChannel",
    search_uuid: searchUUID
  }, {
    connected: function() {
      console.log('connected');
    },

    disconnected: function() {
      console.log('disconnected');
      search = null;
    },

    received: function(data) {
      switch(data.status) {
        case 'complete':
          this.unsubscribe();
          search = null;
          $searchModal.find('.search-results-download').attr('href', data.download_link);
          $searchModal.find('.loading').hide();
          $searchModal.find('.search-results').show();
          break;
        case 'failed':
          this.unsubscribe();
          search = null;
          $searchModal.modal('hide');
          // display error
          break;
        default:
          console.log(data);
      }
    }
  });
}
