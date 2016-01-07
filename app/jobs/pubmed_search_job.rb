class PubmedSearchJob < ApplicationJob
  queue_as :default
 
  def perform(search_term)
    
  end
end