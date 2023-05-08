<script setup >
import { onBeforeMount, ref, reactive } from 'vue';
import axios from 'axios'
import { useStore } from 'vuex'
import MangaCard from '@/components/MangaCard.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import NoResults from '@/components/NoResults.vue'
import { BxSolidHide } from "@kalimahapps/vue-icons";
import { useRouter } from 'vue-router'

//Store variables 
const store = useStore()
const vuexState = store.state

//Reactive Variables
const mangas = ref([])
const mangasToSearch = ref([])
const isEmpty = ref(false)
const router = useRouter()
const pagination = reactive({
    start: 0,
    end: 4,
    current: 1
})
//Load content before mounts
onBeforeMount(() => {
    if(!vuexState.user.id) router.push('/')
    if(vuexState.user.hidden.length > 0){
        filterIdArray()
    }else{
        isEmpty.value = true
    }
})

//Methods

//method to filter the pages
const filterIdArray = () => {
    mangasToSearch.value = []
    mangas.value = []

    for (let index = pagination.start; index <= pagination.end; index++) {

        //check if this is the end of the loop for cycle restart
        if (!vuexState.user.hidden[index] && index === pagination.start) {
            pagination.start = 0
            pagination.end = 4
            pagination.current = 1

            filterIdArray()
            return
        }
        //prevent undefined calls
        if (vuexState.user.hidden[index]) {
            //pushing to the array
            mangasToSearch.value.push(vuexState.user.hidden[index])
        }
    }
    //call to search manga
    searchManga()
}
//method to change the pages
const paginationMethod = (param) => {

    if(pagination.current <= 1 && param < 0){
        return
    }
    pagination.start += param
    pagination.end += param
    
    if(param > 0){
        pagination.current += 1
    }else {
        pagination.current -= 1
    }
    filterIdArray()
}
//search in database method
const searchManga = async () => {
    await axios.post(`http://localhost:5000/api/users/get-saved-mangas`, {
        mangas: mangasToSearch.value
    })
        .then((response) => {
            mangas.value = response.data
            console.log(response.data)
        })
        .catch(e => {
            console.log(e)
        })
}

</script>

<template>
    <div class=" library-hidden" v-if="!isEmpty" >

        <div class="no-results"  >
            <BxSolidHide  class="icon" />
            <h3> The mangas you hide are displayed here</h3>
        </div>
        

        <div class="blog-card-wrap">
            <div class="container">
                <div class="manga-cards" v-if="mangas.length > 0">
                    <MangaCard v-for=" (manga, idx) in mangas" :key="idx" :manga="manga" />
                </div>
                <LoadingComponent v-else />

                <div v-if="mangas.length > 0" class="pagination-buttons">
                    <button @click="paginationMethod(-5)">Prev</button>
                    <button> {{ pagination.current }} </button>
                    <button @click="paginationMethod(5)">Next</button>
                </div>
            </div>
        </div>
    </div>
    <div class="library-hidden"  v-else>
        <NoResults :type="'hidden'" :search="'empty'" />
    </div>
</template>

