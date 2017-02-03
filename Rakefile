require 'bundler'
Bundler.require

Letsencrypt.configure

spec = Gem::Specification.find_by_name 'letsencrypt-rails-heroku'
load "#{spec.gem_dir}/lib/tasks/letsencrypt.rake"