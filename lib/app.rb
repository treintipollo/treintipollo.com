require 'bundler'

Bundler.require *[:default, ENV['RACK_ENV']].compact

class App < Sinatra::Base

	set :protection, :except=>:path_traversal

	use Rack::SslEnforcer if production?

	set :root, File.dirname(__FILE__) + '/..'
	set :sprockets, Sprockets::Environment.new(root)

	[
		[root, 'assets', 'images'],
		[root, 'assets', 'javascripts'],
		[root, 'assets', 'stylesheets'],
		[root, 'vendor', 'assets', 'images'],
		[root, 'vendor', 'assets', 'javascripts'],
		[root, 'vendor', 'assets', 'stylesheets']
	].each { |p| sprockets.append_path(File.join *p) }

	helpers do
		def asset_path(source)
			"/assets/#{settings.sprockets.find_asset(source).digest_path}"
		end
	end

	get	'/' do
		erb :index
	end

	get	'/flash/:game' do
		@game = params['game']
		erb :flashgame
	end

	get	'/html5/:game' do
		@game = params['game']
		erb :html5game
	end

	get	'/spacemazefbshare/:dbsurl' do
		@dbsurl = params['dbsurl']
		erb :spacemazefbshare
	end

	not_found do
		redirect '/'
	end
end
