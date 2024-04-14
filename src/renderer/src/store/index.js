import { defineStore } from "pinia";
import { ref } from 'vue';

export const useChatList = defineStore('chatList', () => {
    const chatLists = ref(new Map());
    const userLists = ref(new Map());
    const messageLists = ref([]);

    userLists.value.set('大厅', {
        name: '大厅',
        count: 0,
        online: true
    })
    const menuSelect = ref('大厅');
    chatLists.value.set('大厅', []);

    function clearData() {
        chatLists.value.clear();
        chatLists.value.set('大厅', []);
        userLists.value = new Map();
        userLists.value.set('大厅', {
            name: '大厅',
            count: 0,
            online: true
        })
        menuSelect.value = '大厅';
        messageLists.value = [];
    }

    function addChats(sender, chats) {
        if (chatLists.value.has(sender)) {
            chatLists.value.get(sender).push(chats);
        } else {
            chatLists.value.set(sender, [chats]);
        }
        if (menuSelect.value !== sender) {
            const item = userLists.value.get(sender);
            item.count = item.count + 1;
        }
    }

    function setMenu(menu) {
        menuSelect.value = menu;
        const item = userLists.value.get(menu);
        item.count = 0;
    }

    function getChats() {
        if (!chatLists.value.has(menuSelect.value)) {
            chatLists.value.set(menuSelect.value, []);
        }
        return chatLists.value.get(menuSelect.value);
    }

    function userLogin(user) {
        // console.log('userLogin:', user)
        messageLists.value.push(user.split('-')[0] + '进入服务器');
        if (!userLists.value.has(user)) {
            userLists.value.set(user, {
                name: user,
                count: 0,
                online: true
            })
        }
    }

    function initUserList(list) {
        console.log('initUserList')
        for (let item of list) {
            userLists.value.set(item, {
                name: item,
                count: 0,
                online: true
            })
            console.log('test', item)
        }
    }

    function getUserList() {
        return Array.from(userLists.value.values());
    }

    function getMessageList() {
        return messageLists.value;
    }

    function userLogout(username) {
        if (userLists.value.has(username)) {
            const item = userLists.value.get(username);
            item.online = false;
            messageLists.value.push(username.split('-')[0] + '离开服务器');

        } else {
            console.error('用户名存储错误');
        }
    }

    return { getMessageList, clearData, addChats, getChats, menuSelect, setMenu, userLists, initUserList, userLogout, userLogin, getUserList }
})

export const useStore = defineStore('Room', {
    state: () => ({
        userName: '',
        randomCode: 0,
        serverAddress: '',
    }),
    actions: {
        setName(name) {
            this.userName = name;
            this.randomCode = Math.floor(Math.random() * 1000);
        },
        getUniqueName() {
            return this.userName + '-' + this.randomCode;
        },
        setServerAddr(data) {
            this.serverAddress = data;
        },
        clearData() {
            this.userName = '';
            this.randomCode = 0;
            this.serverAddress = '';
        }
    }
})

