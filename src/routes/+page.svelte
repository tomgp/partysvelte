
<script>
import { browser } from '$app/environment';
import PartySocket from "partysocket";
import {PUBLIC_PARTYKIT_HOST} from '$env/static/public';

let pingInterval;
let conn;
let log=[];

const timeFormat = (d) =>`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

function add(msg){
  console.log(msg);
  log.unshift(`${timeFormat(new Date())} ${msg}`);
  log=log;
}
if(browser){
  clearInterval(pingInterval)
  conn = new PartySocket({
    host: PUBLIC_PARTYKIT_HOST,
    room: "my-new-room",
  });
}

if(conn){
  conn.addEventListener("message", function (event) {
    add(`Received -> ${event.data}`);
  });

  conn.addEventListener("open", function () {
    add("Connected!");
    add("Sending a ping every 2 seconds...");
    
    clearInterval(pingInterval);
    pingInterval = setInterval(function () {
      conn.send("ping");
    }, 2000);
  });
}


</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{PUBLIC_PARTYKIT_HOST}
<pre>
  {JSON.stringify(log, null, 1)}
</pre>