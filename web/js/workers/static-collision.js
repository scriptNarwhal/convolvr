(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*  static collision detection worker */

var distance2d = function distance2d(a, b) {
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[2] - b[2], 2));
},
    distance2dCompare = function distance2dCompare(a, b, n) {
	// more efficient version of distance2d()
	return Math.pow(a[0] - b[0], 2) + Math.pow(a[2] - b[2], 2) < n * n;
},
    distance3dCompare = function distance3dCompare(a, b, n) {
	// ..faster than using Math.sqrt()
	return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2) < n * n;
};

var observer = {
	position: [0, 0, 0],
	prevPos: [0, 0, 0],
	velocity: [0, 0, 0],
	vrHeight: 0
},
    voxelList = [],
    voxels = [];

self.update = function () {

	var distance = 0,
	    position = observer.position,
	    innerBox = [false, false],
	    velocity = observer.velocity,
	    vrHeight = observer.vrHeight,
	    closeToVenue = false,
	    collision = false,
	    cKey = "",
	    yPos = 0,
	    size = 50000,
	    voxel = null,
	    ent = null,
	    entRadius = 10,
	    structure = null,
	    bounds = [0, 0],
	    voxel = null,
	    delta = [0, 0],
	    oPos = [],
	    speed = 0,
	    e = 0,
	    i = 0,
	    v = 0;

	for (i = 0; i < voxelList.length; i++) {
		voxel = voxelList[i];

		if (!!!voxel || !!!voxel.position) continue;

		if (!!voxel && distance2dCompare(position, voxel.position, 180)) {
			// do collisions on voxels & structures... just walls at first..		
			if (voxel.loaded == undefined) {
				voxel.loaded = true;
				self.postMessage('{"command": "load entities", "data":{"coords":"' + voxel.cell[0] + '.' + voxel.cell[1] + '.' + voxel.cell[2] + '"}}');
			}

			if (distance2dCompare(position, voxel.position, 60)) {

				var alt = voxel.altitude || 0;

				yPos = voxel.position[1];

				if (distance2dCompare(position, voxel.position, 24.5)) {
					if (position[1] > yPos - 21 + vrHeight && position[1] < yPos + 14.25 + (vrHeight != 0 ? vrHeight - 1 : 0)) {
						collision = true;
						self.postMessage('{"command": "platform collision", "data":{"type":"top", "position":[' + voxel.position[0] + ',' + yPos + ',' + voxel.position[2] + '] }}');
					}

					if (!!voxel.entities && voxel.entities.length > 0) {
						e = voxel.entities.length - 1;

						while (e >= 0) {
							ent = voxel.entities[e];
							entRadius = ent.boundingRadius;

							if (!!!ent || !!!ent.components) {
								console.warn("Problem with entity! ", e, ent);continue;
							}
							// console.info("collision check entity ", position, ent.position, (ent.boundingRadius || 5))
							if (distance3dCompare(position, [ent.position[0] - entRadius, ent.position[1], ent.position[2] - entRadius], (entRadius * 1.4 || 3) + 4.5)) {
								ent.components.map(function (entComp) {
									if (distance3dCompare(position, [ent.position[0] + entComp.position[0], ent.position[1] + entComp.position[1], ent.position[2] + entComp.position[2]], entComp.boundingRadius || Math.max(entComp.props.geometry.size[0], entComp.props.geometry.size[2]) / 1.5)) {
										collision = true;

										if (!!entComp.props.floor) {
											console.info("floor collision!");
											self.postMessage(JSON.stringify({ command: "floor collision", data: {
													position: entComp.position,
													floorData: entComp.props.floor
												} }));
										} else {
											self.postMessage(JSON.stringify({ command: "entity-user collision", data: { position: entComp.position } }));
										}
									}
								});
							}
							e -= 1;
						}
					}
				}
			}
		}
	}

	if (!collision) observer.prevPos = [observer.position[0], observer.position[1], observer.position[2]];

	self.postMessage('{"command": "update"}');
	self.updateLoop = setTimeout(function () {
		self.update();
	}, 15);
};

self.onmessage = function (event) {

	var message = JSON.parse(event.data),
	    data = message.data,
	    user = observer,
	    voxel = null,
	    toRemove = null,
	    items = [],
	    entities = [],
	    c = 0,
	    p = 0;

	if (message.command == "update") {
		// user.prevPos = [user.position[0], user.position[1], user.position[2]];
		user.position = data.position;
		user.velocity = data.velocity;
		user.vrHeight = data.vrHeight;
		//self.postMessage(JSON.stringify(self.observer));
	} else if (message.command == "add voxels") {

		voxelList = voxelList.concat(data);
		data.map(function (v) {
			voxels[v.cell.join(".")] = v;
		});
	} else if (message.command == "remove voxels") {

		p = data.length - 1;

		while (p >= 0) {

			toRemove = data[p];
			c = voxelList.length - 1;

			while (c >= 0) {

				voxel = voxelList[c];
				if (voxel != null && voxel.cell[0] == toRemove.cell[0] && voxel.cell[1] == toRemove.cell[1] && voxel.cell[2] == toRemove.cell[2]) {
					voxelList.splice(c, 1);
					voxels[voxel.cell.join(".")] = null;
				}
				c--;
			}
			p--;
		}
	} else if (message.command == "add entity") {

		if (!!!voxels[data.coords.join(".")]) voxels[data.coords.join(".")] = { entities: [], cell: data.coords };

		entities = voxels[data.coords.join(".")].entities;
		entities.push(data.entity);
	} else if (message.command == "remove entity") {

		entities = voxels[data.coords.join(".")].entities;

		if (entities != null) {

			c = entities.length - 1;
			while (c >= 0) {
				if (entities[c].id == data.entityId) {
					voxels[data.coords.join(".")].entities.splice(c, 1);
					c = -1;
				}
				c--;
			}
		}
	} else if (message.command == "update entity") {

		entities = voxels[data.coords.join(".")].entities;

		if (entities != null) {
			c = entities.length - 1;

			while (c >= 0) {
				if (entities[c].id == data.entityId) {
					entities[c] = data.entity;
					c = -1;
				}
				c--;
			}
		}
	} else if (message.command == "clear") {

		voxels = [];
		voxelList = [];
	} else if (message.command == "start") {

		self.update();
	} else if (message.command == "stop") {

		self.stop();
	} else if (message.command == "log") {
		if (data == "") {
			self.postMessage('{"command":"log","data":[' + user.position[0] + ',' + user.position[1] + ',' + user.position[2] + ']}');
			self.postMessage('{"command":"log","data":' + JSON.stringify(voxels) + '}');
		}
	}
};

self.stop = function () {
	clearTimeout(self.updateLoop);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFx3b3JrZXJzXFxzdGF0aWMtY29sbGlzaW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUEsSUFBSSxhQUFhLFNBQWIsVUFBYSxDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVk7QUFDekIsUUFBTyxLQUFLLElBQUwsQ0FBVyxLQUFLLEdBQUwsQ0FBVyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBaEIsRUFBdUIsQ0FBdkIsSUFBNkIsS0FBSyxHQUFMLENBQVcsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQWhCLEVBQXVCLENBQXZCLENBQXhDLENBQVA7QUFDRCxDQUZIO0FBQUEsSUFHRSxvQkFBb0IsU0FBcEIsaUJBQW9CLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLEVBQWU7QUFBRTtBQUNwQyxRQUFPLEtBQUssR0FBTCxDQUFXLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFoQixFQUF1QixDQUF2QixJQUE2QixLQUFLLEdBQUwsQ0FBVyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBaEIsRUFBdUIsQ0FBdkIsQ0FBN0IsR0FBMkQsSUFBRSxDQUFwRTtBQUNBLENBTEg7QUFBQSxJQU1FLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsRUFBZTtBQUFFO0FBQ3BDLFFBQVEsS0FBSyxHQUFMLENBQVcsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQWhCLEVBQXVCLENBQXZCLElBQTZCLEtBQUssR0FBTCxDQUFXLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFoQixFQUF1QixDQUF2QixDQUE3QixHQUEwRCxLQUFLLEdBQUwsQ0FBVyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBaEIsRUFBdUIsQ0FBdkIsQ0FBM0QsR0FBMkYsSUFBRSxDQUFwRztBQUNBLENB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Q0FBYixFQUFpQjtBQUNoQixRQUFJLFNBQVUsQ0FBVixFQUFjLEVBQWQsSUFBb0IsS0FBSyxRQUE3QixFQUF1QztBQUN0QyxjQUFVLENBQVYsSUFBZ0IsS0FBSyxNQUFyQjtBQUNBLFNBQUksQ0FBQyxDQUFMO0FBQ0E7QUFDRDtBQUNBO0FBQ0Q7QUFFRCxFQWhCTSxNQWdCQSxJQUFLLFFBQVEsT0FBUixJQUFtQixPQUF4QixFQUFrQzs7QUFFeEMsV0FBUyxFQUFUO0FBQ0EsY0FBWSxFQUFaO0FBRUEsRUFMTSxNQUtBLElBQUssUUFBUSxPQUFSLElBQW1CLE9BQXhCLEVBQWtDOztBQUV4QyxPQUFLLE1BQUw7QUFFQSxFQUpNLE1BSUEsSUFBSyxRQUFRLE9BQVIsSUFBbUIsTUFBeEIsRUFBaUM7O0FBRXZDLE9BQUssSUFBTDtBQUVBLEVBSk0sTUFJQSxJQUFLLFFBQVEsT0FBUixJQUFtQixLQUF4QixFQUFnQztBQUN0QyxNQUFJLFFBQVEsRUFBWixFQUFnQjtBQUNmLFFBQUssV0FBTCxDQUFpQiw4QkFBOEIsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUE5QixHQUFpRCxHQUFqRCxHQUF1RCxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXZELEdBQTBFLEdBQTFFLEdBQWdGLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBaEYsR0FBbUcsSUFBcEg7QUFDQSxRQUFLLFdBQUwsQ0FBaUIsNkJBQTZCLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBN0IsR0FBcUQsR0FBdEU7QUFDQTtBQUNEO0FBQ0QsQ0F6R0Q7O0FBMkdBLEtBQUssSUFBTCxHQUFZLFlBQU07QUFDakIsY0FBYyxLQUFLLFVBQW5CO0FBQ0EsQ0FGRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiAgc3RhdGljIGNvbGxpc2lvbiBkZXRlY3Rpb24gd29ya2VyICovXHJcblxyXG5sZXQgZGlzdGFuY2UyZCA9ICggYSwgYiApID0+IHtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoIE1hdGgucG93KCAoYVswXS1iWzBdKSwgMiApICsgTWF0aC5wb3coIChhWzJdLWJbMl0pLCAyICkgKVxyXG4gIH0sXHJcbiAgZGlzdGFuY2UyZENvbXBhcmUgPSAoIGEsIGIsIG4gKSA9PiB7IC8vIG1vcmUgZWZmaWNpZW50IHZlcnNpb24gb2YgZGlzdGFuY2UyZCgpXHJcblx0ICByZXR1cm4gTWF0aC5wb3coIChhWzBdLWJbMF0pLCAyICkgKyBNYXRoLnBvdyggKGFbMl0tYlsyXSksIDIgKSA8IChuKm4pXHJcbiAgfSxcclxuICBkaXN0YW5jZTNkQ29tcGFyZSA9ICggYSwgYiwgbiApID0+IHsgLy8gLi5mYXN0ZXIgdGhhbiB1c2luZyBNYXRoLnNxcnQoKVxyXG5cdCAgcmV0dXJuIChNYXRoLnBvdyggKGFbMF0tYlswXSksIDIgKSArIE1hdGgucG93KCAoYVsxXS1iWzFdKSwgMiApICsgTWF0aC5wb3coIChhWzJdLWJbMl0pLCAyICkgKSA8IChuKm4pXHJcbiAgfVxyXG5cclxubGV0IG9ic2VydmVyID0ge1xyXG5cdFx0cG9zaXRpb246IFswLCAwLCAwXSxcclxuXHRcdHByZXZQb3M6IFswLCAwLCAwXSxcclxuXHRcdHZlbG9jaXR5OiBbMCwgMCwgMF0sXHJcblx0XHR2ckhlaWdodDogMFxyXG5cdH0sXHJcblx0dm94ZWxMaXN0ID0gW10sXHJcblx0dm94ZWxzID0gW11cclxuXHJcbnNlbGYudXBkYXRlID0gKCApID0+IHtcclxuXHJcblx0dmFyIGRpc3RhbmNlID0gMCxcclxuXHRcdHBvc2l0aW9uIFx0ID0gb2JzZXJ2ZXIucG9zaXRpb24sXHJcblx0XHRpbm5lckJveCBcdCA9IFtmYWxzZSwgZmFsc2VdLFxyXG5cdFx0dmVsb2NpdHkgXHQgPSBvYnNlcnZlci52ZWxvY2l0eSxcclxuXHRcdHZySGVpZ2h0IFx0ID0gb2JzZXJ2ZXIudnJIZWlnaHQsXHJcblx0XHRjbG9zZVRvVmVudWUgPSBmYWxzZSxcclxuXHRcdGNvbGxpc2lvbiBcdCA9IGZhbHNlLFxyXG5cdFx0Y0tleSBcdFx0ID0gXCJcIixcclxuXHRcdHlQb3MgXHRcdCA9IDAsXHJcblx0XHRzaXplIFx0XHQgPSA1MDAwMCxcclxuXHRcdHZveGVsIFx0XHQgPSBudWxsLFxyXG5cdFx0ZW50IFx0XHQgPSBudWxsLFxyXG5cdFx0ZW50UmFkaXVzICAgID0gMTAsXHJcblx0XHRzdHJ1Y3R1cmUgXHQgPSBudWxsLFxyXG5cdFx0Ym91bmRzIFx0XHQgPSBbMCwgMF0sXHJcblx0XHR2b3hlbCBcdFx0ID0gbnVsbCxcclxuXHRcdGRlbHRhIFx0XHQgPSBbMCwgMF0sXHJcblx0XHRvUG9zIFx0XHQgPSBbXSxcclxuXHRcdHNwZWVkIFx0XHQgPSAwLFxyXG5cdFx0ZSBcdFx0XHQgPSAwLFxyXG5cdFx0aSBcdFx0XHQgPSAwLFxyXG5cdFx0diBcdFx0XHQgPSAwXHJcblxyXG5cdGZvciAoIGkgPSAwOyBpIDwgdm94ZWxMaXN0Lmxlbmd0aDsgaSArKyApIHtcclxuXHRcdHZveGVsID0gdm94ZWxMaXN0WyBpIF1cclxuXHJcblx0XHRpZiAoICEhIXZveGVsIHx8ICEhIXZveGVsLnBvc2l0aW9uKSBjb250aW51ZVxyXG5cclxuXHRcdGlmICggISF2b3hlbCAmJiBkaXN0YW5jZTJkQ29tcGFyZSggcG9zaXRpb24sIHZveGVsLnBvc2l0aW9uLCAxODAgKSApIHsgXHQvLyBkbyBjb2xsaXNpb25zIG9uIHZveGVscyAmIHN0cnVjdHVyZXMuLi4ganVzdCB3YWxscyBhdCBmaXJzdC4uXHRcdFxyXG5cdFx0XHRpZiAoIHZveGVsLmxvYWRlZCA9PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0dm94ZWwubG9hZGVkID0gdHJ1ZVxyXG5cdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoJ3tcImNvbW1hbmRcIjogXCJsb2FkIGVudGl0aWVzXCIsIFwiZGF0YVwiOntcImNvb3Jkc1wiOlwiJyt2b3hlbC5jZWxsWzBdKycuJyt2b3hlbC5jZWxsWzFdKycuJyt2b3hlbC5jZWxsWzJdKydcIn19Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggZGlzdGFuY2UyZENvbXBhcmUoIHBvc2l0aW9uLCB2b3hlbC5wb3NpdGlvbiwgNjAgKSApIHtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdGxldCBhbHQgPSB2b3hlbC5hbHRpdHVkZSB8fCAwXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0eVBvcyA9IHZveGVsLnBvc2l0aW9uWzFdXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKCBkaXN0YW5jZTJkQ29tcGFyZSggcG9zaXRpb24sIHZveGVsLnBvc2l0aW9uLCAyNC41ICkgKSB7XHJcblx0XHRcdFx0XHRpZiAoIHBvc2l0aW9uWzFdID4geVBvcyAtIDIxICsgdnJIZWlnaHQgICYmIHBvc2l0aW9uWzFdIDwgeVBvcyArIDE0LjI1ICsgKHZySGVpZ2h0ICE9IDAgPyB2ckhlaWdodC0xIDogMCkgKSB7XHJcblx0XHRcdFx0XHRcdGNvbGxpc2lvbiA9IHRydWVcclxuXHRcdFx0XHRcdFx0c2VsZi5wb3N0TWVzc2FnZSgne1wiY29tbWFuZFwiOiBcInBsYXRmb3JtIGNvbGxpc2lvblwiLCBcImRhdGFcIjp7XCJ0eXBlXCI6XCJ0b3BcIiwgXCJwb3NpdGlvblwiOlsnICsgdm94ZWwucG9zaXRpb25bMF0gKyAnLCcgKyB5UG9zICsgJywnICsgdm94ZWwucG9zaXRpb25bMl0gKyAnXSB9fScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICggISF2b3hlbC5lbnRpdGllcyAmJiB2b3hlbC5lbnRpdGllcy5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdFx0XHRlID0gdm94ZWwuZW50aXRpZXMubGVuZ3RoIC0gMVxyXG5cclxuXHRcdFx0XHRcdFx0d2hpbGUgKCBlID49IDAgKSB7XHJcblx0XHRcdFx0XHRcdFx0ZW50ID0gdm94ZWwuZW50aXRpZXNbIGUgXVxyXG5cdFx0XHRcdFx0XHRcdGVudFJhZGl1cyA9IGVudC5ib3VuZGluZ1JhZGl1c1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoICEhISBlbnQgfHwgISEhZW50LmNvbXBvbmVudHMgKSB7IGNvbnNvbGUud2FybihcIlByb2JsZW0gd2l0aCBlbnRpdHkhIFwiLGUgLGVudCk7IGNvbnRpbnVlIH1cclxuXHRcdFx0XHRcdFx0XHQvLyBjb25zb2xlLmluZm8oXCJjb2xsaXNpb24gY2hlY2sgZW50aXR5IFwiLCBwb3NpdGlvbiwgZW50LnBvc2l0aW9uLCAoZW50LmJvdW5kaW5nUmFkaXVzIHx8IDUpKVxyXG5cdFx0XHRcdFx0XHRcdGlmICggZGlzdGFuY2UzZENvbXBhcmUoIHBvc2l0aW9uLCBbZW50LnBvc2l0aW9uWzBdLWVudFJhZGl1cywgZW50LnBvc2l0aW9uWzFdLCBlbnQucG9zaXRpb25bMl0tZW50UmFkaXVzXSwgKGVudFJhZGl1cyoxLjR8fDMpKzQuNSkgKSB7IFxyXG5cdFx0XHRcdFx0XHRcdFx0ZW50LmNvbXBvbmVudHMubWFwKCBlbnRDb21wID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBkaXN0YW5jZTNkQ29tcGFyZSggcG9zaXRpb24sIFsgZW50LnBvc2l0aW9uWzBdICsgZW50Q29tcC5wb3NpdGlvblswXSwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVudC5wb3NpdGlvblsxXSArIGVudENvbXAucG9zaXRpb25bMV0sIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbnQucG9zaXRpb25bMl0gKyBlbnRDb21wLnBvc2l0aW9uWzJdIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBdLCBlbnRDb21wLmJvdW5kaW5nUmFkaXVzIHx8IE1hdGgubWF4KGVudENvbXAucHJvcHMuZ2VvbWV0cnkuc2l6ZVswXSwgZW50Q29tcC5wcm9wcy5nZW9tZXRyeS5zaXplWzJdKSAvIDEuNSApKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sbGlzaW9uID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoICEhIGVudENvbXAucHJvcHMuZmxvb3IgKSB7IFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5pbmZvKFwiZmxvb3IgY29sbGlzaW9uIVwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoIHtjb21tYW5kOiBcImZsb29yIGNvbGxpc2lvblwiLCBkYXRhOiB7IFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogZW50Q29tcC5wb3NpdGlvbiwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZsb29yRGF0YTogZW50Q29tcC5wcm9wcy5mbG9vclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fX0pKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSgge2NvbW1hbmQ6IFwiZW50aXR5LXVzZXIgY29sbGlzaW9uXCIsIGRhdGE6eyBwb3NpdGlvbjogZW50Q29tcC5wb3NpdGlvbiB9fSApIClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGUgLT0gMVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKCAhY29sbGlzaW9uIClcclxuXHJcblx0XHRvYnNlcnZlci5wcmV2UG9zID0gWyBvYnNlcnZlci5wb3NpdGlvblswXSwgb2JzZXJ2ZXIucG9zaXRpb25bMV0sIG9ic2VydmVyLnBvc2l0aW9uWzJdIF1cclxuXHRcclxuXHJcblx0c2VsZi5wb3N0TWVzc2FnZSgne1wiY29tbWFuZFwiOiBcInVwZGF0ZVwifScpXHJcblx0c2VsZi51cGRhdGVMb29wID0gc2V0VGltZW91dCggKCkgPT4ge1xyXG5cdFx0c2VsZi51cGRhdGUoKVxyXG5cdH0sIDE1KVxyXG5cclxufVxyXG5cclxuc2VsZi5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoIGV2ZW50ICkgeyBcclxuXHJcblx0dmFyIG1lc3NhZ2UgID0gSlNPTi5wYXJzZSggZXZlbnQuZGF0YSApLFxyXG5cdFx0ZGF0YSBcdCA9IG1lc3NhZ2UuZGF0YSxcclxuXHRcdHVzZXIgXHQgPSBvYnNlcnZlcixcclxuXHRcdHZveGVsIFx0ID0gbnVsbCxcclxuXHRcdHRvUmVtb3ZlID0gbnVsbCxcclxuXHRcdGl0ZW1zIFx0ID0gW10sXHJcblx0XHRlbnRpdGllcyA9IFtdLFxyXG5cdFx0YyBcdFx0ID0gMCxcclxuXHRcdHAgXHRcdCA9IDBcclxuXHRcdFxyXG5cdGlmICggbWVzc2FnZS5jb21tYW5kID09IFwidXBkYXRlXCIgKSB7XHJcblx0XHQvLyB1c2VyLnByZXZQb3MgPSBbdXNlci5wb3NpdGlvblswXSwgdXNlci5wb3NpdGlvblsxXSwgdXNlci5wb3NpdGlvblsyXV07XHJcblx0XHR1c2VyLnBvc2l0aW9uID0gZGF0YS5wb3NpdGlvblxyXG5cdFx0dXNlci52ZWxvY2l0eSA9IGRhdGEudmVsb2NpdHlcclxuXHRcdHVzZXIudnJIZWlnaHQgPSBkYXRhLnZySGVpZ2h0XHJcblx0XHQvL3NlbGYucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoc2VsZi5vYnNlcnZlcikpO1xyXG5cdH0gZWxzZSBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcImFkZCB2b3hlbHNcIiApIHtcclxuXHJcblx0XHR2b3hlbExpc3QgPSB2b3hlbExpc3QuY29uY2F0KGRhdGEpXHJcblx0XHRkYXRhLm1hcCggdiA9PiB7XHJcblx0XHRcdHZveGVsc1sgdi5jZWxsLmpvaW4oXCIuXCIpIF0gPSB2XHJcblx0XHR9KVxyXG5cclxuXHR9IGVsc2UgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJyZW1vdmUgdm94ZWxzXCIgKSB7XHJcblxyXG5cdFx0cCA9IGRhdGEubGVuZ3RoIC0xXHJcblxyXG5cdFx0d2hpbGUgKCBwID49IDAgKSB7XHJcblxyXG5cdFx0XHR0b1JlbW92ZSA9IGRhdGFbcF1cclxuXHRcdFx0YyA9IHZveGVsTGlzdC5sZW5ndGgtMVxyXG5cclxuXHRcdFx0d2hpbGUgKCBjID49IDAgKSB7XHJcblxyXG5cdFx0XHRcdHZveGVsID0gdm94ZWxMaXN0WyBjIF1cclxuXHRcdFx0XHRpZiAoIHZveGVsICE9IG51bGwgJiYgdm94ZWwuY2VsbFswXSA9PSB0b1JlbW92ZS5jZWxsWzBdICYmIHZveGVsLmNlbGxbMV0gPT0gdG9SZW1vdmUuY2VsbFsxXSAgJiYgdm94ZWwuY2VsbFsyXSA9PSB0b1JlbW92ZS5jZWxsWzJdICkge1x0XHJcblx0XHRcdFx0XHR2b3hlbExpc3Quc3BsaWNlKCBjLCAxIClcclxuXHRcdFx0XHRcdHZveGVsc1sgdm94ZWwuY2VsbC5qb2luKFwiLlwiKV0gPSBudWxsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGMtLVxyXG5cdFx0XHR9XHJcblx0XHRcdHAgLS1cclxuXHRcdH1cclxuXHJcblx0fSBlbHNlIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwiYWRkIGVudGl0eVwiICkge1xyXG5cclxuXHRcdGlmICghISEgdm94ZWxzW2RhdGEuY29vcmRzLmpvaW4oXCIuXCIpXSlcclxuXHRcdFx0dm94ZWxzW2RhdGEuY29vcmRzLmpvaW4oXCIuXCIpXSA9IHsgZW50aXRpZXM6IFtdLCBjZWxsOiBkYXRhLmNvb3JkcyB9XHJcblxyXG4gICAgXHRlbnRpdGllcyA9IHZveGVsc1tkYXRhLmNvb3Jkcy5qb2luKFwiLlwiKV0uZW50aXRpZXNcclxuICAgIFx0ZW50aXRpZXMucHVzaCggZGF0YS5lbnRpdHkgKVxyXG5cclxuICB9IGVsc2UgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJyZW1vdmUgZW50aXR5XCIgKSB7XHJcblxyXG4gICAgXHRlbnRpdGllcyA9IHZveGVsc1sgZGF0YS5jb29yZHMuam9pbihcIi5cIikgXS5lbnRpdGllc1xyXG5cclxuXHRcdGlmICggZW50aXRpZXMgIT0gbnVsbCApIHtcclxuXHJcblx0XHRcdGMgPSBlbnRpdGllcy5sZW5ndGgtMVxyXG5cdFx0XHR3aGlsZSAoIGMgPj0gMCApIHtcclxuXHRcdFx0XHRpZiAoIGVudGl0aWVzW2NdLmlkID09IGRhdGEuZW50aXR5SWQgKSB7XHJcblx0XHRcdFx0XHR2b3hlbHNbIGRhdGEuY29vcmRzLmpvaW4oXCIuXCIpIF0uZW50aXRpZXMuc3BsaWNlKGMsIDEpXHJcblx0XHRcdFx0XHRjID0gLTFcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Yy0tXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fSBlbHNlIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwidXBkYXRlIGVudGl0eVwiICkge1xyXG5cclxuXHRcdGVudGl0aWVzID0gdm94ZWxzWyBkYXRhLmNvb3Jkcy5qb2luKFwiLlwiKSBdLmVudGl0aWVzXHJcblxyXG5cdFx0aWYgKCBlbnRpdGllcyAhPSBudWxsICkge1xyXG5cdFx0XHRjID0gZW50aXRpZXMubGVuZ3RoLTFcclxuXHJcblx0XHRcdHdoaWxlICggYyA+PSAwICkge1xyXG5cdFx0XHRcdGlmIChlbnRpdGllc1sgYyBdLmlkID09IGRhdGEuZW50aXR5SWQpIHtcclxuXHRcdFx0XHRcdGVudGl0aWVzWyBjIF0gPSBkYXRhLmVudGl0eVxyXG5cdFx0XHRcdFx0YyA9IC0xXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGMtLVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcImNsZWFyXCIgKSB7XHJcblxyXG5cdFx0dm94ZWxzID0gW11cclxuXHRcdHZveGVsTGlzdCA9IFtdXHJcblxyXG5cdH0gZWxzZSBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcInN0YXJ0XCIgKSB7XHJcblxyXG5cdFx0c2VsZi51cGRhdGUoKVxyXG5cclxuXHR9IGVsc2UgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJzdG9wXCIgKSB7XHJcblxyXG5cdFx0c2VsZi5zdG9wKClcclxuXHJcblx0fSBlbHNlIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwibG9nXCIgKSB7XHJcblx0XHRpZiAoZGF0YSA9PSBcIlwiKSB7XHJcblx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoJ3tcImNvbW1hbmRcIjpcImxvZ1wiLFwiZGF0YVwiOlsnICsgdXNlci5wb3NpdGlvblswXSArICcsJyArIHVzZXIucG9zaXRpb25bMV0gKyAnLCcgKyB1c2VyLnBvc2l0aW9uWzJdICsgJ119Jyk7XHJcblx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoJ3tcImNvbW1hbmRcIjpcImxvZ1wiLFwiZGF0YVwiOicgKyBKU09OLnN0cmluZ2lmeSh2b3hlbHMpKyAnfScpO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbnNlbGYuc3RvcCA9ICgpID0+IHtcclxuXHRjbGVhclRpbWVvdXQoIHNlbGYudXBkYXRlTG9vcCApXHJcbn1cclxuIl19
