<script setup>
import MangaCard from '../components/MangaCard.vue';
import SearchBar from '../components/SearchBar.vue'
import LoadingComponent from '../components/LoadingComponent'
import { ref, onBeforeMount } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

//reactive variables
const mangas = ref(null)
const isSearch = ref(null)
const store = useStore()
const router = useRouter()
const admin = ref(store.state.admin)

//triggers function before mounts
onBeforeMount(() => {
    getTopRatedMangas()
    if(!admin.value.id){
        router.push('/admin/login')
    }
})


//methods 
const getTopRatedMangas = async () => {
    await axios.get(`https://bakteria.online:5000:5000/api/mangas/top-rated`)
        .then((response) => mangas.value = response.data)

}

//emits response

const adminSearch = async (value) => {
    mangas.value = null
    isSearch.value = value
    await axios.get(`https://bakteria.online:5000:5000/api/mangas/search/${value.toLocaleLowerCase()}`)
        .then((response) => mangas.value = response.data)
}

</script>

<template>
    <div class="admin">
        <div class="feed container">

            <SearchBar @admin-search="adminSearch" :admin="true" />

            <div class="blog-card-wrap">
                <div class="container">
                    <h3 v-if="isSearch"> Search Results for: {{ isSearch }} </h3>

                    <div class="manga-cards" v-if="mangas">
                        <MangaCard :admin="true" v-for=" (manga, idx) in mangas" :key="idx" :manga="manga" />
                    </div>
                    <LoadingComponent v-else />
                </div>
            </div>



        </div>
    </div>
</template>



