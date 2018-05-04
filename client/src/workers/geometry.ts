/* geometry worker */
self.onmessage = function (event) { // Do some work.
	let message = JSON.parse(event.data),
			data = message.data
  if (message.command == "generate structure") {
    // implement

    // return typed arrays of vertices
  }
};

self.stop = function () {
	clearTimeout(((self as any).updateLoop));
};
