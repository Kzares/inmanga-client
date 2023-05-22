<script setup >
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import ToggleMenu from './components/ToggleMenu.vue'
  
//vuex store
const store = useStore()
const commit = store.commit

onBeforeMount(() => {
  commit('LOAD_USER')
  commit('LOAD_ADMIN')
})

</script>
  
<template>

  <div class="main">
    <ToggleMenu/>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;

}
.main {
  background: #eee;
}
.container {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  padding-top: 3rem;
  padding: 1rem;
}
.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}
.enphasis{
  text-decoration: underline;
  font-weight: 600;
}
.link-light {
  color: #fff;
}
@media (max-width: 870px){
  html {
    font-size: 90%;
  }
}
@media (max-width: 500px){
  .container {
    padding: .5rem;
  }
  html {
    font-size: 80%;
  }
}
</style>


