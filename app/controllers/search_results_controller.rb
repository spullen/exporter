class SearchResultsController < ApplicationController

  def show
    search_result = SearchResult.find(params[:id])
    file_path = "#{Rails.root}/public#{search_result.document.url(:original, false)}"
    send_file(file_path, type: 'text/csv; charset=iso-8859-1; header=present', disposition: "attachment; filename=#{search_result.search_uuid}.csv")
  end

end