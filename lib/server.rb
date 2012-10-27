require "rubygems"
require "bundler"
Bundler.setup
require "em-websocket"
require "json"
require "sqlite3"




class Client
  attr_accessor :websocket
  attr_accessor :name
  attr_accessor :user_id
  attr_accessor :project_id


  def initialize(websocket_arg)
    @websocket = websocket_arg
  end
end

class Project

  attr_accessor :clients
  attr_accessor :db

  def initialize
    @clients = {}
    @db = SQLite3::Database.open( "../db/development.sqlite3" )
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

  def add_client_info(websocket, user_id, user_name, project_id)
    @clients[websocket].user_id = user_id
    @clients[websocket].project_id = project_id
    msg = Hash.new
    msg["method"] = "join"
    msg["user_id"] = user_id
    msg["user_name"] = user_name
    outgoing = msg.to_json
    send_all(websocket, "#{outgoing}")
  end

  def remove_client(websocket)
    msg = Hash.new
    msg["method"] = "quit"
    msg["user_id"] = @clients[websocket].user_id
    outgoing = msg.to_json
    @clients.delete(websocket)
    send_all(websocket, "#{outgoing}")    
  end

  def send_all(orig_websocket, message)
    project_id = @clients[orig_websocket]["project_id"]
    @clients.each do |websocket, client|
      if @clients[websocket]["project_id"] == project_id
        websocket.send message
      end
    end
  end

  def handle_message(websocket, message)
    decoded = JSON.parse message
    puts decoded.inspect
    puts decoded["method"]
    case decoded["method"]
      when 'join'
        add_client_info(websocket, decoded['user_id'], decoded['user_name'], decoded['project_id'])

      when 'create'
        @db.execute("INSERT INTO ideas (user_id, project_id, title, detail, ancestor) 
            VALUES (?, ?, ?, ?, ?)", [decoded["user_id"], decoded["project_id"], decoded["title"], decoded["detail"], decoded["ancestor"]])
        newid = db.last_insert_row_id
        if newid
          decoded["id"] = newid
          outgoing = decoded.to_json
          send_all(websocket, "#{outgoing}")
        end

      when 'update'
        @db.execute("UPDATE ideas SET title = ?, detail = ? WHERE id = ?", 
          [decoded["title"], decoded["detail"], decoded["id"]])
        send_all(websocket, "#{decoded}")

    end
  end

  def client_names
    @clients.collect{|websocket, c| c.name}.sort
  end

end

project = Project.new
project.start()