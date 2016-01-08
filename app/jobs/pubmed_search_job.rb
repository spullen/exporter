class PubmedSearchJob < ApplicationJob
  queue_as :default
 
  def perform(search, search_uuid)
    (1..60).each do |n|
      ActionCable.server.broadcast("search_#{search_uuid}", status: "running #{n}")
      sleep 1.5
    end

    ActionCable.server.broadcast("search_#{search_uuid}", status: 'complete')
  end
end