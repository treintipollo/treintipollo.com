require 'bundler'
require 'letsencrypt-rails-heroku'
Bundler.require *[:default, ENV['RACK_ENV']].compact

Letsencrypt.configure

spec = Gem::Specification.find_by_name 'letsencrypt-rails-heroku'

load "#{spec.gem_dir}/lib/tasks/letsencrypt.rake"
load "lib/tasks/renew.rake"

load "test/test.rake"