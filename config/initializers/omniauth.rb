Rails.application.config.middleware.use OmniAuth::Builder do
 provider :github, '', '' 
 provider :facebook, '', '' 
 provider :twitter, '', '' 
end
