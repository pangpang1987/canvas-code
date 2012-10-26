require "rubygems"
require "bundler"
Bundler.setup
require "em-websocket"
require "json"
# require "ruby-debug"

class Client
  attr_accessor :websocket
  attr_accessor :name

  def initialize(websocket_arg)
    @websocket = websocket_arg
  end
end

class Project

  attr_accessor :clients

  def initialize
    @clients = {}
  end

  def start(opts={})
    EventMachine::WebSocket.start(:host => "", :port => 8080) do |websocket|
      websocket.onopen    { add_client(websocket) }
      websocket.onmessage { |msg| handle_message(websocket, msg) }
      websocket.onclose   { remove_client(websocket) }
    end
  end

  def add_client(websocket)
    client = Client.new(websocket)
    client.name = rand(36**8).to_s(36)
    @clients[websocket] = client
  end

  def remove_client(websocket)
    client = @clients.delete(websocket)
  end

  def send_all(message)
    @clients.each do |websocket, client|
      websocket.send message
    end
  end

  def handle_message(websocket, message)

    puts message

  end

  def client_names
    @clients.collect{|websocket, c| c.name}.sort
  end

end

project = Project.new
project.start()