
<script>
import { onDestroy } from "svelte"
import * as cookie from 'cookie';
import PartySocket from "partysocket";
import {PUBLIC_PARTYKIT_HOST} from '$env/static/public';

export let data;
console.log(data);

let pingInterval;
let connection;
let log=[];
let nameInput;
let socketState = "Starting closed"

if(data.userid){
  nameInput = data.userid.split('::')[0];
}
const timeFormat = (d) =>`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

function add(msg){  
  let time = timeFormat(new Date());
  log.unshift({time, data:msg});
  log = log;
}

function connect(){
  clearInterval(pingInterval);
  let uuid = crypto.randomUUID();
  let userid = `${nameInput}::${uuid}`;
  if(data.userid){
    userid = data.userid;
  }

  document.cookie = cookie.serialize('userid', userid, {SameSite:true});
  connection = new PartySocket({
    host: PUBLIC_PARTYKIT_HOST,
    room: data.room,
    id: userid
  });

  connection.addEventListener("message", function (event) {
    console.log(JSON.parse(event.data))
//    add(JSON.parse(event.data) );
  });

  connection.addEventListener("open", function () {
    add("Connected!");
    add("Sending a ping every 2 seconds...");
    socketState = "open";
    clearInterval(pingInterval);
    pingInterval = setInterval(function () {
      connection.send(JSON.stringify({msg:'ping'}));
    }, 2000);
  });

  connection.addEventListener("close", function(){
    socketState = "closed";
  })
}

function pause(){
  clearInterval(pingInterval);
}

onDestroy(()=>{
  clearInterval(pingInterval);
});

</script>
<p>Partykit host server: {PUBLIC_PARTYKIT_HOST} (<em>PUBLIC_PARTYKIT_HOST</em>)</p>
{#if nameInput && socketState != 'open'}
  {#if socketState == "open"}
  <button on:click={pause}>Pause</button>
  {:else}
  <button on:click={connect}>Connect as <strong>{nameInput}</strong></button>
  {/if}
{:else}
  Type your name
{/if}
Name <input type="text" bind:value={nameInput}>
{socketState}
<h2>Connection log for the current session</h2>
<pre>
  {JSON.stringify(log, null, 1)}
</pre>

<style>
  pre{
    height: 70vh;
    overflow-y: scroll;
    background-color: black;
    color: rgb(106, 212, 106);
  }
</style>