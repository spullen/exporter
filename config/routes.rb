Rails.application.routes.draw do
  resource :search, only: [:show, :create]
  resources :search_results, only: [:index, :show]

  root to: 'searches#show'

  mount ActionCable.server => '/cable'
end
