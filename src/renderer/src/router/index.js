import {createRouter,createWebHashHistory} from 'vue-router'

//存储路径
const routes=[
    {
        path:'/',
        name:'entry',
        component: ()=>import('../components/Entry.vue')
    },
    {
        path:'/home',
        name:'home',
        component: ()=>import('../components/Home.vue')
    }
]

//创建路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router