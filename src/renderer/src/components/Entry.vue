<script setup>
import { useStore } from "../store";
import { useRouter } from "vue-router";
import { ref } from "vue";
const store = useStore();
const nameInput = ref("");
const router = useRouter();
const ipConfig = ref("");
const hostOrGuest = ref(true);
const handleEnter = () => {
  if (nameInput.value && ipConfig.value) {
    store.setName(nameInput.value);
    if (hostOrGuest.value) {
      store.setServerAddr("localhost:" + ipConfig.value);
      window.electron.ipcRenderer.send("enter-chatroom", ipConfig.value);
    } else {
      store.setServerAddr(ipConfig.value);
    }
    router.push("/home");
  }
};
</script>

<template>
  <div class="container">
    <div class="entry-container">
      <img class="logo" src="../assets/logo3.svg" />
      <div
        style="width:120px"
        :class="hostOrGuest ? 'button-reverse button' : 'button'"
        @click="
          () => {
            hostOrGuest = !hostOrGuest;
          }
        "
      >
        {{ hostOrGuest ? "HOST" : "GUEST" }}
      </div>
      <div class="sub-container">
        <div>Name:</div>
        <input spellcheck="false" v-model="nameInput" class="input" />
        <div>
          {{ hostOrGuest ? "Port:" : "Address:" }}
        </div>
        <input spellcheck="false" v-model="ipConfig" class="input" />
      </div>
      <div class="button-container">
        <div @click="handleEnter" class="button">Start</div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.sub-container {
  padding: 0 10px;
  width: 55%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  border-radius: 10px;
  /* justify-items:end; */
  align-items:center;
  /* box-shadow: -2px -2px 0 3px #fff, 2px 2px 0 3px #fff; */
}

.sub-container div {
  margin: 10px 0;
}

.button-container {
  display: flex;
}

.button {
  cursor: pointer;
  border: 2px solid #7e5040;
  margin: 3px;
  padding: 0 5px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-reverse {
  color: #ffe5b8;
  background-color: #7e5040;
}

.sub-container-dvd {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.container {
  background-color: #ffe5b8;
  display: grid;
  margin: 0 10px;
}

.entry-container {
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.logo {
  width: 60%;
  -webkit-user-drag: none;
}

.input {
  color: #7e5040;
  border: 0;
  height: 20px;
  padding-left: 5px;
  font-size: 16px;
  background: none;
  border-bottom: 2px solid #7e5040;
}
</style>
