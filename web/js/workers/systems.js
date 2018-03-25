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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL1VzZXJzL29wZW5zL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyY1xcd29ya2Vyc1xcc3lzdGVtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQSxLQUFLLFNBQUwsR0FBaUIsaUJBQVM7O0FBRXpCLE1BQUksVUFBVSxLQUFLLEtBQUwsQ0FBVyxNQUFNLElBQWpCLENBQWQ7QUFBQSxNQUNXLE9BQU8sUUFBUSxJQUQxQjs7QUFHQyxNQUFLLFFBQVEsT0FBUixJQUFtQixFQUF4QixFQUE2QjtBQUMzQjs7QUFFRDtBQUVGLENBVkQ7O0FBWUEsS0FBSyxJQUFMLEdBQVksWUFBTTs7QUFFZCxlQUFhLEtBQUssVUFBbEI7QUFFSCxDQUpEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdlbmVyaWMgc3lzdGVtIHdvcmtlciAqL1xyXG5zZWxmLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcclxuXHJcblx0bGV0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLFxyXG4gICAgICAgICAgICBkYXRhID0gbWVzc2FnZS5kYXRhXHJcbiAgICAgICAgICAgIFxyXG4gIGlmICggbWVzc2FnZS5jb21tYW5kID09IFwiXCIgKSB7XHJcbiAgICAvLyBpbXBsZW1lbnRcclxuXHJcbiAgfVxyXG5cclxufTtcclxuXHJcbnNlbGYuc3RvcCA9ICgpID0+IHtcclxuXHJcbiAgICBjbGVhclRpbWVvdXQoc2VsZi51cGRhdGVMb29wKVxyXG4gICAgXHJcbn1cclxuIl19
