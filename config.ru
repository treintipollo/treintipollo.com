require 'rack-rewrite'
require './lib/app'

DOMAIN = 'www.treintipollo.com'

use Rack::Rewrite do
  r301 %r{.*}, "http://#{DOMAIN}$&", :if => Proc.new { |rack_env|
    rack_env['SERVER_NAME'] != DOMAIN && ENV['RACK_ENV'] == 'production'
  }
end

map '/assets' do
  run App.sprockets
end

map '/' do
  run App
end
