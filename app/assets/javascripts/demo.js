//
//  demo-concept.js
//
//  Created by Zhaodong Liu on 2012-09-12.
//

$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

(function($) {

	DeadSimpleRenderer = function(canvas) {
		var canvas = $(canvas).get(0)
		var ctx = canvas.getContext("2d");
		var particleSystem = null
		var rootNode = null
		var parentLength = 0.5;
		var childLength = 0.05;
		var hideLength = 0.01;
		var edgeLength = 0.2;
		var select_node = null;
		var that = {

			update_node : function(id, topic, detail) {
				var n = particleSystem.getNode(id);
				n.data.topic = topic;
				n.data.detail = detail;
			},
			//
			// the particle system will call the init function once, right before the
			// first frame is to be drawn. it's a good place to set up the canvas and
			// to pass the canvas size to the particle system
			//
			init : function(system) {
				// save a reference to the particle system for use in the .redraw() loop
				particleSystem = system
				// inform the system of the screen dimensions so it can map coords for us.
				// if the canvas is ever resized, screenSize should be called again with
				// the new dimensions
				particleSystem.screenSize(canvas.width, canvas.height)
				particleSystem.screenPadding(60)// leave an extra 30px of whitespace per side

				that.resizeNode();
				that.removeNode(that.findRoot());
				that.select(that.findRoot());

				$(window).resize(that.resize)
				that.resize()
				that.initMouseHandling()

				//$('#node_nav').html(">>" + that.findRoot().name);
			},

			resize : function() {
				canvas.width = .75 * $(window).width()
				canvas.height = .75 * ($(window).height())
				particleSystem.screen({
					size : {
						width : canvas.width,
						height : canvas.height
					}
				})
				that.redraw()
			},
			//
			// redraw will be called repeatedly during the run whenever the node positions
			// change. the new positions for the nodes can be accessed by looking at the
			// .p attribute of a given node. however the p.x & p.y values are in the coordinates
			// of the particle system rather than the screen. you can either map them to
			// the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
			// which allow you to step through the actual node objects but also pass an
			// x,y point in the screen's coordinate system
			//

			redraw : function() {
				ctx.clearRect(0, 0, canvas.width, canvas.height)

				particleSystem.eachEdge(function(edge, pt1, pt2) {
					// edge: {source:Node, target:Node, length:#, data:{}}
					// pt1:  {x:#, y:#}  source position in screen coords
					// pt2:  {x:#, y:#}  target position in screen coords

					ctx.strokeStyle = "rgba(255,255,255,.8)"
					if (edge.length == parentLength) {
						ctx.lineWidth = 5
					}
					if (edge.length == childLength) {
						ctx.lineWidth = 1
					}
					if (edge.length == edgeLength) {
						ctx.lineWidth = 3
					}
					if (edge.length !== hideLength) {
						ctx.beginPath()
						ctx.moveTo(pt1.x, pt1.y)
						ctx.lineTo(pt2.x, pt2.y)
						ctx.stroke()
						ctx.closePath()
					}
					ctx.lineWidth = 3
					// draw a line from pt1 to pt2

				})

				particleSystem.eachNode(function(node, pt) {
					// node: {mass:#, p:{x,y}, name:"", data:{}}
					// pt:   {x:#, y:#}  node position in screen coords

					// draw a rectangle centered at pt

					var radius = node.data.level * 25

					ctx.beginPath()
					ctx.fillStyle = "#000000"
					ctx.strokeStyle = "rgba(255,255,255,0.2)"
					ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI, false)
					ctx.stroke()
					ctx.fill()
					if (node.data.level != 0) {
						ctx.font = node.data.level * 10 + "px sans-serif"
						ctx.textAlign = "center"
						ctx.textBaseline = "middle"
						ctx.fillStyle = "rgba(255,255,255,0.8)";
						ctx.fillText(node.data.topic, pt.x, pt.y, radius * 1.4);
					}
					ctx.closePath()

				})
			},

			findRoot : function() {
				var p = particleSystem
				var n = null
				p.eachNode(function(node, pt) {
					if (p.getEdgesTo(node).length == 0) {
						n = node
					}

				})
				return n
			},

			hideNode : function(node) {
				node.data.level = 0

				node.mass = 0.1
				node.fixed = false;

			},
			hideEdge : function(edge) {
				edge.length = hideLength;
			},
			showEdge : function(node, from, length) {
				var p = particleSystem
				var edges = null
				if (from) {
					edges = p.getEdgesFrom(node)
				} else {
					edges = p.getEdgesTo(node)
				}
				for (var i in edges) {
					edges[i].length = length
				}
			},

			showNode : function(node, level) {
				if (node != null) {
					if (level == 2) {
						node.p.x = 0
						node.p.y = 0
						node.fixed = true
					}
					node.data.level = level
				}
			},
			resizeNode : function() {
				particleSystem.eachNode(function(node, pt) {
					switch(node.data.level) {
						case 1:
							node.mass = 0.5;
							break;
						case 2:
							node.mass = 2;
							break;
						case 3:
							node.mass = 10;
							break;
						default:
							node.mass = 0.05;
							break;
					}

				})
			},

			removeNode : function(target) {
				var p = particleSystem
				p.eachEdge(function(edge, pt1, pt2) {
					that.hideEdge(edge)
				})
				p.eachNode(function(node, pt) {
					that.hideNode(node)
				})

				that.showNode(target, 2)

				var edges = p.getEdgesFrom(target)
				for (var i in edges) {
					edges[i].length = edgeLength
					var child = edges[i].target
					that.showNode(child, 1)
					that.showEdge(child, true, childLength)
				}

				var edge = p.getEdgesTo(target)
				if (edge.length) {
					var parent = edge[0].source
					that.showNode(parent, 3)
					that.showEdge(target, false, edgeLength)
					that.showEdge(parent, false, parentLength)
				}

				//show the source
				var root = that.findRoot()
				var node = target
				$('#node_nav').html(">>" + node.name)
				while (node != root) {
					node = p.getEdgesTo(node)[0].source
					$('#node_nav').html(">>" + node.name + $('#node_nav').html())
				}

			},

			select : function(node) {
				console.log("selected: " + node.name)
				that.resizeNode()
				that.removeNode(node)
				that.showDetail(node)
				select_node = node;
			},

			showDetail : function(node) {
				$('#id').val(node.data.id);
				$('#idea_ancestor_n').val(node.data.id);
				$('#user').html(node.data.user);
				$('#idea_detail').val(node.data.detail);
				$('#idea_title').val(node.data.topic);
			},

			initMouseHandling : function() {
				selected = null;
				nearest = null;
				var dragged = null;
				var oldmass = 1

				$(canvas).mousedown(function(e) {
					var pos = $(this).offset();
					var p = {
						x : e.pageX - pos.left,
						y : e.pageY - pos.top
					}
					selected = nearest = dragged = particleSystem.nearest(p);

					var radius = selected.node.data.level * 25
					console.log(p.x, p.y)
					console.log("distance: " + selected.distance + " name:" + selected.node.name + " radius: " + radius + "level: " + selected.node.data.level);
					console.log("x: " + particleSystem.toScreen(selected.node.p).x + "y: " + particleSystem.toScreen(selected.node.p).y)
					if (selected.node !== null && selected.distance <= radius) {

						that.select(selected.node);
					}

					return false
				});
			}
		}
		return that
	}

	$(document).ready(function() {

		var sys = arbor.ParticleSystem(2000, 400, 0.1, false, 60, 0.01)
		sys.renderer = DeadSimpleRenderer("#viewport")
		//"test.json"
		//"http://localhost:3000/node/json/1.json"
		var json_add = "http://localhost:3000/node/json/" + $('#new_node_pid').val() + ".json"
		$.getJSON(json_add, function(data) {
			//alert(data);
			sys.graft({
				nodes : data.nodes,
				edges : data.edges
			})
			document.title = "coconceptulize - " + data.title;

		});
		// display the name and handle clicks on the ‘see another’ link

		$("#loginButton").click(function() {
			$("#loginButton").attr("onsubmit", false);
			window.location.href = "index.html";
		});
		
		$('#button_update').click(function() {
				idea.update(1, $('#update').serializeObject());
		});
		
		$('#button_create').click(function() {
				idea.create($('#create').serializeObject());
		});
		
		
		
		$('#form_create').submit(function(e) {
			e.preventDefault();
			idea.create($('#form_create').serializeObject());

		});

		var path = 'ws://' + window.location.hostname + ':8080';
		var socket = new WebSocket(path);

		socket.onopen = function() {
			// Display "connected"
			$('#status').text('Connected');
		}

		socket.onclose = function() {
			// Display "connected"
			$('#status').text('Not Connected');
		}

		socket.onmessage = function(msg) {
			var obj = JSON.parse(msg.data.substring(10, msg.data.length));
			//console.log(obj);
			console.log(msg);
			switch (obj.method) {
				case "create":
					add_new_node(obj);
					console.log("create");
					break;
				case "update":
					update_node(obj.id, obj.data);
					console.log("update");
					break;
				case "delete":
					//deleteItem(obj.id);
					console.log("delete");
					break;
			}
		}
		var idea = {

			create : function(obj) {
				obj.method = 'create';
				socket.send(JSON.stringify(obj));
			},

			update : function(id, obj) {
				socket.send({
					method : 'update',
					id : id,
					data : obj
				});
			},

			"delete" : function(id) {
				socket.send({
					method : 'delete',
					id : id
				});
			}
		}

		function update_node(id, data) {
			sys.renderer.update_node(id, data.title, data.detail);
			sys.renderer.redraw();
		};
		function add_new_node(node_data) {
			sys.addNode(new_id, node_data);
			sys.addEdge(sys.getNode($('#idea_ancestor_n').val()), sys.getNode(new_id), {});
			sys.renderer.resizeNode();
			sys.renderer.removeNode(sys.renderer.findRoot());
			sys.renderer.select(sys.renderer.findRoot());
			console.log("success");
		};
		/*
		 $('#form_create').bind('ajax:success', function(evt, data, status, xhr){
		 var new_id = parseInt(xhr.responseText);
		 var node_data = {
		 topic: $('#idea_title_n').val(),
		 id: new_id,
		 detail: $('#idea_detail_n').val(),
		 user: $('#idea_user_id_n').val()
		 };
		 sys.addNode(new_id,node_data);
		 sys.addEdge(sys.getNode($('#idea_ancestor_n').val()),sys.getNode(new_id),{});
		 sys.renderer.resizeNode();
		 sys.renderer.removeNode(sys.renderer.findRoot());
		 sys.renderer.select(sys.renderer.findRoot());
		 });
		 */

	})
})(this.jQuery)

