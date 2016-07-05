
require 'io/console'
require 'ripl'
require 'ripl/multi_line'
require 'xmlrpc/client'
require "openssl"

puts "Enter username:"

username = STDIN.gets

puts "Enter password:"

password = STDIN.noecho(&:gets)

conn_args = {
	:host => 'hn1.nubes.rl.ac.uk',
	:use_ssl => true,
	:path => "/RPC2"
}

class Response

	attr_reader :is_success, :data, :error_code

	def initialize(is_success, data, error_code)
		@is_success = is_success
		@data = data
		@error_code = error_code
	end

	def to_s
		data
	end

	def success?
		is_success
	end

end

class Command

	def initialize(name)
		@name = name
	end

	def run(*args)
		connection = XMLRPC::Client.new_from_hash(conn_args)
		connection.instance_variable_get("@http").verify_mode = OpenSSL::SSL::VERIFY_NONE
		Response.new *connection.call(@name, $token, *args)
	end

	def method_missing(name, *args, &block)
		Command.new "#{@name}.#{name}"
	end

end


class Workspace

	def one
		Command.new("one")
	end

	def bindings
		binding
	end
  
end

connection = XMLRPC::Client.new_from_hash(conn_args)
connection.instance_variable_get("@http").verify_mode = OpenSSL::SSL::VERIFY_NONE
response = Response.new *connection.call("one.user.login", username + ":" + password, username, "", -1)
if !response.success?
	puts "Either your username or password is incorrect."
	exit
end

$token = response.data


Ripl.start :binding => Workspace.new.bindings
