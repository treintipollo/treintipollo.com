require 'rack-rewrite'
require './lib/app'

DOMAIN = 'www.treintipollo.com'

module Rack
	class DeflaterWithExclusions < Deflater
		def initialize(app, options = {})
			@app = app

			@exclude = options[:exclude]
		end

		def call(env)
			if @exclude && @exclude.call(env)
				@app.call(env)
			else
				super(env)
			end
		end
	end
end

use Rack::DeflaterWithExclusions, :exclude => proc { |env|
	if env['PATH_INFO'].match(/\/flash\/(.*?)$/)
		next true
	end
	
	if env['PATH_INFO'].match(/(\.png)$/)
		next true
	end

	next false
}

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
