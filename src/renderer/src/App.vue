<script setup>
import { useRoute } from "vue-router";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
const router = useRoute();
</script>

<template>
  <div class="window">
    <div class="main-container">
      <Header />
      <router-view />
      <Footer />
      <img class="filter" src="./assets/halftone3.png" />
    </div>
  </div>
</template>

<style>
.window {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.main-container {
  position: relative;
  user-select: none;
  background-color: #ffe5b8;
  height: 95%;
  width: 95%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  border-radius: 3px 3px 10px 10px;
  overflow: hidden;
  box-shadow: 0 2px 3px 0px rgba(0, 0, 0, 0.5);
}

.filter {
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0.2;
  pointer-events: none;
  z-index:2;
}
</style>
