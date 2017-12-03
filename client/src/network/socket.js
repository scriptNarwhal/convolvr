import EventEmitter from 'events'
export let events = new EventEmitter()

let socket = new WebSocket((window.location.href.indexOf("https") > -1 ? 'wss:' : 'ws:')+"//"+(location.host+"/connect"))
// Connect to our server: go server
socket.binaryType = "arraybuffer"; // We are talking binary
export let connected = false
socket.onopen = () => {
  connected = true
}
socket.onclose = () => {
  connected = false
}
socket.onmessage = function(evt) {
  let data = JSON.parse(evt.data)
  events.emit(data.type, data)
}
export let send = (type,data) => {
  if (!connected) {
    return;
  }
  let packet = {
    type: type,
    data: JSON.stringify(data),
  }
  socket.send(JSON.stringify(packet))
}
