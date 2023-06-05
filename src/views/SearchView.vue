<script setup >
import SearchBar from '../components/SearchBar.vue'
import MangaCard from '../components/MangaCard.vue'
import LoadingComponent from '../components/LoadingComponent'
import NoResults from '@/components/NoResults.vue'
import { useRoute } from 'vue-router'
import { watch, ref, onBeforeMount } from 'vue'
import axios from 'axios'

//reactive variables
const route = useRoute()
const search = ref(route.params.search)
const type = ref(route.params.type)
const isSearch = ref(false)
const mangas = ref([])
//Watch method , to track the actual route params
watch(
    () => route.params.search,
    (newSearch) => {
        search.value = newSearch
        searchManga()
    }
)
watch(
    () => route.params.type,
    (newType) => {
        type.value = newType
        searchManga()
    }
)
//Function to triggers before mount

onBeforeMount(() => searchManga())

//Methods

const searchManga = async () => {
    mangas.value = []
    isSearch.value = false
    if (type.value === 'name') {
        await axios.get(`http://localhost:5000/api/mangas/search/${search.value.toLocaleLowerCase()}`)
            .then((response) => {
                mangas.value = response.data
                isSearch.value = true
                console.log(isSearch.value)
            })
    } else {
        await axios.get(`http://localhost:5000/api/mangas/search-author/${search.value.toLocaleLowerCase()}`)
            .then((response) => {
                mangas.value = response.data
                isSearch.value = true
                console.log(isSearch.value)
            })
    }

}


</script>

<template>
    <div class="container ">

        <SearchBar :admin="false" />

        <div class="manga-card-wrap">

            <h2>Search results for: <span> {{ search }} </span> </h2>

            <div class="manga-cards" v-if="mangas.length > 0 && isSearch ">
                <MangaCard v-for=" (manga, idx) in mangas" :key="idx" :manga="manga" />
            </div>
            <LoadingComponent v-else-if="!isSearch && mangas.length === 0 " />
            <NoResults :search="search" :type="type" v-else />
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
            color: #333;
            font-weight: 600;
        }
    }
}
</style>
