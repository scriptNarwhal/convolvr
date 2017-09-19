(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* generic system worker */
"use strict";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Db2RlL3NyYy9naXRodWIuY29tL2NvbnZvbHZyL2NvbnZvbHZyL2NsaWVudC9zcmMvanMvd29ya2Vycy9zeXN0ZW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFBLEtBQUssRUFBSTs7QUFFekIsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO01BQ3pCLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFBOztBQUU3QixNQUFLLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxFQUFHOzs7R0FHNUI7Q0FFRixDQUFDOztBQUVGLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBTTs7QUFFZCxjQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0NBRWhDLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2VuZXJpYyBzeXN0ZW0gd29ya2VyICovXHJcbnNlbGYub25tZXNzYWdlID0gZXZlbnQgPT4ge1xyXG5cclxuXHRsZXQgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSksXHJcbiAgICAgICAgICAgIGRhdGEgPSBtZXNzYWdlLmRhdGFcclxuICAgICAgICAgICAgXHJcbiAgaWYgKCBtZXNzYWdlLmNvbW1hbmQgPT0gXCJcIiApIHtcclxuICAgIC8vIGltcGxlbWVudFxyXG5cclxuICB9XHJcblxyXG59O1xyXG5cclxuc2VsZi5zdG9wID0gKCkgPT4ge1xyXG5cclxuICAgIGNsZWFyVGltZW91dChzZWxmLnVwZGF0ZUxvb3ApXHJcbiAgICBcclxufVxyXG4iXX0=
