<script setup >
import SearchBar from '../components/SearchBar.vue'
import MangaCard from '../components/MangaCard.vue'
import LoadingComponent from '../components/LoadingComponent'
import { useRoute } from 'vue-router'
import { watch, ref, onBeforeMount, reactive } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'


//vuex store 
const store = useStore()
const user = store.state.user

//reactive variables
const route = useRoute()
const category = ref(route.params.category)
const mangas = reactive({
    notFilter: [],
    filter: [],
    activeFilter: true,
})
const pagination = reactive({
    active: false,
    start: 0,
    end: 7,
    current: 1
})

//Watch method , to track the actual route params
watch(
    () => route.params.category,
    (newSearch) => {
        category.value = newSearch
        searchManga()
    }
)

watch(
    () => mangas.activeFilter,
    () => {
        searchManga()
    }, {
    deep: true
}
)
//Function to triggers before mount

onBeforeMount(() => {
    searchManga()
    if (!user.id ) {
        mangas.activeFilter = false
    }
})

//Methods

//get all the mangas
const searchManga = async () => {
    mangas.filter = null
    mangas.notFilter = null
    if(user.id){
        if(user.hidden.length === 0) {
        mangas.activeFilter = false
        }
    }
    //checking if is a filter request or not 

    if (mangas.activeFilter) {
        if (category.value === 'top-rated' || category.value === 'most-popular') {
            await axios.post(`https://bakteria.online:5000:5000/api/users/top-rated?start=${pagination.start}&end=${pagination.end}`, {
                hidden: user.hidden
            })
                .then((response) => {
                    mangas.filter = response.data
                    console.log(response.data)
                    if (!mangas.searchReplaces) {
                        if (response.data.length === 0 && pagination.active) {
                            pagination.start = 0
                            pagination.end = 7
                            pagination.current = 1
                            searchManga()
                        }
                    }
                })
        } else {
            //No filter request
            await axios.post(`https://bakteria.online:5000:5000/api/users/category/${category.value}?start=${pagination.start}&end=${pagination.end}`, {
                hidden: user.hidden
            })
                .then((response) => {
                    //establecer los mangas como arreglos temporales
                    mangas.filter = response.data
                    //compriobar si se reinicia la paginacion  
                    if (response.data.length === 0 && pagination.active) {
                        pagination.start = 0
                        pagination.end = 7
                        pagination.current = 1
                        searchManga()
                    }

                })

        }
    } else {
        if (category.value === 'top-rated' || category.value === 'most-popular') {
            await axios.get(`https://bakteria.online:5000:5000/api/mangas/${category.value}?start=${pagination.start}&end=${pagination.end}`)
                .then((response) => {
                    mangas.notFilter = response.data
                    if (!mangas.searchReplaces) {
                        if (response.data.length === 0 && pagination.active) {
                            pagination.start = 0
                            pagination.end = 7
                            pagination.current = 1
                            searchManga()
                        }
                    }
                })
        } else {
            //No filter request
            await axios.get(`https://bakteria.online:5000:5000/api/mangas/category/${category.value}?start=${pagination.start}&end=${pagination.end}`)
                .then((response) => {
                    //establecer los mangas como arreglos temporales
                    mangas.notFilter = response.data
                    //compriobar si se reinicia la paginacion  
                    if (response.data.length === 0 && pagination.active) {
                        pagination.start = 0
                        pagination.end = 7
                        pagination.current = 1
                        searchManga()
                    }

                })

        }
    }

}

//pagination
const paginationMethod = (size) => {
    pagination.active = true
    pagination.start = pagination.start + size
    pagination.end = pagination.end + size
    searchManga()

    if (size > 0) {
        pagination.current += 1
    } else {
        pagination.current -= 1
    }
}


</script>

<template>
    <div class="container ">

        <SearchBar :admin="false" />

        <div class="manga-card-wrap">


            <div class="toggle-edit" v-if="user.id">
                <span v-if="mangas.activeFilter">Show hidden mangas</span>
                <span v-else>Not show hidden mangas</span>

                <input type="checkbox" v-model="mangas.activeFilter" />
            </div>

            <h2><span> {{ category }} </span> mangas </h2>

            <div class="manga-cards" v-if="mangas.filter && mangas.activeFilter">
                <MangaCard v-for=" (manga, idx) in mangas.filter" :key="idx" :manga="manga" />
            </div>
            <div class="manga-cards" v-else-if="mangas.notFilter && !mangas.activeFilter">
                <MangaCard v-for=" (manga, idx) in mangas.notFilter" :key="idx" :manga="manga" />
            </div>
            <LoadingComponent v-else />

            <div v-if="mangas" class="pagination-buttons">
                <button v-show="pagination.current > 1" @click="paginationMethod(-7)">Prev</button>
                <button> {{ pagination.current }} </button>
                <button @click="paginationMethod(7)">Next</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.manga-card-wrap {
    padding-top: 2rem;

    .toggle-edit {
        display: flex;
        align-items: center;
        right: 0;
        justify-content: right;

        span {
            margin-right: 16px;
        }

        input[type="checkbox"] {
            position: relative;
            border: none;
            -webkit-appearance: none;
            background: #fff;
            outline: none;
            width: 80px;
            height: 30px;
            border-radius: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        input[type="checkbox"]:before {
            content: "";
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 20px;
            top: 0;
            left: 0;
            background: #303030;
            transform: scale(1.1);
            transition: 750ms ease all;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        input:checked[type="checkbox"]:before {
            background: #fff;
            left: 52px;
        }
    }

    h2 {
        font-weight: 400;

        span {
            text-transform: capitalize;
            color: #333;
            font-weight: 600;
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
}
</style>
