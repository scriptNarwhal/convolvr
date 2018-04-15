/* generic system worker */
let sw = (self as any);

sw.onmessage = (event: any) => {

	let message = JSON.parse(event.data),
            data = message.data
            
  if ( message.command == "" ) {
    // implement

  }

};

sw.stop = () => {

    clearTimeout(sw.updateLoop)
    
}
