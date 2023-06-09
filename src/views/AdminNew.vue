<script setup>
import { ref, reactive, defineProps, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useStore } from 'vuex'
import LoaderComponent from '../components/LoaderComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'

//vuex state 
const store = useStore()
const admin = ref(store.state.admin)

//reactive variables
const imageUrl = ref(false)
const selectedFile = ref(null)
const loader = ref(false)
const showModal = ref(false)
const modalMessage = ref('')
const modalError = ref(false)
const route = useRoute()
const router = useRouter()

const categories = reactive({
    typedCategory: '',
    categoriesArray: []

})

const link = reactive({
    name: '',
    link: '',
})

const state = reactive({
    id: null,
    title: null,
    author: null,
    date: null,
    sinopsis: null,
    review: null,
    score: null,
    categories: [],
    links: {}
})
//defining props
const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false,
        required: false
    }
})

//triggers function before mounts
//triggers function before mounts
onBeforeMount(() => {
    if (!admin.value.id) {
        router.push('/admin/login')
    }
})
onBeforeMount(async () => {

    await axios.get(`http://localhost:5000/api/mangas/category/get-all`)
        .then(response => categories.categoriesArray = response.data)

    if (props.isEdit) {
        loader.value = true
        await axios.get(`http://localhost:5000/api/mangas/${route.params.id}`)
            .then(({ data }) => {
                state.id = data.id
                state.title = data.title
                state.author = data.author
                state.sinopsis = data.sinopsis
                state.review = data.review
                state.score = data.score
                state.categories = data.categories

                loader.value = false

                const date = new Date(data.released)
                const converted_Date = date.toISOString().substring(0, 10)

                state.date = converted_Date


            })

        //get download links 
        await axios.get(`http://localhost:5000/api/mangas/manga-links/${route.params.id}`)
            .then((response) => {
                state.links = response.data

            })
    }

})


//methods
const onFileChange = (e) => {
    const file = e.target.files[0]
    selectedFile.value = file

    //read the image as image
    const reader = new FileReader()
    reader.onload = e => {
        imageUrl.value = e.target.result
    }
    reader.readAsDataURL(file)


}

const uploadImage = (id) => {
    //send the image to server     
    const formData = new FormData()
    formData.append('file', selectedFile.value, selectedFile.value.name) // especifica 'file' como nombre del campo donde se incluye la imagen
    const filename = id + '.jpg' // no es necesario enviar el nombre en la URL
    axios.post(`http://localhost:5000/image/${filename}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // especifica el tipo de contenido para el servidor pueda interpretar los datos recibidos
        }
    })
        .then(response => {
            console.log(response.data)
            // realiza alguna acción adicional 
            loader.value = false
            modalMessage.value = 'Manga Updated Succesfully and image uploaded'
            showModal.value = true
        })
        .catch(error => {
            console.log(error)
            // muestra mensaje de error o realiza alguna acción adicional 
            modalMessage.value = 'Unexpected error Ocurred while uploading the image'
            modalError.value = true
        })
}

const uploadDownloadLinks = (id) => {
    console.log(state.links)
    const links = state.links
    axios.put(`http://localhost:5000/api/mangas/edit/update_download_liks/${id}`, { links : links })
        .then((data) => {
            console.log(data.data)
            if (selectedFile.value) {
                uploadImage(id)
            } else {
                loader.value = false
                modalMessage.value = 'Manga Updated Succesfully'
                showModal.value = true
            }
        })
        .catch(error => {
            console.error(error);
        });
}
const submitData = async () => {
    loader.value = true
    if (props.isEdit) {
        axios.put(`http://localhost:5000/api/mangas/edit/${route.params.id}`, {
            title: state.title,
            author: state.author,
            released: state.date,
            sinopsis: state.sinopsis,
            review: state.review,
            score: state.score,
            categories: state.categories
        }).then((data) => {
            uploadDownloadLinks(data.data)

        })
            .catch(() => {
                modalMessage.value = 'Unexpected error Ocurred'
                modalError.value = true
            })
    } else {
        if (!selectedFile.value) {
            loader.value = false
            return
        }

        axios.post(`http://localhost:5000/api/mangas/add`, {
            title: state.title,
            author: state.author,
            released: state.date,
            sinopsis: state.sinopsis,
            review: state.review,
            score: state.score,
            categories: state.categories
        })
            .then((data) => {
                uploadDownloadLinks(data.data)
            })
            .catch(() => {
                modalMessage.value = 'Unexpected error Ocurred'
                modalError.value = true
            })
    }
}

const addCategory = () => {
    state.categories.push(categories.typedCategory.toLocaleLowerCase())
    categories.typedCategory = ''
}

const addLink = () => {
    if (link.name && link.link) {

        state.links[`${link.link}`] = link.name

        link.name = ''
        link.link = ''
    }

}

const deleteLink = (key) => {
    delete state.links[key]
}

const addCategoryfromList = (e) => {
    state.categories.push(e.target.innerText)
}

const removeCategory = (e) => {
    const filterArray = state.categories.filter((name) => name !== e.target.innerText)
    state.categories = filterArray
}

//emits response
const closeModal = () => {
    if (modalError.value) {
        showModal.value = false
    } else {
        router.push('/admin')
    }
}

</script>

<template>
    <div class="container ">
        <LoaderComponent v-if="loader" />
        <ModalComponent v-if="showModal" :secondButton="{ show: false }" :modalMessage="modalMessage"
            @close-modal="closeModal" />
        <div class="cover-photo">
            <img src="../assets/InManga.png" alt="">
        </div>

        <main>

            <div class="image">

                <input type="file" id="fileInput" @change="onFileChange">
                <label class="label" v-if="!state.id && !isEdit && !imageUrl" for="fileInput">+</label>

                <label v-if="imageUrl" for="fileInput">
                    <img :src="imageUrl" alt="">
                </label>
                <label for="fileInput" v-else>
                    <img v-if="isEdit" :src="`http://localhost:5000/download/${state.id}.jpg`" alt="">
                </label>



            </div>

            <form class="content" @submit.prevent="submitData">

                <h1>Fill all fields to upload a manga</h1>

                <div class="input">
                    <input v-model="state.title" type="text" placeholder="Title" required>
                </div>
                <h6>
                    <div class="input">
                        <input v-model="state.author" type="text" placeholder="Author" required>

                    </div>
                    <div class="input">
                        <input v-model="state.date" type="date" required>
                    </div>
                </h6>

                <div class="input">
                    <textarea v-model="state.sinopsis" name="" id="" cols="30" rows="10" placeholder="Sinopsis"
                        required></textarea>

                </div>
                <div class="input">
                    <textarea v-model="state.review" name="" id="" cols="30" rows="10" placeholder="Review"
                        required></textarea>
                </div>

                <div class="input">
                    <input type="text" v-model="categories.typedCategory" placeholder="Type a category">
                    <button @click.prevent="addCategory">Add</button>
                </div>

                <div class="categories">
                    <ul>
                        <li @click="removeCategory" v-for="category, idx in state.categories" :key="idx"> {{ category }}
                        </li>
                    </ul>
                </div>

                <div class="categories">
                    <span>Select to add a category</span>
                    <ul>
                        <li @click="addCategoryfromList" v-for="category, idx in categories.categoriesArray" :key="idx">
                            {{ category }} </li>
                    </ul>
                </div>

                <span class="heading">Add a download link</span>

                <div class="input input-link">
                    <input type="text" v-model="link.name" placeholder="Title">
                    <input type="text" v-model="link.link" placeholder="Download link">
                    <button @click.prevent="addLink">Add</button>
                </div>

                <div class="links">
                    <ul>
                        <li @click="deleteLink(entry[0])" v-for="entry, idx  in Object.entries(state.links) " :key="idx">
                            {{ entry[0] }} : {{ entry[1] }}
                        </li>
                    </ul>
                </div>

                <div class="input number">
                    <input v-model="state.score" type="number" placeholder="Score" step="any" required>
                </div>

                <button type="submit">Submit</button>
            </form>

        </main>

    </div>
</template>

<style lang="scss" scoped >
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;

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
        margin-top: 4rem;
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
        gap: 2rem;

        .image {
            display: flex;
            flex: 1;
            flex-direction: column;
            gap: 2rem;
            height: 100%;
            align-items: center;
            justify-content: center;

            input {
                display: none;
            }

            .label {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 3rem 3.5rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.7), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
                border-radius: 100%;
                font-size: 25px;
                font-weight: 700;

                img {
                    object-fit: cover;
                    width: 100%;
                    max-height: 700px;
                }
            }


        }

        .content {
            flex: 1;
            height: 100%;
            align-items: flex-start;
            gap: 1rem;

            h1 {
                font-size: 20px;
                font-weight: 500;
                padding: 2rem 0;
            }

            h6 {
                font-weight: 400;
                font-size: 14px;
                padding-bottom: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
                gap: 1rem;

                input {
                    flex: 1;

                }
            }

            .categories {
                span {
                    padding: 2rem 0;
                    font-weight: 200;
                }

                ul {
                    display: flex;
                    flex-wrap: wrap;
                    gap: .4rem;
                    padding: 2rem 0;


                    li {
                        padding: 7px;
                        background: #eee;
                        border-radius: 8px;
                        width: max-content;
                        display: flex;
                        float: left;
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
}

button {
    align-self: center;
    text-align: right;
    transition: 500ms ease all;
    font-size: 15px;
    text-decoration: none;
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


.input {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    border-radius: 5px;
    gap: 15px;

    input,
    textarea {
        width: 100%;
        border: none;
        background-color: #fff;
        height: 50px;
        font-size: 15px;
        padding: 20px 4px 20px 30px;
        border-radius: 10px;
        border: .1px solid rgba(0, 0, 0, 0.1);

        &:focus {
            outline: none;
        }
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    textarea {
        resize: vertical;
        height: 140px;
    }
}


.heading {
    font-weight: 200;
    font-size: 20px;
    padding-bottom: 10px;
}

.links {
    display: flex;
    gap: 15px;
    flex-direction: column;



    ul {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding-top: 1rem;

        li {
            list-style: none;
            color: #444;
            font-size: 14px;
            padding-bottom: 10px;
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


.number {
    margin: 1.5rem auto;
    max-width: 200px;

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

    .input-link {
        flex-direction: column;
    }
}</style>