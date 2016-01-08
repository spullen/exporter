App.search = null;

var $search = $('#search');

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
      }).fail(function() {
        console.log('failed');
        App.search.unsubscribe();
        App.search = null;
      });

      // display modal with spinner waiting for search download completion
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
    },

    received: function(data) {
      console.log('received');
      console.log(data);

      if(data.status === 'complete') {
        this.unsubscribe();
        App.search = null;
      }
    }
  });
}
