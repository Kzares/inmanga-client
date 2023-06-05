<script setup>
import { ref, onBeforeMount } from 'vue'
import {useRoute} from 'vue-router'
import axios from 'axios'
import { DeGooglecloudOriginal } from "@kalimahapps/vue-icons";
import { BsCloudDownloadFill } from "@kalimahapps/vue-icons";
import LoadingComponent from '../components/LoadingComponent.vue'

//reactive variables
const linksList = ref(null)
const route = useRoute()

//onBeforeMount functions 
onBeforeMount(() => {
    getManga()
})


//methods
const getManga = async () => {
    await axios.get(`http://localhost:5000/api/mangas/manga-links/${route.params.id}`)
        .then((response) => {
            linksList.value = Object.entries(response.data)

        })
}
</script>

<template>
    <div class="container">

        <div class="cover-photo">
            <img src="../assets/InManga.png" alt="">
        </div>

        <div class="content">

            <div class="header">
                <DeGooglecloudOriginal class="icon" />
                <h1>Direct Download from Google Drive</h1>
            </div>

            <div v-if="linksList !== null" class="links-list">
                <a href="https://drive.google.com/uc?export=download&id=1qYJ-pu8_DsIN9cOcXZONcx9tMBguo2sT" target="_blank" v-for="(entry, idx) in linksList " :key="idx">
                    <BsCloudDownloadFill class="icon" />
                    <p>{{ entry[1] }}</p>
                </a>
            </div>
            <LoadingComponent v-else  />

        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    justify-content: center;

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

    .content {
        z-index: 1;
        margin-top: 7rem;
        height: fit-content;
        width: 700px;
        max-width: 100%;
        padding-top: 0;
        background: #fff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        margin-left: 5px;
        margin-right: 5px;

        .header {
            display: flex;
            align-items: center;
            gap: 1rem;
            justify-content: center;
            background: #eeeeee45;
            padding-top: 2rem;
            padding-bottom:2rem;


            .icon {
                font-size: 35px;
                color: black;
            }

            h1 {
                font-size: 20px;
                font-weight: 100;
                color: #444;
            }
        }

        .links-list {
            padding:2rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            a {
                text-decoration:none;
                color: #444;
                font-size: 17px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
                transition: all 400ms ease-in-out;
                cursor: pointer;
                align-items: center;
                display: flex;
                gap: 10px;

                &:hover {
                    transform: scale(1.03);
                }
            }
        }

    }
}

@media(max-width:500px) {
    .container {



        .content {

            .header {
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .icon {
                    font-size: 45px;
                }

                h1 {
                    font-size: 17px;
                }

                .links-list {

                    a {
                        font-size: 13px;
                        padding-bottom: 10px;
                    }
                }
            }
        }
    }
}
</style>