require 'bundler'

Bundler.require *[:default, ENV['RACK_ENV']].compact

class App < Sinatra::Base

  set :protection, :except=>:path_traversal

  Letsencrypt.configure if production?
  use Letsencrypt::Middleware if production?
  use Rack::SslEnforcer if production?

  set :root,      File.dirname(__FILE__) + '/..'
  set :sprockets, Sprockets::Environment.new(root)

  [
    [root, 'assets', 'images'],
    [root, 'assets', 'javascripts'],
    [root, 'assets', 'stylesheets'],
    [root, 'vendor', 'assets', 'images'],
    [root, 'vendor', 'assets', 'javascripts'],
    [root, 'vendor', 'assets', 'stylesheets']
  ].each { |p| sprockets.append_path(File.join *p) }

  configure :production do
    sprockets.css_compressor = YUI::CssCompressor.new
    sprockets.js_compressor  = YUI::JavaScriptCompressor.new munge: true
  end

  helpers do
    def asset_path(source)
      "/assets/#{settings.sprockets.find_asset(source).digest_path}"
    end
  end

  get '/' do
    erb :index
  end

  get '/flash/:game' do
    @game = params['game']
    erb :flashgame
  end

  get '/html5/:game' do
    @game = params['game']
    erb :html5game
  end

  get '/spacemazefbshare/:dbsurl' do
    @dbsurl = params['dbsurl']
    erb :spacemazefbshare
  end

  # get %r{\/spacemazeassets\/.{8}-.{4}-.{4}-.{4}-.{12}\/(?<path>(?:\w+\/)+)(?<filename>\w+)\.(?<extension>\w+)} do |path, filename, extension|
  #   filepath = "#{path}#{filename}.#{extension}"

  #   "#{settings.public_folder}/html5/spacemaze/#{filepath}"

  #   # send_file "#{settings.public_folder}/html5/spacemaze/#{filepath}"
  # end

  # get %r{\/spacemazeassets2\/.{8}-.{4}-.{4}-.{4}-.{12}\/((?:\w+\/)+)(?\w+)\.(?\w+)} do
  #   path = params[:captures][0]
  #   filename = params[:captures][1]
  #   extension = params[:captures][2]

  #   filepath = "#{path}#{filename}.#{extension}"

  #   "#{settings.public_folder}/html5/spacemaze/#{filepath}"

  #   # send_file "#{settings.public_folder}/html5/spacemaze/#{filepath}"
  # end

  get  '/test' do
    "Hello"
  end

  get  %r{\/test2\/(?<digits>\d+)} do |digits|
    digits
  end

  # get  %r{\/test3\/[.{8}-.{4}-.{4}-.{4}-.{12}]\/(?<filename>.*?)} do |filename|
  #   "#{settings.public_folder}/html5/spacemaze/#{filename}"
  # end

  get  %r{\/test4} do
    "#{settings.public_folder}/html5/spacemaze/"
  end

  not_found do
    redirect '/'
  end
end
