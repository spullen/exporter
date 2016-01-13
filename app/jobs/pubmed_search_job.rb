class PubmedSearchJob < ApplicationJob
  require 'csv'

  queue_as :default
 
  SEARCH_LIMIT = 500
  HARD_LIMIT = 5000

  STATUS_START = 'start'
  STATUS_COMPLETE = 'complete'
  STATUS_FAILED = 'failed'

  HEADERS = ['pubmed_id', 'pubmed_central_id', 'title', 'author_names', 'publication_date', 'journal']

  def perform(search, search_uuid)
    stream = "search_#{search_uuid}"

    ActionCable.server.broadcast(stream, status: STATUS_START)

    offset = 0

    search_result = Pubmed.search(search, offset, SEARCH_LIMIT)
    number_of_articles = search_result.count

    ActionCable.server.broadcast(stream, number_of_articles: number_of_articles)

    search_result_export_filename = "#{Rails.root}/tmp/#{stream}.csv"
    CSV.open(search_result_export_filename, 'wb') do |csv|
      csv << HEADERS

      while search_result.pubmed_ids && ((offset + SEARCH_LIMIT) <= HARD_LIMIT)
        ActionCable.server.broadcast(stream, current_offset: offset)
        articles = Pubmed.fetch(search_result.pubmed_ids)

        articles.each do |article|
          csv << [
            article.pubmed_id,
            article.pubmed_central_id,
            article.title,
            article.author_names,
            article.publication_date,
            article.journal.title
          ]
        end

        offset += SEARCH_LIMIT
        search_result = Pubmed.search(search, offset, SEARCH_LIMIT)
      end
    end

    search_result_export_file = File.open(search_result_export_filename)
    search_result_export = SearchResult.create(search: search, search_uuid: search_uuid, document: search_result_export_file)

    if search_result_export
      download_link = Rails.application.routes.url_helpers.search_result_path(search_result_export)

      ActionCable.server.broadcast(stream, status: STATUS_COMPLETE, download_link: download_link)
    else
      ActionCable.server.broadcast(stream, status: STATUS_FAILED)
    end
  end
end