source 'http://rubygems.org'

ruby "2.4.0"

gem 'coffee-script'
gem 'erubis'
gem 'rack-rewrite'
gem 'sinatra',           require: 'sinatra/base'
gem 'sprockets'
gem 'rake'
gem 'dotenv'
gem 'rack-ssl-enforcer'

gem 'platform-api'
gem 'letsencrypt-rails-heroku', '~> 0.3.0'

group :production do
  gem 'unicorn'
  gem 'yui-compressor',  require: 'yui/compressor'
end
