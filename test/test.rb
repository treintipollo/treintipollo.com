require 'rake'

load "test/test.rake"

Rake::Task['test:test'].invoke
