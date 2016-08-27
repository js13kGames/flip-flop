#!/usr/bin/env ruby

require 'rake'
require 'rake/clean'
require 'autoprefixer-rails'

CLEAN.include 'game.zip'
CLEAN.include 'css/game.min.css'

MAX_SIZE = 13 * 1024

task :default => :test

desc "Make sure the game isn't too big"
task :test => 'css/game.min.css' do
  sh 'zip -r game.zip . -i@manifest.txt'
  size = File.size('game.zip')
  puts "zip size: #{size} bytes (used #{percent size}%)"
  fail 'zip file too big!' if size > MAX_SIZE
end

desc 'Run Autoprefixer on the CSS'
task :autoprefix => 'css/game.min.css'

file 'css/game.min.css' => 'css/game.css' do
  css = File.read('css/game.css')
  File.open('css/game.min.css', 'w') do |io|
    io << AutoprefixerRails.process(css)
  end
  sh 'cat css/game.min.css | ~/Development/node_modules/clean-css/bin/cleancss -o css/game.min.css'
end

def percent size
  (size.to_f / MAX_SIZE.to_f * 100).to_i
end
