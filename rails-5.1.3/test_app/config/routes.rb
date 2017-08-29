Rails.application.routes.draw do
  get 'users/new'

  get 'users/index'

  get "users/show/:username" => "users#show"

  post "tweets" => "users#create"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
