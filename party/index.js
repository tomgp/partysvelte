class PartyServer {
  constructor(room) {
    this.room = room;
  }

  onConnect(conn, ctx) {
    // A websocket just connected!
    let details = {
      id: conn.id,
      room: this.room.id,
      url: new URL(ctx.request.url).pathname
    }
    console.log('CONNECTION', JSON.stringify(details, null,' '))

    // Send a message to the connection
    conn.send(JSON.stringify({message:`hello from ${this.room.id}`}));
  }

  onMessage(message, sender) {
    console.log(`connection ${sender.id} sent message: ${message} room:${this.room.id}`);
    // Broadcast the received message to all other connections in the room except the sender
    let messageObject = JSON.parse(message)
    this.room.broadcast(JSON.stringify({
      sender:sender.id,
      message:messageObject,
      room:this.room.id
    }));
  }
}

export default PartyServer;