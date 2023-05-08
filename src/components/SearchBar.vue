<script setup >
import { useRouter } from 'vue-router'
import { ref, defineEmits, defineProps, onBeforeMount } from 'vue'
import axios from 'axios'
import { BsSearch } from "@kalimahapps/vue-icons";

import LoadingComponent from './LoadingComponent.vue';

//defining reactive variables
const router = useRouter()
const search = ref('')
const toggleFlterMenu = ref(false)
const category = ref('')
const searchByName = ref(true)
const categories = ref([])

//before mount function
onBeforeMount(async () => {
    await axios.get('http://localhost:5000/api/mangas/category/get-all')
        .then(response => categories.value = response.data)
})

//emits::passing the value to parent component
const emit = defineEmits(["admin-search", "is-search"])

//define props
const props = defineProps({
    admin: {
        type: Boolean,
        required: false,
    }
})

//methods
const searchManga = () => {
    if (props.admin) {
        emit("admin-search", search.value);
    } else {
        if(searchByName.value){
            router.push(`/search/name/${search.value}`)
            emit("is-search")
        }else{
            router.push(`/search/author/${search.value}`)
            emit("is-search")
        }
    }
}

const showFilterMenu = () => {
    if(props.admin) return
    toggleFlterMenu.value = !toggleFlterMenu.value
}

const filterCategory = (e) => {
    category.value = e.target.innerText
    router.push(`/category/${category.value.toLocaleLowerCase()}`)
    emit("is-search")
    showFilterMenu()
}

</script>

<template>
    <form class="search" @submit.prevent="searchManga">

        <div class="input">
            <input v-model="search" :placeholder="searchByName ? 'Search mangas by name' : 'Search mangas by author '"
                type="text">

            <div class="filter flex">
                <h1 @click="showFilterMenu"> <BsSearch /> </h1>

                <transition name="categories-modal">
                    <ul v-if="toggleFlterMenu" class="filter__menu">
                        <div class="toggle-edit">
                            <span v-if="searchByName"> Search by name </span>
                            <span v-else> Search by auhtor </span>
    
                            <input type="checkbox" v-model="searchByName" />
                        </div>
    
                        <span>Categories:</span>
    
                        <div class="categories" v-if="categories.length > 0">
                            <li class="enphasis" @click="filterCategory" >top-rated</li>
                            <li class="enphasis" @click="filterCategory" >most-popular</li>
                            <li  v-for="(categoryItem, idx) in categories" @click="filterCategory" 
                            :key="idx"> {{ categoryItem }}
                            </li>
                            
                        </div>
                        <div v-else>
                            <LoadingComponent />
                        </div>
                    </ul>
                </transition>
            </div>
        </div>

    </form>
</template>

<style lang="scss" scoped >
.search {

    max-width: 1300px;
    margin: auto;
    padding-top: 6rem;
    width: 100%;

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

        .filter {
            cursor: pointer;
            position: relative;
            display: flex;

            h1 {
                font-size: 17px;
                color: #fff;
                align-items: center;
                justify-content: center;
                padding: 0 20px;
            }

            &__menu {
                background: #fff;
                color: #000;
                box-shadow: 10px 10px 10px rgba(0, 0, 0, .4);
                list-style: none;
                position: absolute;
                top: 35px;
                right: 0px;
                z-index: 4;
                border-radius: 15px;
                padding: 10px;
                width: 500px;
                max-width: 500px;

                .toggle-edit {
                    display: flex;
                    align-items: center;
                    right: 0;
                    justify-content: right;
                    padding: 1rem 0;

                    span {
                        margin-right: 16px;
                        font-weight: 400;
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
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
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


                span {
                    font-size: 17px;
                    font-weight: 600;
                    color: #222;
                }

                .categories {

                    columns: 3;


                    li {
                        cursor: pointer;
                        font-size: 15px;
                        padding: 10px 5px;
                        transition: all 400ms ease;
                        color: #333;
                        flex: 1;
                        position: relative;
                        text-transform: capitalize;

                        &:hover {
                            color: #1E2139;
                            transform: scale(1.1);
                        }
                    }

                }

            }
        }


    }
}
.categories-modal-enter-active,
.categories-modal-leave-active {
    transition: 0.4s ease all;
    opacity: 1;
}

.categories-modal-enter-from,
.categories-modal-leave-to {
    transform: scale(1.1);
    opacity: 0;
}

@media (max-width:700px) {
    .search {
        .input {
            .filter {
                &__menu {
                    max-width: 300px;
                    width: 300px;
                    right: 20px;

                    .categories {
                        columns: 2;
                    }
                }
            }
        }
    }
}

@media (max-width:335px) {
    .search {
        .input {
            .filter {
                &__menu {
                    max-width: 300px;
                    width: 200px;
                    right: 0;

                    .categories {
                        columns: 1;
                    }
                }
            }
        }
    }
}
</style>