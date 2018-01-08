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
	    collision = false,
	    yPos = 0,
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
					if (position[1] > yPos - 21 + vrHeight && position[1] < 14.25 + yPos + (vrHeight != 0 ? vrHeight - 1 : 0)) {
						collision = true;
						self.postMessage('{"command": "platform collision", "data":{"type":"top", "position":[' + voxel.position[0] + ',' + yPos + ',' + voxel.position[2] + '] }}');
					}
				}
				if (!!voxel.entities && voxel.entities.length > 0) {
					collision = self.checkStaticCollisions(voxel, position);
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

self.checkStaticCollisions = function (voxel, position) {
	var e = voxel.entities.length - 1,
	    ent = null,
	    entRadius = 10,
	    collision = false;

	while (e >= 0) {
		ent = voxel.entities[e];
		entRadius = ent.boundingRadius;
		if (!!!ent || !!!ent.components) {
			console.warn("Problem with entity! ", e, ent);continue;
		}
		if (distance3dCompare(position, [ent.position[0] - entRadius, ent.position[1], ent.position[2] - entRadius], (entRadius * 1.6 || 3) + 2.5)) {

			ent.components.map(function (entComp) {
				var boundingRadius = entComp.boundingRadius * 1.2 || Math.max(entComp.props.geometry.size[0], entComp.props.geometry.size[2]) * 1.4;

				if (!!entComp.props.floor) {
					if (distance2dCompare(position, [ent.position[0] + entComp.position[0], 0, ent.position[2] + entComp.position[2]], boundingRadius * 2.2)) {
						var verticalOffset = position[1] + 2 - (entComp.position[1] + ent.position[1]); //  + entComp.geometry ? entComp.geometry.size[1] : 1
						if (verticalOffset > 0 && verticalOffset < 5) {
							self.postMessage(JSON.stringify({
								command: "floor collision", data: {
									position: entComp.position,
									floorData: entComp.props.floor
								}
							}));
							collision = true;
						}
					}
				} else if (distance3dCompare(position, [ent.position[0] + entComp.position[0], ent.position[1] + entComp.position[1], ent.position[2] + entComp.position[2]], boundingRadius)) {
					collision = true;
					self.postMessage(JSON.stringify({ command: "entity-user collision", data: { position: entComp.position } }));
				}
			});
		}
		e -= 1;
	}
	return collision;
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
		if (!data || !data.coords) {
			console.warn("no data to update entity");
			return;
		}
		var cell = data.coords.join(".");
		if (!voxels[cell]) {
			console.warn("can't update entity with no voxel");
			return;
		}
		entities = voxels[cell].entities;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHdvcmtlcnNcXHN0YXRpYy1jb2xsaXNpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBWTtBQUN6QixRQUFPLEtBQUssSUFBTCxDQUFXLEtBQUssR0FBTCxDQUFXLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFoQixFQUF1QixDQUF2QixJQUE2QixLQUFLLEdBQUwsQ0FBVyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBaEIsRUFBdUIsQ0FBdkIsQ0FBeEMsQ0FBUDtBQUNELENBRkg7QUFBQSxJQUdFLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsRUFBZTtBQUFFO0FBQ3BDLFFBQU8sS0FBSyxHQUFMLENBQVcsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQWhCLEVBQXVCLENBQXZCLElBQTZCLEtBQUssR0FBTCxDQUFXLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFoQixFQUF1QixDQUF2QixDQUE3QixHQUEyRCxJQUFFLENBQXBFO0FBQ0EsQ0FMSDtBQUFBLElBTUUsb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixFQUFlO0FBQUU7QUFDcEMsUUFBUSxLQUFLLEdBQUwsQ0FBVyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBaEIsRUFBdUIsQ0FBdkIsSUFBNkIsS0FBSyxHQUFMLENBQVcsRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQWhCLEVBQXVCLENBQXZCLENBQTdCLEdBQTBELEtBQUssR0FBTCxDQUFXLEVBQUUsQ0FBRixJQUFLLEVBQUUsQ0FBRixDQUFoQixFQUF1QixDQUF2QixDQUEzRCxHQUEyRixJQUFFLENBQXBHO0FBQ0EsQ0FSSDs7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QUFDeEMsT0FBSyxNQUFMO0FBQ0EsRUFGTSxNQUVBLElBQUssUUFBUSxPQUFSLElBQW1CLE1BQXhCLEVBQWlDO0FBQ3ZDLE9BQUssSUFBTDtBQUNBLEVBRk0sTUFFQSxJQUFLLFFBQVEsT0FBUixJQUFtQixLQUF4QixFQUFnQztBQUN0QyxNQUFJLFFBQVEsRUFBWixFQUFnQjtBQUNmLFFBQUssV0FBTCxDQUFpQiw4QkFBOEIsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUE5QixHQUFpRCxHQUFqRCxHQUF1RCxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXZELEdBQTBFLEdBQTFFLEdBQWdGLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBaEYsR0FBbUcsSUFBcEg7QUFDQSxRQUFLLFdBQUwsQ0FBaUIsNkJBQTZCLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBN0IsR0FBcUQsR0FBdEU7QUFDQTtBQUNEO0FBQ0QsQ0EvRkQ7O0FBaUdBLEtBQUssSUFBTCxHQUFZLFlBQU07QUFDakIsY0FBYyxLQUFLLFVBQW5CO0FBQ0EsQ0FGRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiAgc3RhdGljIGNvbGxpc2lvbiBkZXRlY3Rpb24gd29ya2VyICovXHJcblxyXG5sZXQgZGlzdGFuY2UyZCA9ICggYSwgYiApID0+IHtcclxuICAgIHJldHVybiBNYXRoLnNxcnQoIE1hdGgucG93KCAoYVswXS1iWzBdKSwgMiApICsgTWF0aC5wb3coIChhWzJdLWJbMl0pLCAyICkgKVxyXG4gIH0sXHJcbiAgZGlzdGFuY2UyZENvbXBhcmUgPSAoIGEsIGIsIG4gKSA9PiB7IC8vIG1vcmUgZWZmaWNpZW50IHZlcnNpb24gb2YgZGlzdGFuY2UyZCgpXHJcblx0ICByZXR1cm4gTWF0aC5wb3coIChhWzBdLWJbMF0pLCAyICkgKyBNYXRoLnBvdyggKGFbMl0tYlsyXSksIDIgKSA8IChuKm4pXHJcbiAgfSxcclxuICBkaXN0YW5jZTNkQ29tcGFyZSA9ICggYSwgYiwgbiApID0+IHsgLy8gLi5mYXN0ZXIgdGhhbiB1c2luZyBNYXRoLnNxcnQoKVxyXG5cdCAgcmV0dXJuIChNYXRoLnBvdyggKGFbMF0tYlswXSksIDIgKSArIE1hdGgucG93KCAoYVsxXS1iWzFdKSwgMiApICsgTWF0aC5wb3coIChhWzJdLWJbMl0pLCAyICkgKSA8IChuKm4pXHJcbiAgfVxyXG5cclxubGV0IG9ic2VydmVyID0ge1xyXG5cdFx0cG9zaXRpb246IFswLCAwLCAwXSxcclxuXHRcdHByZXZQb3M6IFswLCAwLCAwXSxcclxuXHRcdHZlbG9jaXR5OiBbMCwgMCwgMF0sXHJcblx0XHR2ckhlaWdodDogMFxyXG5cdH0sXHJcblx0dm94ZWxMaXN0ID0gW10sXHJcblx0dm94ZWxzID0gW11cclxuXHJcbnNlbGYudXBkYXRlID0gKCApID0+IHtcclxuXHJcblx0dmFyIGRpc3RhbmNlID0gMCxcclxuXHRcdHBvc2l0aW9uIFx0ID0gb2JzZXJ2ZXIucG9zaXRpb24sXHJcblx0XHRpbm5lckJveCBcdCA9IFtmYWxzZSwgZmFsc2VdLFxyXG5cdFx0dmVsb2NpdHkgXHQgPSBvYnNlcnZlci52ZWxvY2l0eSxcclxuXHRcdHZySGVpZ2h0IFx0ID0gb2JzZXJ2ZXIudnJIZWlnaHQsXHJcblx0XHRjb2xsaXNpb24gXHQgPSBmYWxzZSxcclxuXHRcdHlQb3MgXHRcdCA9IDAsXHJcblx0XHR2b3hlbCBcdFx0ID0gbnVsbCxcclxuXHRcdGVudCBcdFx0ID0gbnVsbCxcclxuXHRcdGVudFJhZGl1cyAgICA9IDEwLFxyXG5cdFx0c3RydWN0dXJlIFx0ID0gbnVsbCxcclxuXHRcdGJvdW5kcyBcdFx0ID0gWzAsIDBdLFxyXG5cdFx0dm94ZWwgXHRcdCA9IG51bGwsXHJcblx0XHRkZWx0YSBcdFx0ID0gWzAsIDBdLFxyXG5cdFx0b1BvcyBcdFx0ID0gW10sXHJcblx0XHRzcGVlZCBcdFx0ID0gMCxcclxuXHRcdGUgXHRcdFx0ID0gMCxcclxuXHRcdGkgXHRcdFx0ID0gMCxcclxuXHRcdHYgXHRcdFx0ID0gMFxyXG5cclxuXHRmb3IgKCBpID0gMDsgaSA8IHZveGVsTGlzdC5sZW5ndGg7IGkgKysgKSB7XHJcblx0XHR2b3hlbCA9IHZveGVsTGlzdFsgaSBdXHJcblxyXG5cdFx0aWYgKCAhISF2b3hlbCB8fCAhISF2b3hlbC5wb3NpdGlvbikgY29udGludWVcclxuXHRcdGlmICggISF2b3hlbCAmJiBkaXN0YW5jZTJkQ29tcGFyZSggcG9zaXRpb24sIHZveGVsLnBvc2l0aW9uLCAxODAgKSApIHsgXHQvLyBkbyBjb2xsaXNpb25zIG9uIHZveGVscyAmIHN0cnVjdHVyZXMuLi4ganVzdCB3YWxscyBhdCBmaXJzdC4uXHRcdFxyXG5cdFx0XHRpZiAoIHZveGVsLmxvYWRlZCA9PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0dm94ZWwubG9hZGVkID0gdHJ1ZVxyXG5cdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoJ3tcImNvbW1hbmRcIjogXCJsb2FkIGVudGl0aWVzXCIsIFwiZGF0YVwiOntcImNvb3Jkc1wiOlwiJyt2b3hlbC5jZWxsWzBdKycuJyt2b3hlbC5jZWxsWzFdKycuJyt2b3hlbC5jZWxsWzJdKydcIn19Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCBkaXN0YW5jZTJkQ29tcGFyZSggcG9zaXRpb24sIHZveGVsLnBvc2l0aW9uLCA2MCApICkge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0bGV0IGFsdCA9IHZveGVsLmFsdGl0dWRlIHx8IDBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR5UG9zID0gdm94ZWwucG9zaXRpb25bMV1cclxuXHRcdFx0XHRpZiAoIGRpc3RhbmNlMmRDb21wYXJlKCBwb3NpdGlvbiwgdm94ZWwucG9zaXRpb24sIDI0LjUgKSApIHtcclxuXHRcdFx0XHRcdGlmICggcG9zaXRpb25bMV0gPiB5UG9zIC0gMjEgKyB2ckhlaWdodCAgJiYgcG9zaXRpb25bMV0gPCAxNC4yNSt5UG9zICsgKHZySGVpZ2h0ICE9IDAgPyB2ckhlaWdodC0xIDogMCkgKSB7XHJcblx0XHRcdFx0XHRcdGNvbGxpc2lvbiA9IHRydWVcclxuXHRcdFx0XHRcdFx0c2VsZi5wb3N0TWVzc2FnZSgne1wiY29tbWFuZFwiOiBcInBsYXRmb3JtIGNvbGxpc2lvblwiLCBcImRhdGFcIjp7XCJ0eXBlXCI6XCJ0b3BcIiwgXCJwb3NpdGlvblwiOlsnICsgdm94ZWwucG9zaXRpb25bMF0gKyAnLCcgKyB5UG9zICsgJywnICsgdm94ZWwucG9zaXRpb25bMl0gKyAnXSB9fScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cdFxyXG5cdFx0XHRcdGlmICggISF2b3hlbC5lbnRpdGllcyAmJiB2b3hlbC5lbnRpdGllcy5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdFx0Y29sbGlzaW9uID0gc2VsZi5jaGVja1N0YXRpY0NvbGxpc2lvbnMoIHZveGVsLCBwb3NpdGlvbiApXHJcblx0XHRcdFx0fVx0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmICggIWNvbGxpc2lvbiApXHJcblx0XHRvYnNlcnZlci5wcmV2UG9zID0gWyBvYnNlcnZlci5wb3NpdGlvblswXSwgb2JzZXJ2ZXIucG9zaXRpb25bMV0sIG9ic2VydmVyLnBvc2l0aW9uWzJdIF1cclxuXHRcclxuXHRzZWxmLnBvc3RNZXNzYWdlKCd7XCJjb21tYW5kXCI6IFwidXBkYXRlXCJ9JylcclxuXHRzZWxmLnVwZGF0ZUxvb3AgPSBzZXRUaW1lb3V0KCAoKSA9PiB7XHJcblx0XHRzZWxmLnVwZGF0ZSgpXHJcblx0fSwgMTUpXHJcbn1cclxuXHJcbnNlbGYuY2hlY2tTdGF0aWNDb2xsaXNpb25zID0gKCB2b3hlbCwgcG9zaXRpb24gKSA9PiB7XHJcblx0bGV0IGUgPSB2b3hlbC5lbnRpdGllcy5sZW5ndGggLSAxLFxyXG5cdFx0ZW50ID0gbnVsbCxcclxuXHRcdGVudFJhZGl1cyA9IDEwLFxyXG5cdFx0Y29sbGlzaW9uID0gZmFsc2VcclxuXHJcblx0d2hpbGUgKGUgPj0gMCkge1xyXG5cdFx0ZW50ID0gdm94ZWwuZW50aXRpZXNbZV1cclxuXHRcdGVudFJhZGl1cyA9IGVudC5ib3VuZGluZ1JhZGl1c1xyXG5cdFx0aWYgKCEhIWVudCB8fCAhISFlbnQuY29tcG9uZW50cykge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXCJQcm9ibGVtIHdpdGggZW50aXR5ISBcIiwgZSwgZW50KTsgY29udGludWVcclxuXHRcdH1cclxuXHRcdGlmIChkaXN0YW5jZTNkQ29tcGFyZShcclxuXHRcdFx0cG9zaXRpb24sXHJcblx0XHRcdFtlbnQucG9zaXRpb25bMF0gLSBlbnRSYWRpdXMsIGVudC5wb3NpdGlvblsxXSxcclxuXHRcdFx0ZW50LnBvc2l0aW9uWzJdIC0gZW50UmFkaXVzXSwgKGVudFJhZGl1cyAqIDEuNiB8fCAzKSArIDIuNVxyXG5cdFx0KSkge1xyXG5cclxuXHRcdFx0ZW50LmNvbXBvbmVudHMubWFwKGVudENvbXAgPT4ge1xyXG5cdFx0XHRcdGxldCBib3VuZGluZ1JhZGl1cyA9IGVudENvbXAuYm91bmRpbmdSYWRpdXMgKiAxLjIgfHwgTWF0aC5tYXgoZW50Q29tcC5wcm9wcy5nZW9tZXRyeS5zaXplWzBdLCBlbnRDb21wLnByb3BzLmdlb21ldHJ5LnNpemVbMl0pICogMS40XHJcblxyXG5cdFx0XHRcdGlmICghIWVudENvbXAucHJvcHMuZmxvb3IpIHtcclxuXHRcdFx0XHRcdGlmIChkaXN0YW5jZTJkQ29tcGFyZShcclxuXHRcdFx0XHRcdFx0cG9zaXRpb24sXHJcblx0XHRcdFx0XHRcdFtlbnQucG9zaXRpb25bMF0gKyBlbnRDb21wLnBvc2l0aW9uWzBdLCAwLCBlbnQucG9zaXRpb25bMl0gKyBlbnRDb21wLnBvc2l0aW9uWzJdXSxcclxuXHRcdFx0XHRcdFx0Ym91bmRpbmdSYWRpdXMgKiAyLjJcclxuXHRcdFx0XHRcdCkpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHZlcnRpY2FsT2Zmc2V0ID0gKHBvc2l0aW9uWzFdICsgMiAtIChlbnRDb21wLnBvc2l0aW9uWzFdICsgZW50LnBvc2l0aW9uWzFdICkpIC8vICArIGVudENvbXAuZ2VvbWV0cnkgPyBlbnRDb21wLmdlb21ldHJ5LnNpemVbMV0gOiAxXHJcblx0XHRcdFx0XHRcdGlmICh2ZXJ0aWNhbE9mZnNldCA+IDAgJiYgdmVydGljYWxPZmZzZXQgPCA1KSB7XHJcblx0XHRcdFx0XHRcdFx0c2VsZi5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7XHJcblx0XHRcdFx0XHRcdFx0XHRjb21tYW5kOiBcImZsb29yIGNvbGxpc2lvblwiLCBkYXRhOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiBlbnRDb21wLnBvc2l0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmbG9vckRhdGE6IGVudENvbXAucHJvcHMuZmxvb3JcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KSlcclxuXHRcdFx0XHRcdFx0XHRjb2xsaXNpb24gPSB0cnVlXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKGRpc3RhbmNlM2RDb21wYXJlKFxyXG5cdFx0XHRcdFx0cG9zaXRpb24sXHJcblx0XHRcdFx0XHRbZW50LnBvc2l0aW9uWzBdICsgZW50Q29tcC5wb3NpdGlvblswXSwgZW50LnBvc2l0aW9uWzFdICsgZW50Q29tcC5wb3NpdGlvblsxXSwgZW50LnBvc2l0aW9uWzJdICsgZW50Q29tcC5wb3NpdGlvblsyXV0sXHJcblx0XHRcdFx0XHRib3VuZGluZ1JhZGl1c1xyXG5cdFx0XHRcdCkpIHtcclxuXHRcdFx0XHRcdGNvbGxpc2lvbiA9IHRydWVcclxuXHRcdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyBjb21tYW5kOiBcImVudGl0eS11c2VyIGNvbGxpc2lvblwiLCBkYXRhOiB7IHBvc2l0aW9uOiBlbnRDb21wLnBvc2l0aW9uIH0gfSkpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHRcdGUgLT0gMVxyXG5cdH1cclxuXHRyZXR1cm4gY29sbGlzaW9uXHJcbn1cclxuXHJcbnNlbGYub25tZXNzYWdlID0gKCBldmVudCApID0+IHsgXHJcblxyXG5cdHZhciBtZXNzYWdlICA9IEpTT04ucGFyc2UoIGV2ZW50LmRhdGEgKSxcclxuXHRcdGRhdGEgXHQgPSBtZXNzYWdlLmRhdGEsXHJcblx0XHR1c2VyIFx0ID0gb2JzZXJ2ZXIsXHJcblx0XHR2b3hlbCBcdCA9IG51bGwsXHJcblx0XHR0b1JlbW92ZSA9IG51bGwsXHJcblx0XHRpdGVtcyBcdCA9IFtdLFxyXG5cdFx0ZW50aXRpZXMgPSBbXSxcclxuXHRcdGMgXHRcdCA9IDAsXHJcblx0XHRwIFx0XHQgPSAwXHJcblx0XHRcclxuXHRpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcInVwZGF0ZVwiICkge1xyXG5cdFx0Ly8gdXNlci5wcmV2UG9zID0gW3VzZXIucG9zaXRpb25bMF0sIHVzZXIucG9zaXRpb25bMV0sIHVzZXIucG9zaXRpb25bMl1dO1xyXG5cdFx0dXNlci5wb3NpdGlvbiA9IGRhdGEucG9zaXRpb25cclxuXHRcdHVzZXIudmVsb2NpdHkgPSBkYXRhLnZlbG9jaXR5XHJcblx0XHR1c2VyLnZySGVpZ2h0ID0gZGF0YS52ckhlaWdodFxyXG5cdFx0Ly9zZWxmLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHNlbGYub2JzZXJ2ZXIpKTtcclxuXHR9IGVsc2UgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJhZGQgdm94ZWxzXCIgKSB7XHJcblx0XHR2b3hlbExpc3QgPSB2b3hlbExpc3QuY29uY2F0KGRhdGEpXHJcblx0XHRkYXRhLm1hcCggdiA9PiB7XHJcblx0XHRcdHZveGVsc1sgdi5jZWxsLmpvaW4oXCIuXCIpIF0gPSB2XHJcblx0XHR9KVxyXG5cdH0gZWxzZSBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcInJlbW92ZSB2b3hlbHNcIiApIHtcclxuXHRcdHAgPSBkYXRhLmxlbmd0aCAtMVxyXG5cdFxyXG5cdFx0d2hpbGUgKCBwID49IDAgKSB7XHJcblx0XHRcdHRvUmVtb3ZlID0gZGF0YVtwXVxyXG5cdFx0XHRjID0gdm94ZWxMaXN0Lmxlbmd0aC0xXHJcblx0XHRcdFxyXG5cdFx0XHR3aGlsZSAoIGMgPj0gMCApIHtcclxuXHRcdFx0XHR2b3hlbCA9IHZveGVsTGlzdFsgYyBdXHJcblx0XHRcdFx0aWYgKCB2b3hlbCAhPSBudWxsICYmIHZveGVsLmNlbGxbMF0gPT0gdG9SZW1vdmUuY2VsbFswXSAmJiB2b3hlbC5jZWxsWzFdID09IHRvUmVtb3ZlLmNlbGxbMV0gICYmIHZveGVsLmNlbGxbMl0gPT0gdG9SZW1vdmUuY2VsbFsyXSApIHtcdFxyXG5cdFx0XHRcdFx0dm94ZWxMaXN0LnNwbGljZSggYywgMSApXHJcblx0XHRcdFx0XHR2b3hlbHNbIHZveGVsLmNlbGwuam9pbihcIi5cIildID0gbnVsbFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjLS1cclxuXHRcdFx0fVxyXG5cdFx0XHRwIC0tXHJcblx0XHR9XHJcblx0fSBlbHNlIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwiYWRkIGVudGl0eVwiICkge1xyXG5cdFx0aWYgKCEhISB2b3hlbHNbZGF0YS5jb29yZHMuam9pbihcIi5cIildKVxyXG5cdFx0XHR2b3hlbHNbZGF0YS5jb29yZHMuam9pbihcIi5cIildID0geyBlbnRpdGllczogW10sIGNlbGw6IGRhdGEuY29vcmRzIH1cclxuXHJcbiAgICBcdGVudGl0aWVzID0gdm94ZWxzW2RhdGEuY29vcmRzLmpvaW4oXCIuXCIpXS5lbnRpdGllc1xyXG4gICAgXHRlbnRpdGllcy5wdXNoKCBkYXRhLmVudGl0eSApXHJcbiAgXHR9IGVsc2UgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJyZW1vdmUgZW50aXR5XCIgKSB7XHJcbiAgICBcdGVudGl0aWVzID0gdm94ZWxzWyBkYXRhLmNvb3Jkcy5qb2luKFwiLlwiKSBdLmVudGl0aWVzXHJcblx0XHRpZiAoIGVudGl0aWVzICE9IG51bGwgKSB7XHJcblx0XHRcdGMgPSBlbnRpdGllcy5sZW5ndGgtMVxyXG5cdFx0XHRcclxuXHRcdFx0d2hpbGUgKCBjID49IDAgKSB7XHJcblx0XHRcdFx0aWYgKCBlbnRpdGllc1tjXS5pZCA9PSBkYXRhLmVudGl0eUlkICkge1xyXG5cdFx0XHRcdFx0dm94ZWxzWyBkYXRhLmNvb3Jkcy5qb2luKFwiLlwiKSBdLmVudGl0aWVzLnNwbGljZShjLCAxKVxyXG5cdFx0XHRcdFx0YyA9IC0xXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGMtLVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSBlbHNlIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwidXBkYXRlIGVudGl0eVwiICkge1xyXG5cdFx0aWYgKCFkYXRhIHx8ICFkYXRhLmNvb3Jkcykge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXCJubyBkYXRhIHRvIHVwZGF0ZSBlbnRpdHlcIilcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHRsZXQgY2VsbCA9ICBkYXRhLmNvb3Jkcy5qb2luKFwiLlwiKVxyXG5cdFx0aWYgKCAhdm94ZWxzW2NlbGxdICkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXCJjYW4ndCB1cGRhdGUgZW50aXR5IHdpdGggbm8gdm94ZWxcIilcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHRlbnRpdGllcyA9IHZveGVsc1sgY2VsbCBdLmVudGl0aWVzXHJcblxyXG5cdFx0aWYgKCBlbnRpdGllcyAhPSBudWxsICkge1xyXG5cdFx0XHRjID0gZW50aXRpZXMubGVuZ3RoLTFcclxuXHJcblx0XHRcdHdoaWxlICggYyA+PSAwICkge1xyXG5cdFx0XHRcdGlmIChlbnRpdGllc1sgYyBdLmlkID09IGRhdGEuZW50aXR5SWQpIHtcclxuXHRcdFx0XHRcdGVudGl0aWVzWyBjIF0gPSBkYXRhLmVudGl0eVxyXG5cdFx0XHRcdFx0YyA9IC0xXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGMtLVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSBlbHNlIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwiY2xlYXJcIiApIHtcclxuXHRcdHZveGVscyA9IFtdXHJcblx0XHR2b3hlbExpc3QgPSBbXVxyXG5cdH0gZWxzZSBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcInN0YXJ0XCIgKSB7XHJcblx0XHRzZWxmLnVwZGF0ZSgpXHJcblx0fSBlbHNlIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwic3RvcFwiICkge1xyXG5cdFx0c2VsZi5zdG9wKClcclxuXHR9IGVsc2UgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJsb2dcIiApIHtcclxuXHRcdGlmIChkYXRhID09IFwiXCIpIHtcclxuXHRcdFx0c2VsZi5wb3N0TWVzc2FnZSgne1wiY29tbWFuZFwiOlwibG9nXCIsXCJkYXRhXCI6WycgKyB1c2VyLnBvc2l0aW9uWzBdICsgJywnICsgdXNlci5wb3NpdGlvblsxXSArICcsJyArIHVzZXIucG9zaXRpb25bMl0gKyAnXX0nKTtcclxuXHRcdFx0c2VsZi5wb3N0TWVzc2FnZSgne1wiY29tbWFuZFwiOlwibG9nXCIsXCJkYXRhXCI6JyArIEpTT04uc3RyaW5naWZ5KHZveGVscykrICd9Jyk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuc2VsZi5zdG9wID0gKCkgPT4ge1xyXG5cdGNsZWFyVGltZW91dCggc2VsZi51cGRhdGVMb29wIClcclxufVxyXG4iXX0=
