(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*  static collision detection worker */

"use strict";

var distance2d = function (a, b) {

	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[2] - b[2], 2));
},
    distance2dCompare = function (a, b, n) {
	// more efficient version of distance2d()

	return Math.pow(a[0] - b[0], 2) + Math.pow(a[2] - b[2], 2) < n * n;
},
    distance3dCompare = function (a, b, n) {
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
	    objPos = [],
	    position = observer.position,
	    innerBox = [false, false],
	    velocity = observer.velocity,
	    vrHeight = observer.vrHeight,
	    closeToVenue = false,
	    collision = false,
	    cKey = "",
	    yPos = 0,
	    size = 50000,
	    obj = null,
	    ent = null,
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

		obj = voxelList[i];
		if (!!!obj) continue;
		if (!!obj && distance2dCompare(position, obj.position, 2500000)) {
			// do collisions on voxels & structures... just walls at first..

			if (obj.loaded == undefined) {

				obj.loaded = true;
				self.postMessage("{\"command\": \"load entities\", \"data\":{\"coords\":\"" + obj.cell[0] + "." + obj.cell[1] + "." + obj.cell[2] + "\"}}");
			}

			if (distance2dCompare(position, obj.position, 900000)) {

				var alt = obj.altitude || 0;

				yPos = obj.position[1];

				if (distance2dCompare(position, obj.position, 528000)) {

					if (position[1] > yPos - 300000 + vrHeight && position[1] < yPos + 452000 + vrHeight) {

						collision = true;
						self.postMessage("{\"command\": \"platform collision\", \"data\":{\"type\":\"top\", \"position\":[" + obj.position[0] + "," + yPos + "," + obj.position[2] + "] }}");
					}

					if (!!obj.entities && obj.entities.length > 0) {

						e = obj.entities.length - 1;

						while (e >= 0) {

							ent = obj.entities[e];

							if (!!!ent || !!!ent.components) {
								console.warn("Problem with entity! ", e, ent);continue;
							}

							if (distance3dCompare(position, ent.position, (ent.boundingRadius || 100000) + 10000)) {

								ent.components.map(function (entComp) {

									if (distance3dCompare(position, entComp.position, entComp.boundingRadius || 28000)) {

										collision = true;

										if (!!entComp.props.floor) {

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

							e--;
						}
					}
				}
			}
		}
	}

	if (!collision) {
		observer.prevPos = [observer.position[0], observer.position[1], observer.position[2]];
	}

	self.postMessage("{\"command\": \"update\"}");
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
		user.vrHeight = data.vrHeight
		//self.postMessage(JSON.stringify(self.observer));
		;
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
	} else if (message.command == "start") {

		self.update();
	} else if (message.command == "stop") {

		self.stop();
	} else if (message.command == "log") {

		if (data == "") {
			self.postMessage("{\"command\":\"log\",\"data\":[" + user.position[0] + "," + user.position[1] + "," + user.position[2] + "]}");
			self.postMessage("{\"command\":\"log\",\"data\":" + JSON.stringify(voxels) + "}");
		}
	}
};

self.stop = function () {

	clearTimeout(self.updateLoop);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL1VzZXJzL29wZW5zL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIkM6L0NvZGUvc3JjL2dpdGh1Yi5jb20vY29udm9sdnIvY29udm9sdnIvY2xpZW50L3NyYy9qcy93b3JrZXJzL3N0YXRpYy1jb2xsaXNpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0VBLElBQUksVUFBVSxHQUFHLFVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBTTs7QUFFekIsUUFBTyxJQUFJLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRyxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUcsQ0FBQyxDQUFFLENBQUUsQ0FBQTtDQUU1RTtJQUNELGlCQUFpQixHQUFHLFVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQU07OztBQUVsQyxRQUFPLElBQUksQ0FBQyxHQUFHLENBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRyxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUcsQ0FBQyxDQUFFLEdBQUksQ0FBQyxHQUFDLENBQUMsQUFBQyxDQUFBO0NBRXRFO0lBQ0QsaUJBQWlCLEdBQUcsVUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBTTs7O0FBRWxDLFFBQU8sQUFBQyxJQUFJLENBQUMsR0FBRyxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFD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LE9BQU8sSUFBSSxlQUFlLEVBQUc7O0FBRTlDLFVBQVEsR0FBRyxNQUFNLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxRQUFRLENBQUE7O0FBRXRELE1BQUssUUFBUSxJQUFJLElBQUksRUFBRzs7QUFFdkIsSUFBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFBOztBQUVyQixVQUFRLENBQUMsSUFBSSxDQUFDLEVBQUc7O0FBRWhCLFFBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFHOztBQUV0QyxXQUFNLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUNyRCxNQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7S0FFTjs7QUFFRCxLQUFDLEVBQUUsQ0FBQTtJQUVIO0dBRUQ7RUFFRCxNQUFNLElBQUssT0FBTyxDQUFDLE9BQU8sSUFBSSxlQUFlLEVBQUc7O0FBRWhELFVBQVEsR0FBRyxNQUFNLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUUsQ0FBQyxRQUFRLENBQUE7O0FBRW5ELE1BQUssUUFBUSxJQUFJLElBQUksRUFBRzs7QUFFdkIsSUFBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFBOztBQUVyQixVQUFRLENBQUMsSUFBSSxDQUFDLEVBQUc7O0FBRWhCLFFBQUksUUFBUSxDQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFOztBQUV0QyxhQUFRLENBQUUsQ0FBQyxDQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUMzQixNQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7S0FFTjs7QUFFRCxLQUFDLEVBQUUsQ0FBQTtJQUVIO0dBRUQ7RUFFRCxNQUFNLElBQUssT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLEVBQUc7O0FBRXhDLFFBQU0sR0FBRyxFQUFFLENBQUE7RUFFWCxNQUFNLElBQUssT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLEVBQUc7O0FBRXhDLE1BQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtFQUViLE1BQU0sSUFBSyxPQUFPLENBQUMsT0FBTyxJQUFJLE1BQU0sRUFBRzs7QUFFdkMsTUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0VBRVgsTUFBTSxJQUFLLE9BQU8sQ0FBQyxPQUFPLElBQUksS0FBSyxFQUFHOztBQUV0QyxNQUFJLElBQUksSUFBSSxFQUFFLEVBQUU7QUFDZixPQUFJLENBQUMsV0FBVyxDQUFDLGlDQUEyQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDMUgsT0FBSSxDQUFDLFdBQVcsQ0FBQyxnQ0FBMEIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFFLEdBQUcsQ0FBQyxDQUFDO0dBQzNFO0VBRUQ7Q0FDRCxDQUFDOztBQUVGLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBTTs7QUFFakIsYUFBWSxDQUFFLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FBQTtDQUUvQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qICBzdGF0aWMgY29sbGlzaW9uIGRldGVjdGlvbiB3b3JrZXIgKi9cclxuXHJcbmxldCBkaXN0YW5jZTJkID0gKCBhLCBiICkgPT4ge1xyXG5cclxuICAgIHJldHVybiBNYXRoLnNxcnQoIE1hdGgucG93KCAoYVswXS1iWzBdKSwgMiApICsgTWF0aC5wb3coIChhWzJdLWJbMl0pLCAyICkgKVxyXG5cclxuICB9LFxyXG4gIGRpc3RhbmNlMmRDb21wYXJlID0gKCBhLCBiLCBuICkgPT4geyAvLyBtb3JlIGVmZmljaWVudCB2ZXJzaW9uIG9mIGRpc3RhbmNlMmQoKVxyXG5cclxuXHQgIHJldHVybiBNYXRoLnBvdyggKGFbMF0tYlswXSksIDIgKSArIE1hdGgucG93KCAoYVsyXS1iWzJdKSwgMiApIDwgKG4qbilcclxuXHJcbiAgfSxcclxuICBkaXN0YW5jZTNkQ29tcGFyZSA9ICggYSwgYiwgbiApID0+IHsgLy8gLi5mYXN0ZXIgdGhhbiB1c2luZyBNYXRoLnNxcnQoKVxyXG5cclxuXHQgIHJldHVybiAoTWF0aC5wb3coIChhWzBdLWJbMF0pLCAyICkgKyBNYXRoLnBvdyggKGFbMV0tYlsxXSksIDIgKSArIE1hdGgucG93KCAoYVsyXS1iWzJdKSwgMiApICkgPCAobipuKVxyXG5cclxuICB9XHJcblxyXG5sZXQgb2JzZXJ2ZXIgPSB7XHJcblx0XHRwb3NpdGlvbjogWzAsIDAsIDBdLFxyXG5cdFx0cHJldlBvczogWzAsIDAsIDBdLFxyXG5cdFx0dmVsb2NpdHk6IFswLCAwLCAwXSxcclxuXHRcdHZySGVpZ2h0OiAwXHJcblx0fSxcclxuXHR2b3hlbExpc3QgPSBbXSxcclxuXHR2b3hlbHMgPSBbXVxyXG5cclxuc2VsZi51cGRhdGUgPSAoICkgPT4ge1xyXG5cclxuXHR2YXIgZGlzdGFuY2UgPSAwLFxyXG5cdFx0b2JqUG9zID0gW10sXHJcblx0XHRwb3NpdGlvbiBcdCA9IG9ic2VydmVyLnBvc2l0aW9uLFxyXG5cdFx0aW5uZXJCb3ggXHQgPSBbZmFsc2UsIGZhbHNlXSxcclxuXHRcdHZlbG9jaXR5IFx0ID0gb2JzZXJ2ZXIudmVsb2NpdHksXHJcblx0XHR2ckhlaWdodCBcdCA9IG9ic2VydmVyLnZySGVpZ2h0LFxyXG5cdFx0Y2xvc2VUb1ZlbnVlID0gIGZhbHNlLFxyXG5cdFx0Y29sbGlzaW9uIFx0ID0gZmFsc2UsXHJcblx0XHRjS2V5IFx0XHQgPSBcIlwiLFxyXG5cdFx0eVBvcyBcdFx0ID0gMCxcclxuXHRcdHNpemUgXHRcdCA9IDUwMDAwLFxyXG5cdFx0b2JqIFx0XHQgPSBudWxsLFxyXG5cdFx0ZW50IFx0XHQgPSBudWxsLFxyXG5cdFx0c3RydWN0dXJlIFx0ID0gbnVsbCxcclxuXHRcdGJvdW5kcyBcdFx0ID0gWzAsIDBdLFxyXG5cdFx0dm94ZWwgXHRcdCA9IG51bGwsXHJcblx0XHRkZWx0YSBcdFx0ID0gWzAsIDBdLFxyXG5cdFx0b1BvcyBcdFx0ID0gW10sXHJcblx0XHRzcGVlZCBcdFx0ID0gMCxcclxuXHRcdGUgXHRcdFx0ID0gMCxcclxuXHRcdGkgXHRcdFx0ID0gMCxcclxuXHRcdHYgXHRcdFx0ID0gMFxyXG5cclxuXHRmb3IgKCBpID0gMDsgaSA8IHZveGVsTGlzdC5sZW5ndGg7IGkgKysgKSB7XHJcblxyXG5cdFx0b2JqID0gdm94ZWxMaXN0WyBpIF1cclxuXHRcdGlmICggISEhb2JqICkgY29udGludWVcclxuXHRcdGlmICggISFvYmogICYmIGRpc3RhbmNlMmRDb21wYXJlKCBwb3NpdGlvbiwgb2JqLnBvc2l0aW9uLCAyNTAwMDAwICkgKSB7IFx0Ly8gZG8gY29sbGlzaW9ucyBvbiB2b3hlbHMgJiBzdHJ1Y3R1cmVzLi4uIGp1c3Qgd2FsbHMgYXQgZmlyc3QuLlxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdGlmICggb2JqLmxvYWRlZCA9PSB1bmRlZmluZWQgKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0b2JqLmxvYWRlZCA9IHRydWVcclxuXHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKCd7XCJjb21tYW5kXCI6IFwibG9hZCBlbnRpdGllc1wiLCBcImRhdGFcIjp7XCJjb29yZHNcIjpcIicrb2JqLmNlbGxbMF0rJy4nK29iai5jZWxsWzFdKycuJytvYmouY2VsbFsyXSsnXCJ9fScpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBkaXN0YW5jZTJkQ29tcGFyZSggcG9zaXRpb24sIG9iai5wb3NpdGlvbiwgOTAwMDAwICkgKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRsZXQgYWx0ID0gb2JqLmFsdGl0dWRlIHx8IDBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR5UG9zID0gb2JqLnBvc2l0aW9uWzFdXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKCBkaXN0YW5jZTJkQ29tcGFyZSggcG9zaXRpb24sIG9iai5wb3NpdGlvbiwgNTI4MDAwICkgKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYgKCBwb3NpdGlvblsxXSA+IHlQb3MgLSAzMDAwMDAgKyB2ckhlaWdodCAgJiYgcG9zaXRpb25bMV0gPCB5UG9zICsgNDUyMDAwICsgdnJIZWlnaHQgKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRjb2xsaXNpb24gPSB0cnVlXHJcblx0XHRcdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoJ3tcImNvbW1hbmRcIjogXCJwbGF0Zm9ybSBjb2xsaXNpb25cIiwgXCJkYXRhXCI6e1widHlwZVwiOlwidG9wXCIsIFwicG9zaXRpb25cIjpbJyArIG9iai5wb3NpdGlvblswXSArICcsJyArICh5UG9zICkgKyAnLCcgKyBvYmoucG9zaXRpb25bMl0gKyAnXSB9fScpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCAhIW9iai5lbnRpdGllcyAmJiBvYmouZW50aXRpZXMubGVuZ3RoID4gMCApIHtcclxuXHJcblx0XHRcdFx0XHRcdGUgPSBvYmouZW50aXRpZXMubGVuZ3RoIC0gMVxyXG5cclxuXHRcdFx0XHRcdFx0d2hpbGUgKCBlID49IDAgKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGVudCA9IG9iai5lbnRpdGllc1sgZSBdXHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICggISEhIGVudCB8fCAhISFlbnQuY29tcG9uZW50cyApIHsgY29uc29sZS53YXJuKFwiUHJvYmxlbSB3aXRoIGVudGl0eSEgXCIsZSAsZW50KTsgY29udGludWUgfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIGRpc3RhbmNlM2RDb21wYXJlKCBwb3NpdGlvbiwgZW50LnBvc2l0aW9uLCAoZW50LmJvdW5kaW5nUmFkaXVzfHwxMDAwMDApKzEwMDAwKSApIHsgXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0ZW50LmNvbXBvbmVudHMubWFwKCBlbnRDb21wID0+IHtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggZGlzdGFuY2UzZENvbXBhcmUoIHBvc2l0aW9uLCBlbnRDb21wLnBvc2l0aW9uLCBlbnRDb21wLmJvdW5kaW5nUmFkaXVzIHx8IDI4MDAwKSApIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29sbGlzaW9uID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoICEhIGVudENvbXAucHJvcHMuZmxvb3IgKSB7IFxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoIEpTT04uc3RyaW5naWZ5KCB7Y29tbWFuZDogXCJmbG9vciBjb2xsaXNpb25cIiwgZGF0YTogeyBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGVudENvbXAucG9zaXRpb24sIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmbG9vckRhdGE6IGVudENvbXAucHJvcHMuZmxvb3JcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH19KSlcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzZWxmLnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSgge2NvbW1hbmQ6IFwiZW50aXR5LXVzZXIgY29sbGlzaW9uXCIsIGRhdGE6eyBwb3NpdGlvbjogZW50Q29tcC5wb3NpdGlvbiB9fSApIClcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0ZSAtLVxyXG5cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0aWYgKCAhY29sbGlzaW9uICkge1xyXG5cdFx0b2JzZXJ2ZXIucHJldlBvcyA9IFsgb2JzZXJ2ZXIucG9zaXRpb25bMF0sIG9ic2VydmVyLnBvc2l0aW9uWzFdLCBvYnNlcnZlci5wb3NpdGlvblsyXSBdXHJcblx0fVxyXG5cclxuXHRzZWxmLnBvc3RNZXNzYWdlKCd7XCJjb21tYW5kXCI6IFwidXBkYXRlXCJ9Jyk7XHJcblx0c2VsZi51cGRhdGVMb29wID0gc2V0VGltZW91dCggKCkgPT4ge1xyXG5cdFx0c2VsZi51cGRhdGUoKTtcclxuXHR9LCAxNSk7XHJcbn1cclxuXHJcbnNlbGYub25tZXNzYWdlID0gZnVuY3Rpb24gKCBldmVudCApIHsgXHJcblxyXG5cdHZhciBtZXNzYWdlICA9IEpTT04ucGFyc2UoIGV2ZW50LmRhdGEgKSxcclxuXHRcdGRhdGEgXHQgPSBtZXNzYWdlLmRhdGEsXHJcblx0XHR1c2VyIFx0ID0gb2JzZXJ2ZXIsXHJcblx0XHR2b3hlbCBcdCA9IG51bGwsXHJcblx0XHR0b1JlbW92ZSA9IG51bGwsXHJcblx0XHRpdGVtcyBcdCA9IFtdLFxyXG5cdFx0ZW50aXRpZXMgPSBbXSxcclxuXHRcdGMgXHRcdCA9IDAsXHJcblx0XHRwIFx0XHQgPSAwXHJcblx0XHRcclxuXHRpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcInVwZGF0ZVwiICkge1xyXG5cdFx0Ly8gdXNlci5wcmV2UG9zID0gW3VzZXIucG9zaXRpb25bMF0sIHVzZXIucG9zaXRpb25bMV0sIHVzZXIucG9zaXRpb25bMl1dO1xyXG5cdFx0dXNlci5wb3NpdGlvbiA9IGRhdGEucG9zaXRpb25cclxuXHRcdHVzZXIudmVsb2NpdHkgPSBkYXRhLnZlbG9jaXR5XHJcblx0XHR1c2VyLnZySGVpZ2h0ID0gZGF0YS52ckhlaWdodFxyXG5cdFx0Ly9zZWxmLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHNlbGYub2JzZXJ2ZXIpKTtcclxuXHR9IGVsc2UgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJhZGQgdm94ZWxzXCIgKSB7XHJcblxyXG5cdFx0dm94ZWxMaXN0ID0gdm94ZWxMaXN0LmNvbmNhdChkYXRhKVxyXG5cclxuXHRcdGRhdGEubWFwKCB2ID0+IHtcclxuXHRcdFx0dm94ZWxzWyB2LmNlbGwuam9pbihcIi5cIikgXSA9IHZcclxuXHRcdH0pXHJcblxyXG5cdH0gZWxzZSBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcInJlbW92ZSB2b3hlbHNcIiApIHtcclxuXHJcblx0XHRwID0gZGF0YS5sZW5ndGggLTFcclxuXHJcblx0XHR3aGlsZSAoIHAgPj0gMCApIHtcclxuXHJcblx0XHRcdHRvUmVtb3ZlID0gZGF0YVtwXVxyXG5cdFx0XHRjID0gdm94ZWxMaXN0Lmxlbmd0aC0xXHJcblxyXG5cdFx0XHR3aGlsZSAoIGMgPj0gMCApIHtcclxuXHJcblx0XHRcdFx0dm94ZWwgPSB2b3hlbExpc3RbIGMgXVxyXG5cclxuXHRcdFx0XHRpZiAoIHZveGVsICE9IG51bGwgJiYgdm94ZWwuY2VsbFswXSA9PSB0b1JlbW92ZS5jZWxsWzBdICYmIHZveGVsLmNlbGxbMV0gPT0gdG9SZW1vdmUuY2VsbFsxXSAgJiYgdm94ZWwuY2VsbFsyXSA9PSB0b1JlbW92ZS5jZWxsWzJdICkge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR2b3hlbExpc3Quc3BsaWNlKCBjLCAxIClcclxuXHRcdFx0XHRcdHZveGVsc1sgdm94ZWwuY2VsbC5qb2luKFwiLlwiKV0gPSBudWxsXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjLS1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHAgLS1cclxuXHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcImFkZCBlbnRpdHlcIiApIHtcclxuXHJcblx0XHRpZiAoISEhIHZveGVsc1tkYXRhLmNvb3Jkcy5qb2luKFwiLlwiKV0pXHJcblxyXG5cdFx0XHR2b3hlbHNbZGF0YS5jb29yZHMuam9pbihcIi5cIildID0geyBlbnRpdGllczogW10sIGNlbGw6IGRhdGEuY29vcmRzIH1cclxuXHJcblxyXG4gICAgXHRlbnRpdGllcyA9IHZveGVsc1tkYXRhLmNvb3Jkcy5qb2luKFwiLlwiKV0uZW50aXRpZXNcclxuXHJcbiAgICBcdGVudGl0aWVzLnB1c2goIGRhdGEuZW50aXR5IClcclxuXHJcbiAgfSBlbHNlIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwicmVtb3ZlIGVudGl0eVwiICkge1xyXG5cclxuICAgIFx0ZW50aXRpZXMgPSB2b3hlbHNbIGRhdGEuY29vcmRzLmpvaW4oXCIuXCIpIF0uZW50aXRpZXNcclxuXHJcblx0XHRpZiAoIGVudGl0aWVzICE9IG51bGwgKSB7XHJcblxyXG5cdFx0XHRjID0gZW50aXRpZXMubGVuZ3RoLTFcclxuXHJcblx0XHRcdHdoaWxlICggYyA+PSAwICkge1xyXG5cclxuXHRcdFx0XHRpZiAoIGVudGl0aWVzW2NdLmlkID09IGRhdGEuZW50aXR5SWQgKSB7XHJcblxyXG5cdFx0XHRcdFx0dm94ZWxzWyBkYXRhLmNvb3Jkcy5qb2luKFwiLlwiKSBdLmVudGl0aWVzLnNwbGljZShjLCAxKVxyXG5cdFx0XHRcdFx0YyA9IC0xXHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Yy0tXHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9IGVsc2UgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJ1cGRhdGUgZW50aXR5XCIgKSB7XHJcblxyXG5cdFx0ZW50aXRpZXMgPSB2b3hlbHNbIGRhdGEuY29vcmRzLmpvaW4oXCIuXCIpIF0uZW50aXRpZXNcclxuXHJcblx0XHRpZiAoIGVudGl0aWVzICE9IG51bGwgKSB7XHJcblxyXG5cdFx0XHRjID0gZW50aXRpZXMubGVuZ3RoLTFcclxuXHJcblx0XHRcdHdoaWxlICggYyA+PSAwICkge1xyXG5cclxuXHRcdFx0XHRpZiAoZW50aXRpZXNbIGMgXS5pZCA9PSBkYXRhLmVudGl0eUlkKSB7XHJcblxyXG5cdFx0XHRcdFx0ZW50aXRpZXNbIGMgXSA9IGRhdGEuZW50aXR5XHJcblx0XHRcdFx0XHRjID0gLTFcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjLS1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH0gZWxzZSBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcImNsZWFyXCIgKSB7XHJcblxyXG5cdFx0dm94ZWxzID0gW11cclxuXHJcblx0fSBlbHNlIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwic3RhcnRcIiApIHtcclxuXHJcblx0XHRzZWxmLnVwZGF0ZSgpXHJcblxyXG5cdH0gZWxzZSBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcInN0b3BcIiApIHtcclxuXHJcblx0XHRzZWxmLnN0b3AoKVxyXG5cclxuXHR9IGVsc2UgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJsb2dcIiApIHtcclxuXHJcblx0XHRpZiAoZGF0YSA9PSBcIlwiKSB7XHJcblx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoJ3tcImNvbW1hbmRcIjpcImxvZ1wiLFwiZGF0YVwiOlsnICsgdXNlci5wb3NpdGlvblswXSArICcsJyArIHVzZXIucG9zaXRpb25bMV0gKyAnLCcgKyB1c2VyLnBvc2l0aW9uWzJdICsgJ119Jyk7XHJcblx0XHRcdHNlbGYucG9zdE1lc3NhZ2UoJ3tcImNvbW1hbmRcIjpcImxvZ1wiLFwiZGF0YVwiOicgKyBKU09OLnN0cmluZ2lmeSh2b3hlbHMpKyAnfScpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn07XHJcblxyXG5zZWxmLnN0b3AgPSAoKSA9PiB7XHJcblxyXG5cdGNsZWFyVGltZW91dCggc2VsZi51cGRhdGVMb29wIClcclxuXHJcbn1cclxuIl19
