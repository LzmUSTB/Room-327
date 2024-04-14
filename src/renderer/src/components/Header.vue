<template>
  <!-- <div class="loading">
    <div class="tip-window">
      <div>连接中</div>
      <Loading />
    </div>
  </div> -->
  <div class="header-container">
    <div class="flex-start-container">
      <div class="name plate">{{ showName == "" ? "" : showName }}</div>
      <div v-if="store.userName" class="normal plate" @click="handleLogout">LogOut</div>
    </div>
    <div class="flex-end-container">
      <div class="normal plate">Doc</div>
      <div class="quit plate" @click="closeWindow">Quit</div>
    </div>
  </div>
</template>

<script setup>
import { useStore, useChatList } from "../store";
import { computed } from "vue";
import Loading from "./Loading.vue";
import { useRouter } from "vue-router";
const store = useStore();
const chatList = useChatList();
const router = useRouter();
const showName = computed(() => store.userName);
const closeWindow = () => {
  window.electron.ipcRenderer.send("handle-quit");
};
const handleLogout = () => {
  chatList.clearData();
  store.clearData();
  window.electron.ipcRenderer.send("handle-logout");
  router.push("/");
};
</script>

<style scoped>
.tip-window {
  background-color: #fff;
  height: 200px;
  width: 350px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  justify-content: center;
}

.loading {
  backdrop-filter: blur(4px);
  z-index: 99;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  font-weight: 600;
  transition: 300ms;
  opacity: 1;
}

.flex-end-container {
  display: flex;
}

.flex-start-container {
  display: flex;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  padding: 0 10px 0 10px;
}

.quit {
  cursor: pointer;
  -webkit-app-region: no-drag;
  background-color: #ea6a4d;
  font-weight: 600;
  color: #ffe5b8;
}

.plate {
  margin: 0 0 5px 10px;
  padding: 0 5px;
  border-radius: 0 0 3px 3px;
  font-weight: 600;
  color: #ffe5b8;
}

.normal {
  -webkit-app-region: no-drag;
  cursor: pointer;
  background-color: #8d7a74;
}

.name {
  background-color: #7e5040;
}
</style>
