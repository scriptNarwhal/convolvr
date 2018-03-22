(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd29ya2Vycy9zeXN0ZW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBLEtBQUssU0FBTCxHQUFpQixpQkFBUzs7QUFFekIsTUFBSSxVQUFVLEtBQUssS0FBTCxDQUFXLE1BQU0sSUFBakIsQ0FBZDtBQUFBLE1BQ1csT0FBTyxRQUFRLElBRDFCOztBQUdDLE1BQUssUUFBUSxPQUFSLElBQW1CLEVBQXhCLEVBQTZCO0FBQzNCOztBQUVEO0FBRUYsQ0FWRDs7QUFZQSxLQUFLLElBQUwsR0FBWSxZQUFNOztBQUVkLGVBQWEsS0FBSyxVQUFsQjtBQUVILENBSkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIi8qIGdlbmVyaWMgc3lzdGVtIHdvcmtlciAqL1xyXG5zZWxmLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcclxuXHJcblx0bGV0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLFxyXG4gICAgICAgICAgICBkYXRhID0gbWVzc2FnZS5kYXRhXHJcbiAgICAgICAgICAgIFxyXG4gIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwiXCIgKSB7XHJcbiAgICAvLyBpbXBsZW1lbnRcclxuXHJcbiAgfVxyXG5cclxufTtcclxuXHJcbnNlbGYuc3RvcCA9ICgpID0+IHtcclxuXHJcbiAgICBjbGVhclRpbWVvdXQoc2VsZi51cGRhdGVMb29wKVxyXG4gICAgXHJcbn1cclxuIl19
