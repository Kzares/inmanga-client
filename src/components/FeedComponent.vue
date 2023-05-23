<script setup>
import MangaCard from './MangaCard.vue';
import SearchBar from './SearchBar.vue'
import LoadingComponent from './LoadingComponent'
import { reactive, onBeforeMount } from 'vue'
import axios from 'axios'

//reactive variables
const mangas = reactive({
  popular: [],
  rated: [],
})

//triggers function before mounts
onBeforeMount(() => {
  getTopRatedMangas()
  getMostPopularMangas()
})


//methods 
const getTopRatedMangas = async () => {
  await axios.get(`https://bakteria.online:5000:5000/api/mangas/top-rated`)
    .then((response) => mangas.rated = response.data)

}

const getMostPopularMangas = async () => {
  await axios.get(`https://bakteria.online:5000:5000/api/mangas/most-popular`)
    .then((response) => mangas.popular = response.data)

}
</script>

<template>
  <div class="feed container">

    <SearchBar :admin="false" />

    <div class="blog-card-wrap">
      <div class="container">
        <h3>Most Popular Mangas <router-link class="router-link" to="/category/most-popular"> View More</router-link> </h3>

        <div class="manga-cards" v-if="mangas.popular.length > 0">
          <MangaCard v-for=" (manga, idx) in mangas.popular" :key="idx" :manga="manga" />
        </div>
        <LoadingComponent v-else />
      </div>
    </div>

    <div class="blog-card-wrap">
      <div class="container">
        <h3>Top Rated Mangas <router-link class="router-link" to="/category/top-rated"> View More</router-link> </h3>

        <div class="manga-cards" v-if="mangas.rated.length > 0">
          <MangaCard v-for=" (manga, idx) in mangas.rated" :key="idx" :manga="manga" />
        </div>
        <LoadingComponent v-else />
      </div>
    </div>



  </div>
</template>

<style lang="scss" scoped>

.search {

  max-width: 1300px;
  margin: auto;

  .input {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, .4);
    border-radius: 5px;
    background: #000;

    input {
      width: 100%;
      border: none;
      background-color: #f2f7f6;
      height: 60px;
      font-size: 15px;
      padding: 20px 4px 20px 30px;
      border-radius: 5px;

      &:focus {
        outline: none;
      }
    }

    button {
      outline: none;
      border: none;
      height: 100%;
      padding: 0px 20px;
      color: #fff;
      background: none;
      cursor: pointer;
    }


  }
}

.blog-card-wrap {
  .container{
    min-height: 50vh;

    h3 {
      font-weight: 300;
      font-size: 28px;
      margin: 3rem 0;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
  
      .router-link {
        align-self: center;
        transition: 500ms ease all;
        font-size: 15px;
        text-decoration:none;
        cursor: pointer;
        padding: 12px 24px;
        background-color: #303030;
        color: #fff;
        border-radius: 20px;
        border: none;
  
        &:focus {
          outline: none;
        }
  
        &:hover {
          background-color: rgba(48, 48, 48, 0.7);
        }
      }
    }
  }


}

@media  (max-width:450px) {
  .container {
    h3{
      align-items: center;
      flex-direction: column;
      gap: 1rem;
    }
  }
}
</style>