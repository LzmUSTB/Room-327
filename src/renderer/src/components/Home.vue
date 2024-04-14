<script setup>
import ChatWindow from "./ChatWindow.vue";
import UserList from "./UserList.vue";

</script>

<template>
  <div class="home-container">
    <UserList />
    <ChatWindow />
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>
