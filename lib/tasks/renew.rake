begin
	require 'dotenv'
	Dotenv.load
rescue
end

require 'rake'
require 'platform-api'

desc "This task renews the SSL certificate"

task :renew_ssl do
	puts ENV["HEROKU_TOKEN"]

	heroku = PlatformAPI.connect_oauth ENV["HEROKU_TOKEN"]
	heroku_app = ENV["HEROKU_APP"]

	certificates = heroku.sni_endpoint.list(heroku_app);

	if certificates.any?
		expiry_date = DateTime.parse(certificates[0]['ssl_cert']['expires_at'])
		now = DateTime.now
		month_difference = (expiry_date.year * 12 + expiry_date.month) - (now.year * 12 + now.month)

		if (month_difference <= 1)
			puts 'update certs'
			# Rake::Task['letsencrypt:renew'].invoke
		else
			puts 'certs are up to date'
		end

	else
		puts 'request certs'

		# Rake::Task['letsencrypt:renew'].invoke
	end
end
