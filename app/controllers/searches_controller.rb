class SearchesController < ApplicationController

  def show; end

  def create
    PubmedSearchJob.perform_later(search_params[:search], search_params[:search_uuid])
  end

  private

  def search_params
    params.permit(:search, :search_uuid)
  end

end