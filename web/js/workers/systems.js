(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* generic system worker */
"use strict";

self.onmessage = function (event) {

  var message = JSON.parse(event.data),
      data = message.data;

  if (message.command == "") {}
};

self.stop = function () {

  clearTimeout(self.updateLoop);
};

// implement

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL1VzZXJzL29wZW5zL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIkM6L0NvZGUvc3JjL2dpdGh1Yi5jb20vY29udm9sdnIvY29udm9sdnIvY2xpZW50L3NyYy9qcy93b3JrZXJzL3N5c3RlbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQUEsS0FBSyxFQUFJOztBQUV6QixNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7TUFDekIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7O0FBRTdCLE1BQUssT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUcsRUFHNUI7Q0FFRixDQUFDOztBQUVGLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBTTs7QUFFZCxjQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0NBRWhDLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2VuZXJpYyBzeXN0ZW0gd29ya2VyICovXHJcbnNlbGYub25tZXNzYWdlID0gZXZlbnQgPT4ge1xyXG5cclxuXHRsZXQgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSksXHJcbiAgICAgICAgICAgIGRhdGEgPSBtZXNzYWdlLmRhdGFcclxuICAgICAgICAgICAgXHJcbiAgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJcIiApIHtcclxuICAgIC8vIGltcGxlbWVudFxyXG5cclxuICB9XHJcblxyXG59O1xyXG5cclxuc2VsZi5zdG9wID0gKCkgPT4ge1xyXG5cclxuICAgIGNsZWFyVGltZW91dChzZWxmLnVwZGF0ZUxvb3ApXHJcbiAgICBcclxufVxyXG4iXX0=
