<template>
  <div class="message">
    <p>{{from}}</p>
    <hr>
    <p>{{message}}</p>
    <p>{{timestamp.toTimeString().split(' ')[0]}}</p>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    from: String,
    message: String,
    timestamp: String
  }
}
</script>

<style scoped>
.message {
  font-size: .8em;
  width: fit-content;
  background-color: cadetblue;
  padding: .3em 2em;
  border-radius: 2em;
  min-width: 15em;
}

.message > hr {
  margin-top: 0;
  margin-bottom: 0;
}

.message > p:nth-child(1) {
  font-size: 1em;
  font-weight: bold;
  padding: 0;
  margin-bottom: 0;
}

.message > p:nth-child(4) {
  font-weight: lighter;
  font-size: 0.7em;
  float: right;
}


</style>
