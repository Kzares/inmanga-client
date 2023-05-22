<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { BsStarFill } from "@kalimahapps/vue-icons";
import { BsStarHalf } from "@kalimahapps/vue-icons";
import { BsStar } from "@kalimahapps/vue-icons";
import { BxBookAdd, BxSolidShow, CoFolderRemove, BxSolidHide, AkHeart, AnFilledHeart } from "@kalimahapps/vue-icons";
import LoaderComponent from '@/components/LoaderComponent.vue'

//vuex store
const store = useStore()
const user = store.state.user
const dispatch = store.dispatch

//reactive variables
const route = useRoute()
const manga = ref(null)
const stars = reactive({
    filled: 0,
    half: 0,
    empty: 0
})
const state = reactive({
    isLiked: false,
    isSaved: false,
    isHide: false,
})
//triggers function before mounts
onBeforeMount(() => {
    getManga()



})
//methods 
const getManga = async () => {
    await axios.get(`http://149.100.154.239:5000/api/mangas/${route.params.id}`)
        .then((response) => {
            manga.value = response.data
            const newDate = new Date(response.data.released)
            manga.value.released = newDate.toLocaleDateString()


            /////////Cheking if the manga is liked, saved and hidden
            if (user.id) {
                user.saved.map(item => {
                    if (item === manga.value.id) {
                        return state.isSaved = true
                    }
                })

                //checking if the manga is liked
                user.liked.map(item => {
                    if (item === manga.value.id) {
                        return state.isLiked = true
                    }
                })

                //checking if the manga is Hide
                user.hidden.map(item => {
                    if (item === manga.value.id) {
                        return state.isHide = true
                    }
                })
            }
            console.log(manga.value.categories)

        })
    await axios.get(`http://149.100.154.239:5000/api/mangas/increase-score/${route.params.id}`)

    calcStars()
}

const calcStars = () => {
    const score = manga.value.score
    stars.filled = parseInt((score - 1) / 2)
    if (score - parseInt(score) >= 0.5) {
        stars.half = 1
    } else {
        stars.half = 0
    }

    stars.empty = 5 - stars.filled - stars.half

    console.log(stars)
}

const addToLibrary = () => {

    if (state.isSaved) {
        dispatch('REMOVE_FROM_LIBRARY', manga.value.id)
    } else {
        dispatch('ADD_TO_LIBRARY', manga.value.id)
    }
    state.isSaved = !state.isSaved
}

const moveToHidden = () => {
    if (state.isHide) {
        dispatch('REMOVE_FROM_HIDDEN', manga.value.id)
    } else {
        dispatch('ADD_TO_HIDDEN', manga.value.id)
    }
    state.isHide = !state.isHide
}

const likeManga = () => {
    if (!user.id) return
    if (state.isLiked) {
        dispatch('REMOVE_FROM_LIKED', manga.value.id)
    } else {
        dispatch('ADD_TO_LIKED', manga.value.id)
    }
    state.isLiked = !state.isLiked
}

</script>

<template>
    <div v-if="manga.id" class="container ">

        <div class="cover-photo">
            <img src="../assets/InManga.png" alt="">
        </div>

        <main>

            <div class="image">
                <img :src="`http://149.100.154.239:5000/download/${manga.id}.jpg`" alt="">
            </div>

            <div class="content">

                <div class="icons" v-if="user.id">

                    <div class="icon-container" @click="addToLibrary" v-if="!state.isSaved">
                        <BxBookAdd class="icon" />
                    </div>
                    <div class="icon-container" @click="addToLibrary" v-else>
                        <CoFolderRemove class="icon" />
                    </div>

                    <div class="icon-container" @click="moveToHidden" v-if="!state.isHide">
                        <BxSolidHide class="icon" />
                    </div>
                    <div class="icon-container" @click="moveToHidden" v-else>
                        <BxSolidShow class="icon" />
                    </div>
                    <div class="icon-container" v-if="!state.isLiked" @click="likeManga">
                        <AkHeart class="icon" />
                    </div>
                    <div class="icon-container" @click="likeManga" v-else>
                        <AnFilledHeart class="icon fill" />
                    </div>
                </div>

                <h1> Title: {{ manga.title }} </h1>
                <h6>
                    <p>Released: {{ manga.released }} </p>
                    <span>Author: {{ manga.author }} </span>
                </h6>

                <p>
                    <span>Sinopsis</span>
                    <br>
                    {{ manga.sinopsis }}
                </p>


                <p>
                    <span>Review:</span>
                    <br>
                    {{ manga.review }}
                </p>
                <ul>
                    <router-link class="router-link" :to="'/category/' + category " v-for="(category, idx) in manga.categories" :key="idx"> {{ category }} </router-link>
                </ul>   
                <div class="score">
                    <span>Score: {{ manga.score }}</span>

                    <div class="stars">
                        <BsStarFill v-if="stars.filled > 0" class="icon" />
                        <BsStarFill v-if="stars.filled > 1" class="icon" />
                        <BsStarFill v-if="stars.filled > 2" class="icon" />
                        <BsStarFill v-if="stars.filled > 3" class="icon" />
                        <BsStarFill v-if="stars.filled > 4" class="icon" />

                        <BsStarHalf class="icon" v-if="stars.half > 0" />

                        <BsStar class="icon" v-if="stars.empty > 0" />
                        <BsStar class="icon" v-if="stars.empty > 1" />
                        <BsStar class="icon" v-if="stars.empty > 2" />
                        <BsStar class="icon" v-if="stars.empty > 3" />
                        <BsStar class="icon" v-if="stars.empty > 4" />
                    </div>



                </div>

                


            </div>

        </main>

    </div>
    <LoaderComponent v-else />
</template>

<style lang="scss" scoped >
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    padding-top: 6rem;

    .cover-photo {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        height: 50vh;


        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    main {
        background: #fff;
        max-width: 1300px;
        min-height: 80vh;
        padding: 2rem;
        border-top-right-radius: 3rem;
        border-bottom-left-radius: 3rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        z-index: 1;

        .image {
            flex: 1;
            display: flex;
            justify-content: center;

            img {
                max-height: 600px;
            }
        }

        .content {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
            position: relative;

            .icons {
                display: flex;
                position: absolute;
                gap: 10px;
                top: 0;
                right: 10px;
                z-index: 3;

                .icon-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 35px;
                    height: 35px;
                    background-color: #fff;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: 0.5s ease all;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                    animation: icon-animation .5s ease-in-out 1 forwards;

                    color &:hover {
                        background-color: #000;

                    }


                    .icon {
                        font-size: 1.3rem;
                        color: #000;

                    }

                    .fill {
                        color: red;
                    }
                }



                @keyframes icon-animation {
                    0% {
                        height: 20px;
                    }

                    50% {
                        height: 50px;
                    }

                    100% {
                        height: 35px;
                    }
                }
            }

            h1 {
                text-transform: capitalize;
            }

            span {
                font-weight: 700;
            }

            h6 {
                font-weight: 400;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                span {
                    font-size: 16px;
                    font-weight: 700;
                    text-transform: capitalize;
                }
            }

            p {
                font-size: 1.1rem;
                color: #333;
            }

            .score {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 3rem 0;
                gap: 2rem;
                font-size: 1.7rem;

                span {
                    font-weight: 200;
                }

                .stars {
                    gap: .3rem;
                    display: flex;
                    align-items: center;

                }
            }

            ul {
                display: flex;
                flex-wrap: wrap;
                gap: .5rem;

                .router-link {
                    padding:10px;
                    background: #eee;
                    border-radius: 8px;
                    width: fit-content;
                    display:flex;
                    float:left;
                    list-style: none;
                    text-decoration: none;
                    font-size: .8rem;
                    color: #000;
                    cursor: pointer;
                }
            }



        }
    }
}

@media (max-width: 970px) {
    .container {

        main {
            flex-direction: column;
            gap: 1rem;

            .image {

                img {
                    width: 100%;
                    height: auto;
                }
            }
        }
    }
}

@media (max-width: 500px) {
    .container {
        padding: 1rem .4rem;

        main {
            flex-direction: column;
            gap: 1.5rem;
            padding: 1rem;

            .content {
                padding-top: 35px;

                h6>* {
                    flex-direction: column;
                    justify-content: left;
                    align-items: left;
                }
            }
        }
    }
}
@media (max-width: 400px) {
    .container {

        main {

            .content {

                h6 {
                    flex-direction: column;
                    justify-content: left;
                    align-items: left;
                }
            }
        }
    }
}
</style>