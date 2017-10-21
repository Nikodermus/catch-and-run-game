Rails.application.routes.draw do
  get 'game/index'
  get 'users/:id' => 'users#show'
  resources :users do
    resources :game
  end
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "game#index"
end
