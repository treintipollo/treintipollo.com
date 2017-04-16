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

# Until the new API calls are generally available, you must manually specify my fork
# of the Heroku API gem:
gem 'platform-api', github: 'jalada/platform-api', branch: 'master'
gem 'letsencrypt-rails-heroku', '~> 0.3.0'

group :production do
  gem 'unicorn'
  gem 'yui-compressor',  require: 'yui/compressor'
end
