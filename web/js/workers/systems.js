(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* generic system worker */
self.onmessage = function (event) {

  var message = JSON.parse(event.data),
      data = message.data;

  if (message.command == "") {
    // implement

  }
};

self.stop = function () {

  clearTimeout(self.updateLoop);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHdvcmtlcnNcXHN5c3RlbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsS0FBSyxTQUFMLEdBQWlCLGlCQUFTOztBQUV6QixNQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsTUFBTSxJQUFqQixDQUFkO0FBQUEsTUFDVyxPQUFPLFFBQVEsSUFEMUI7O0FBR0MsTUFBSyxRQUFRLE9BQVIsSUFBbUIsRUFBeEIsRUFBNkI7QUFDM0I7O0FBRUQ7QUFFRixDQVZEOztBQVlBLEtBQUssSUFBTCxHQUFZLFlBQU07O0FBRWQsZUFBYSxLQUFLLFVBQWxCO0FBRUgsQ0FKRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnZW5lcmljIHN5c3RlbSB3b3JrZXIgKi9cbnNlbGYub25tZXNzYWdlID0gZXZlbnQgPT4ge1xuXG5cdGxldCBtZXNzYWdlID0gSlNPTi5wYXJzZShldmVudC5kYXRhKSxcbiAgICAgICAgICAgIGRhdGEgPSBtZXNzYWdlLmRhdGFcbiAgICAgICAgICAgIFxuICBpZiAoIG1lc3NhZ2UuY29tbWFuZCA9PSBcIlwiICkge1xuICAgIC8vIGltcGxlbWVudFxuXG4gIH1cblxufTtcblxuc2VsZi5zdG9wID0gKCkgPT4ge1xuXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudXBkYXRlTG9vcClcbiAgICBcbn1cbiJdfQ==
