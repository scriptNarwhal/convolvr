/* generic system worker */
self.onmessage = event => {

	let message = JSON.parse(event.data),
            data = message.data
            
  if ( message.command == "" ) {
    // implement

  }

};

self.stop = () => {

    clearTimeout(self.updateLoop)
    
}
