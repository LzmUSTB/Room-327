<script setup>
import { useChatList } from "../store";
import { computed } from "vue";

const chatList = useChatList();
const userList = computed(() => chatList.getUserList());
const messageList = computed(() => chatList.getMessageList());
const handleMenuSelect = (key) => {
  chatList.setMenu(key);
};
</script>

<template>
  <div class="leftside-container">
    <div class="userlist-container">
      <div
        v-for="item in userList"
        @click="handleMenuSelect(item.name)"
        class="list-item"
      >
        {{
          item.name === chatList.menuSelect
            ? "> " + item.name.split("-")[0]
            : item.name.split("-")[0]
        }}
        <span v-show="item.count" class="msg-count">{{ item.count }}</span>
      </div>
    </div>
    <!-- <div class="message-window">
      <div v-for="item in messageList">{{ "● " + item }}</div>
    </div> -->
  </div>
</template>

<style scoped>
.leftside-container {
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: hidden;
  margin-left: 10px;
  width: 160px;
  height: 100%;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background-color: #FAC3B588;
}

::-webkit-scrollbar-thumb {
  background-color: #FAC3B5;
  border-radius: 0;
}

.message-window {
  height: 80px;
  /* border: 2px solid #7e5040; */
  margin-top: 5px;
  font-size: 10px;
  color: #7e5040;
  padding: 5px 0 5px 10px;
  background-color: #ffe5b8;
  /* box-shadow: 5px 0 0 0 #7e5040 inset; */
  overflow-y: auto;
}

.userlist-container {
  display: flex;
  flex-direction: column;
  padding: 5px;
  border: 2px solid #f5876c;
  overflow-y: auto;
  background-color: #f5876c;
  font-weight: 600;
  color: #ffe5b8;
}

.list-item {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.msg-count {
  font-weight: 100;
  border-radius: 4px;
  border: 1px solid;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.list-item:hover {
}

.list-item-selected {
}
</style>
