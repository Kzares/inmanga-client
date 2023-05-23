<script setup>
import { defineProps, ref, reactive, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { BxBookAdd, BxSolidShow, CoFolderRemove, BxSolidHide, AkHeart, AnFilledHeart } from "@kalimahapps/vue-icons";
import { BsStarFill } from "@kalimahapps/vue-icons";
import { BsStarHalf } from "@kalimahapps/vue-icons";
import { BsStar } from "@kalimahapps/vue-icons";
//definig the store
const store = useStore()
const dispatch = store.dispatch
const vuexState = store.state

//reactive variables
const route = useRoute()
const router = useRouter()
const modalMessage = ref('')
const showModal = ref('')

const state = reactive({
  isLiked: false,
  isSaved: false,
  isHide: false,
})
const stars = reactive({
  filled: 0,
  half: 0,
  empty: 0
})
//props
const props = defineProps({
  manga: {
    type: Object,
    required: true
  },

})
const likes = ref(props.manga.likes)
//OnBefore Mount : checking if is liked and if is saved
onBeforeMount(() => {
  //checking if the manga is saved
  if (vuexState.user.id) {
    vuexState.user.saved.map(item => {
      if (item === props.manga.id) {
        return state.isSaved = true
      }
    })

    //checking if the manga is liked
    vuexState.user.liked.map(item => {
      if (item === props.manga.id) {
        return state.isLiked = true
      }
    })

    //checking if the manga is Hide
    vuexState.user.hidden.map(item => {
      if (item === props.manga.id) {
        return state.isHide = true
      }
    })
  }
  calcStars()
})

//parsing the date
const newDate = new Date(props.manga.released)

//methods
const calcStars = () => {
  const score = props.manga.score
  stars.filled = parseInt((score - 1) / 2)
  if (score - parseInt(score) >= 0.5) {
    stars.half = 1
  } else {
    stars.half = 0
  }

  stars.empty = 5 - stars.filled - stars.half

}

const redirect = () => {
  if (route.fullPath === '/admin') {
    router.push(`/admin/edit/${props.manga.id}`)
  } else {
    router.push(`/manga/${props.manga.id}`)
  }
}

const addToLibrary = () => {

  if (state.isSaved) {
    dispatch('REMOVE_FROM_LIBRARY', props.manga.id)
    handleModal('Manga removed to library')
  } else {
    dispatch('ADD_TO_LIBRARY', props.manga.id)
    handleModal('Manga added to library')
  }
  state.isSaved = !state.isSaved
}

const moveToHidden = () => {
  if (state.isHide) {
    dispatch('REMOVE_FROM_HIDDEN', props.manga.id)
    handleModal('Manga not hidden')
  } else {
    dispatch('ADD_TO_HIDDEN', props.manga.id)
    handleModal('Manga hidden')
  }
  state.isHide = !state.isHide
}

const likeManga = () => {
  if (!vuexState.user.id) return
  if (state.isLiked) {
    dispatch('REMOVE_FROM_LIKED', props.manga.id)
    likes.value -= 1
  } else {
    dispatch('ADD_TO_LIKED', props.manga.id)
    likes.value += 1
  }
  state.isLiked = !state.isLiked
}

const handleModal = (message) => {
  showModal.value = false
  modalMessage.value = message
  showModal.value = true
  setTimeout(() => {
    showModal.value = false
  }, 3000)
}

</script>

<template lang="">
    <div  class="manga-card">
       
        <img @click="redirect" :src="`https://149.100.154.239:5000/download/${manga.id}.jpg`" alt="">
        <div class="info">

          <div class="icons" v-if="vuexState.user.id" >

            <div class="icon-container" v-if="!state.isSaved" @click="addToLibrary" >
              <BxBookAdd class="icon"  />
            </div>
            <div class="icon-container" v-else @click="addToLibrary" >
              <CoFolderRemove class="icon" />
            </div>
            
            <div class="icon-container" v-if="!state.isHide" @click="moveToHidden" >
                <BxSolidHide class="icon"  />
            </div>
            <div class="icon-container" v-else @click="moveToHidden" >
              <BxSolidShow class="icon"  />
          </div>
          </div>
    
          <div class="modal-message" v-if="showModal">
            {{ modalMessage }}
          </div>

            <h4> {{ manga.title }} </h4>
            <h6> 
              <p> {{ newDate.toLocaleDateString() }}</p>  
              <span> {{ manga.author }} </span>
            </h6>

            <p class="sinopsis">
              {{ manga.sinopsis }}
            </p>
            

            <div class="stadistics">

              
              <div class="likes" @click="likeManga" >
                {{ likes.toLocaleString() }} 
                <AkHeart v-if="!state.isLiked" class="icon" /> 
                <AnFilledHeart v-else class="icon fill" />
              </div>

              <div class="score">
                {{ manga.score }}

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
            <ul>
              <router-link class="router-link" :to="'/category/' + category " v-for="(category, idx) in manga.categories" :key="idx"> {{ category }} </router-link>
            </ul>
            
          </div>
        
    </div>
</template>

<style lang="scss" >
.manga-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 3rem;
  justify-content: center;

}

.manga-card {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #fff;
  height: fit-content;
  max-width: 25rem;
  width: fit-content;
  transition: 0.5s ease all;
  position: relative;
  flex: 1 1 20rem;
  text-decoration: none;

  &:hover {
    transform: rotateZ(-1deg) scale(1.01);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  img {
    display: block;
    border-radius: 8px 8px 0 0;
    z-index: 1;
    width: 100%;
    min-height: 200px;
    max-height: 300px;
    object-fit: cover;

  }


  .info {
    display: flex;
    flex-direction: column;
    height: 100%;
    z-index: 3;
    padding: 32px 16px;
    color: #000;
    position: relative;

    .modal-message {
      display: flex;
      position: absolute;
      z-index: 10;
      top: -50px;
      right: 100px;
      background: white;
      padding: 1rem 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.6);
      border-radius: 2rem;
      border-bottom-right-radius: 0;
      transform: scale(0);
      opacity: 0;
      animation: like .3s ease 1 forwards;

    }
    @keyframes like {
      to{
        transform:scale(1);
        opacity: 1;
      }
    }


    .icons {
      display: flex;
      position: absolute;
      top: 0;
      right: 10px;
      z-index: 3;

      .icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35px;
        height: 35px;
        background-color: #aaa;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: 0.5s ease all;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        animation: icon-animation .5s ease-in-out 1 forwards;

        &:hover {
          background-color: #000;

        }

        &:nth-child(1) {
          margin-right: 8px;
        }

        .icon {
          font-size: 1.3rem;
          color: #fff;

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

    h4 {
      padding-bottom: 8px;
      font-size: 20px;
      font-weight: 300;
      text-transform: capitalize;
    }

    h6 {
      font-weight: 400;
      font-size: 12px;
      padding-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 14px;
        font-weight: 700;
        text-transform: capitalize;

      }
    }

    .sinopsis {
      font-size: 15px;
      color: #444;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      line-clamp: 4;
      box-orient: vertical;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      gap: .4rem;
      padding: 1rem 0;


      .router-link {
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

    .stadistics {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      font-size: 1.2rem;
      color: #333;

      .likes {
        display: flex;
        align-items: center;
        gap: .2rem;

        .icon {
          font-size: 1.4rem;
        }

        .fill {
          color: red;
        }
      }

      .score {
        display: flex;
        align-items: center;
        gap: .5rem;

        .stars {
          display: flex;
          align-items: center;
          gap: .2rem;
        }
      }
    }

    .link {
      display: inline-flex;
      align-items: center;
      margin-top: auto;
      font-weight: 500;
      padding-top: 20px;
      font-size: 12px;
      padding-bottom: 4px;
      transition: 0.5s ease-in all;

      &:hover {
        color: rgba(48, 48, 48, 0.8);
      }

      .arrow {
        width: 10px;
      }
    }
  }
}
</style>