Rails.application.routes.draw do
  resource :search, only: [:show, :create]

  root to: 'searches#show'

  mount ActionCable.server => '/cable'
end
