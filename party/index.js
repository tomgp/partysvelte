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
    conn.send("hello from server");
  }

  onMessage(message, sender) {
    console.log(`connection ${sender.id} sent message: ${message}`);
    // Broadcast the received message to all other connections in the room except the sender
    this.room.broadcast(`${sender.id}: ${message}`, [sender.id]);
  }
}

export default PartyServer;