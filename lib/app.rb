require "bundler"

Bundler.require *[:default, ENV["RACK_ENV"]].compact

class App < Sinatra::Base

	set :protection, :except=>:path_traversal

	use Rack::SslEnforcer if production?

	set :root, File.dirname(__FILE__) + "/.."
	set :sprockets, Sprockets::Environment.new(root)

	[
		[root, "assets", "images"],
		[root, "assets", "javascripts"],
		[root, "assets", "stylesheets"],
		[root, "assets", "fonts"],
		[root, "vendor", "assets", "images"],
		[root, "vendor", "assets", "javascripts"],
		[root, "vendor", "assets", "stylesheets"]
	].each { |p| sprockets.append_path(File.join *p) }

	helpers do
		def asset_path(source)
			"/assets/#{settings.sprockets.find_asset(source).digest_path}"
		end

		def cross_origin_headers(headers)
			headers["Cross-Origin-Opener-Policy"] = "same-origin"
			headers["Cross-Origin-Embedder-Policy"] = "require-corp"
		end
	end

	get	"/" do
		erb :index
	end

	get	"/flash/:game" do
		@game = params["game"]
		erb :flashgame
	end

	get	"/html5/:game" do
		if params["game"] == "lets-shoot-js"
			cross_origin_headers(response.headers)
		end

		@game = params["game"]
		erb :html5game
	end

	get	"/spacemazefbshare/:dbsurl" do
		@dbsurl = params["dbsurl"]
		erb :spacemazefbshare
	end

	not_found do
		redirect "/"
	end

	get	"/html5/:game/index" do
		cross_origin_headers(response.headers)

		send_file("public/html5/#{params["game"]}/index.html")
	end

	get	"/html5/:game/worker/*" do
		cross_origin_headers(response.headers)

		send_file("public/html5/#{params["game"]}/#{params["splat"].join("/")}", :type => "application/javascript");
	end
end
