class SearchResultsController < ApplicationController

  def show
    search_result = SearchResult.find(params[:id])
    send_data(search_result.document, type: 'text/csv; charset=iso-8859-1; header=present', disposition: "attachment; filename=#{search_result.search_uuid}.csv")
  end

end