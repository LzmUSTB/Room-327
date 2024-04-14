<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from "vue";
import { useChatList, useStore } from "../store";

const chatList = useChatList();
const chatLists = computed(() => chatList.getChats());
const store = useStore();
const message = ref("");
const autoScroll = ref(null);

const ws = new WebSocket(
  "ws://" + store.serverAddress + "/" + store.getUniqueName() + "/"
);

onBeforeUnmount(() => {
  // const msg = {
  //   type: 1,
  //   content: "logout",
  //   sender: store.getUniqueName(),
  //   receiver: 0,
  //   key: Date.now(),
  // };
  // ws.send(JSON.stringify(msg));
  // console.log('发送消息')
  ws.close();
});

ws.addEventListener("message", (e) => {
  const data = JSON.parse(e.data);
  console.log(chatList.getUserList());
  const { type, content, sender, receiver, key } = data;
  console.log(type, content);
  if (type === 0) {
    chatList.userLogin(sender);
  } else if (type === 1) {
    chatList.userLogout(sender);
  } else if (type === 2) {
    if (sender === store.getUniqueName()) {
      return;
    }
    if (receiver === "大厅") {
      chatList.addChats("大厅", data);
    } else {
      chatList.addChats(sender, data);
    }
  } else if (type === 3) {
    chatList.initUserList(content);
  }
});

ws.addEventListener("open", () => {
  console.log("用户:" + store.getUniqueName() + " 登录");
  const msg = {
    type: 0,
    content: "login",
    sender: store.getUniqueName(),
    receiver: 0,
    key: Date.now(),
  };
  ws.send(JSON.stringify(msg));
});

ws.addEventListener("close", () => {
  const msg = {
    type: 1,
    content: "logout",
    sender: store.getUniqueName(),
    receiver: 0,
    key: Date.now(),
  };
  console.log("发送离线通知", msg);
  ws.send(JSON.stringify(msg));
});

ws.addEventListener("error", () => {
  console.log("连接超时");
});

const handleSendMsg = () => {
  if (message.value) {
    const msg = {
      type: 2,
      sender: store.getUniqueName(),
      receiver: chatList.menuSelect,
      content: message.value,
      key: Date.now(),
    };

    chatList.addChats(chatList.menuSelect, msg);

    ws.send(JSON.stringify(msg));

    message.value = "";

    nextTick(() => {
      let scrollElem = autoScroll.value;
      scrollElem.scrollTo({ top: scrollElem.scrollHeight, behavior: "instant" });
    });
  }
};
</script>

<template>
  <div class="chatwindow-container">
    <div class="chat-window" ref="autoScroll">
      <div v-for="item in chatLists" :key="item.key" class="chat-subcontainer">
        <div v-if="item.sender === store.getUniqueName()" class="chat-send">
          {{ item.content }}
        </div>
        <div v-else class="chat-receive-container">
          <div class="chat-name">{{ item.sender.split("-")[0] }}</div>
          <div class="chat-receive">{{ item.content }}</div>
        </div>
      </div>
    </div>
    <div class="msg-editer">
      <div class="editer-container">
        <div class="editer-block">●</div>
        <textarea
          @keyup.enter="handleSendMsg"
          v-model="message"
          class="text-area"
          spellcheck="false"
        />
      </div>
      <div class="msg-button" @click="handleSendMsg">send</div>
    </div>
  </div>
</template>

<style scoped>
.chatwindow-container {
  height: 100%;
  z-index: 5;
  margin: 0 10px 0 5px;
  border: 2px solid;
  display: grid;
  overflow: hidden;
  backdrop-filter: blur(0.8px);
  grid-template-rows: 1fr auto;
}

.editer-container {
  display: grid;
  grid-template-columns: auto 1fr;
}

.editer-block {
  width: 10px;
  margin: 5px;
  color: #ffe5b8;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #7e5040;
}

.chat-window {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
}

.chat-receive-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.chat-receive {
  margin: 0 8px 8px 8px;
  font-size: 12px;
  border: 2px solid #7e5040;
  border-radius: 0 50px 50px 50px;
  background-color: #7e5040;
  padding: 5px 10px;
  color: white;
  box-shadow: -3px 3px 0 0 #d3b485aa;
}

.chat-subcontainer {
  display: flex;
  flex-direction: column;
}

.chat-name {
  font-size: 12px;
  padding-left: 5px;
  font-weight: 600;
}

.chat-receive-container {
  align-self: flex-start;
}

.chat-send {
  margin: 8px;
  font-size: 12px;
  padding: 5px 10px;
  border: 2px solid #7e5040;
  border-radius: 50px 50px 0 50px;
  box-shadow: 3px 3px 0 0 #d3b485aa;
  align-self: flex-end;
}

.msg-editer {
  border-top: 1px solid;
  width: 100%;
  height: 80px;
  display: grid;
  background-color: #e2d3aa88;
  grid-template-rows: 2fr 1fr;
  position: relative;
}

.msg-button {
  padding: 0 5px;
  margin: 0 5px 5px 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  justify-self: end;
  color: #ffe5b8;
  background-color: #7e5040;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-area {
  background: none;
  color: #7e5040;
  font-family: "consolas";
  border: none;
  padding: 5px 0;
  resize: none;
  /* background-color: rgba(255, 255, 255, 0.1); */
  /* backdrop-filter: blur(1px); */
}
</style>
