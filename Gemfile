source 'http://rubygems.org'

gem 'coffee-script'
gem 'erubis'
gem 'rack-rewrite'
gem 'sinatra',           require: 'sinatra/base'
gem 'sprockets'

group :development do
  gem 'heroku'
  gem 'sinatra-contrib', require: 'sinatra/reloader'
end

group :production do
  gem 'unicorn'
  gem 'yui-compressor',  require: 'yui/compressor'
end
