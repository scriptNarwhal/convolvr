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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd29ya2Vycy9zeXN0ZW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBLEtBQUssU0FBTCxHQUFpQixpQkFBUzs7QUFFekIsTUFBSSxVQUFVLEtBQUssS0FBTCxDQUFXLE1BQU0sSUFBakIsQ0FBZDtBQUFBLE1BQ1csT0FBTyxRQUFRLElBRDFCOztBQUdDLE1BQUssUUFBUSxPQUFSLElBQW1CLEVBQXhCLEVBQTZCO0FBQzNCOztBQUVEO0FBRUYsQ0FWRDs7QUFZQSxLQUFLLElBQUwsR0FBWSxZQUFNOztBQUVkLGVBQWEsS0FBSyxVQUFsQjtBQUVILENBSkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2VuZXJpYyBzeXN0ZW0gd29ya2VyICovXG5zZWxmLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcblxuXHRsZXQgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSksXG4gICAgICAgICAgICBkYXRhID0gbWVzc2FnZS5kYXRhXG4gICAgICAgICAgICBcbiAgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJcIiApIHtcbiAgICAvLyBpbXBsZW1lbnRcblxuICB9XG5cbn07XG5cbnNlbGYuc3RvcCA9ICgpID0+IHtcblxuICAgIGNsZWFyVGltZW91dChzZWxmLnVwZGF0ZUxvb3ApXG4gICAgXG59XG4iXX0=
