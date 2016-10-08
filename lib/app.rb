Bundler.require *[:default, ENV['RACK_ENV']].compact

class App < Sinatra::Base
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

  get '/space-maze/:scene-store/:scene-hash' do
    redirect to('/public/spacemaze/index.html?url=' + params['scene-hash'] + '@' + params['scene-store'])
  end

  get '/games/:game' do
    @game = params['game']
    erb :game
  end

  not_found do
    redirect '/'
  end
end
