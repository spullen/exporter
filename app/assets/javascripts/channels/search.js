App.search = null;

var $search = $('#search');
var $searchModal = $('#search-status');

$search.on('keypress', function(e) {
  if(e.which === 13) {
    var searchTerm = $.trim($search.val());

    if(searchTerm !== undefined && searchTerm !== '') {
      $search.parent().removeClass('has-error');
      
      var searchUUID = guid();
      App.search = monitorSearch(searchUUID);

      $.ajax({
        url: '/search',
        method: 'POST',
        data: {
          search: searchTerm,
          search_uuid: searchUUID
        }
      }).then(function() {
        $search.val('');

        $searchModal.modal({
          keyboard: false
        });

        $searchModal.find('.loading').show();
        $searchModal.find('.search-results').hide();
        $searchModal.find('.search-results-download').attr('href', '#');
      }).fail(function() {
        App.search.unsubscribe();
        App.search = null;
      });
    } else {
      $search.parent().addClass('has-error');
    }
    return false;
  }
});

function monitorSearch(searchUUID) {
  return App.cable.subscriptions.create({
    channel: "SearchChannel",
    search_uuid: searchUUID
  }, {
    connected: function() {
      console.log('connected');
    },

    disconnected: function() {
      console.log('disconnected');
      App.search = null;
    },

    received: function(data) {
      switch(data.status) {
        case 'complete':
          this.unsubscribe();
          App.search = null;
          $searchModal.find('.search-results-download').attr('href', data.download_link)
          $searchModal.find('.loading').hide();
          $searchModal.find('.search-results').show();
          break;
        case 'failed':
          this.unsubscribe();
          App.search = null;
          $searchModal.modal('hide');
          // display error
          break;
        default:
          console.log(data);
      }
    }
  });
}
