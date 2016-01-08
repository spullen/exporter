# Be sure to restart your server when you modify this file. Action Cable runs in an EventMachine loop that does not support auto reloading.
class SearchChannel < ApplicationCable::Channel
  def subscribed
    stream_from "search_#{params[:search_uuid]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    Rails.logger.debug('SearchChannel#unsubscribed')
  end
end
