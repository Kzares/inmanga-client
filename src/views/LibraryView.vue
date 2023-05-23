<script setup >
import { onBeforeMount, ref, reactive } from 'vue';
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MangaCard from '@/components/MangaCard.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import NoResults from '@/components/NoResults.vue'
import { FlFilledLibrary } from "@kalimahapps/vue-icons";


//Store variables 
const store = useStore()
const vuexState = store.state
const router = useRouter()
//Reactive Variables
const mangas = ref([])
const mangasToSearch = ref([])
const pagination = reactive({
    start: 0,
    end: 4,
    current: 1
})
const isEmpty = ref(false)
//Load content before mounts
onBeforeMount(() => {
    if(!vuexState.user.id) router.push('/')
    if(vuexState.user.saved.length > 0){
        filterIdArray()
    }else{
        isEmpty.value = true
    }
})

//watch methods

//Methods

//method to filter the pages
const filterIdArray = () => {
    mangasToSearch.value = []
    mangas.value = []

    for (let index = pagination.start; index <= pagination.end; index++) {

        //check if this is the end of the loop for cycle restart
        if (!vuexState.user.saved[index] && index === pagination.start) {
            pagination.start = 0
            pagination.end = 4
            pagination.current = 1

            filterIdArray()
            return
        }
        //prevent undefined calls
        if (vuexState.user.saved[index]) {
            //pushing to the array
            mangasToSearch.value.push(vuexState.user.saved[index])
        }
    }
    //call to search manga
    searchManga()
}
//method to change the pages
const paginationMethod = (param) => {

    if(pagination.current <= 1 && param < 0 || isEmpty.value){
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
    await axios.post(`https://bakteria.online:5000/api/users/get-saved-mangas`, {
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
    <div class=" library-hidden" v-if="!isEmpty">
        
        <div class="no-results"  >
            <FlFilledLibrary  class="icon" />
            <h3> The mangas you save are stored here</h3>
        </div>

        <div class="blog-card-wrap">
            <div class="container">
                <div class="manga-cards" v-if="mangas.length > 0">
                    <MangaCard v-for=" (manga, idx) in mangas" :key="idx" :manga="manga" />
                </div>
                <LoadingComponent v-else />

                <div v-if="mangas.length > 0 " class="pagination-buttons" >
                    <button @click="paginationMethod(-5)">Prev</button>
                    <button> {{ pagination.current }} </button>
                    <button @click="paginationMethod(5)">Next</button>
                </div>
            </div>
        </div>
    </div>
    <div class="library-hidden"  v-else>
        <NoResults :type="'library'" :search="'empty'" />
    </div>

</template>

<style lang="scss" >

.library-hidden {
    min-height: 100vh;
    background-color: #eee; 

    .no-results {
        padding-top:7rem;
        padding-bottom:7rem ;
        display:flex;
        align-items:center;
        justify-content: center;
        width:100%;
        flex-direction: column;
    
        h3{
            font-weight: 300;
    
            span{
                font-weight: 500;
            }
        }
    
        .icon {
            font-size: 2.5rem;
            font-weight: 500;
        }
        
    }
}
@media (max-width: 650px){
    .library-hidden {
    
        .no-results {
            padding-top:7rem;
            padding-bottom:3rem ;
           
        }
    }
}
.blog-card-wrap {
    .container {
        min-height: 50vh;

        
    }
}
.pagination-buttons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    gap: 3px;

    button {
        align-self: center;
        transition: 500ms ease all;
        cursor: pointer;
        margin-top: 24px;
        padding: 12px 24px;
        background-color: #303030;
        color: #fff;
        border-radius: 20px;
        border: none;
        text-transform: uppercase;

        &:focus {
            outline: none;
        }

        &:hover {
            background-color: rgba(48, 48, 48, 0.7);
        }
    }

    :nth-child(1) {
        border-top-left-radius: 0px;
        border-bottom-right-radius: 0px;
    }

    :nth-child(2) {
        border-radius: 100%;
        padding: 12px 17px;
        pointer-events: none;
    }

    :nth-child(3) {
        border-top-right-radius: 0px;
        border-bottom-left-radius: 0px;
    }

}
</style>