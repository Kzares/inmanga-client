<script setup >
import { useRoute, useRouter} from 'vue-router'
import { reactive, watch, onBeforeMount, ref} from 'vue'
import LoaderComponent from '@/components/LoaderComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import axios from 'axios';
import { useStore } from 'vuex'

//vuex store 
const store = useStore()
const vuexState = store.state
const commit = store.commit

//reactive variables 
const route = useRoute()
const router = useRouter()
const type = ref('')
const loader = ref(false)

const modal = reactive({
  show: false,
  message: '',
  completeAction: false
})

const state = reactive({
  username: '',
  password: ''
})

//check route before mounts
onBeforeMount(() =>{
  type.value = route.params.param
  if(vuexState.user.id) {
    router.push('/')
  }
})
//Watch methods
watch(
    () => route.params.param,
    (newType) => {
        type.value = newType
    }
)

//Methods
const updateRoute = () => {
  if(type.value === 'login'){
    router.push('/users/register')
  }else {
    router.push('/users/login')    
  }
}

const submitForm  = () => {
  loader.value = true
  if(type.value === 'login'){
    axios.post(`https://bakteria.online:5000:5000/api/users/login`, {
      username: state.username,
      password: state.password
    } ).then((res) => {
      console.log(res.data)
      modal.message = 'Your account has been loaded succesfully'
      loader.value = false
      modal.show = true
      //saving into vuex state
      commit('UPDATE_USER', res.data)

      modal.completeAction = true
    }).catch((e) => {
      modal.message = 'An error ocurred'
      loader.value = false
      modal.show = true
      console.log(e)
    })
  }else {
    axios.post(`https://bakteria.online:5000:5000/api/users/register`, {
      username: state.username,
      password: state.password
    } ).then((res) => {
      console.log(res.data)
      modal.message = 'Account created succesfully'
      loader.value = false
      modal.show = true
      //saving into vuex state
      commit('UPDATE_USER', res.data)

      modal.completeAction = true
    }).catch(() => {
      modal.message = 'An error ocurred'
      loader.value = false
      modal.show = true
    })
  }
}

// Emit response
const closeModal = () => {
  if(modal.completeAction) {
    router.push('/')
  }else {
    modal.show = false
  }
}

</script>

<template lang="" >
  <div class="form-wrap">
    <LoaderComponent v-if="loader" />
    <ModalComponent @close-modal="closeModal"
    :modalMessage="modal.message"
    :secondButton="{show:false}"
     v-if="modal.show" />
    <form class="login" @submit.prevent="submitForm" >

      <div class="login-register" v-if="type === 'login'">
        Don't have an account? <span @click="updateRoute"> Register </span>
      </div>
      <div class="login-register" v-else>
        Do you have an account? <span @click="updateRoute"> Login </span>
      </div>

      <h2 v-if="type === 'login'" >Login to InManga</h2>
      <h2 v-else >Register to InManga</h2>

      <div class="inputs">

        <div class="input">
          <input v-model="state.username" type="text" placeholder="Username" />
          <email class="icon" />
        </div>

        <div class="input">
          <input v-model="state.password" type="password" placeholder="Password" />
          <password class="icon" />
        </div>

      </div>

      <router-link class="forgot-password" to="#">Forgot your password?</router-link>
      <button type="submit" >Sign In</button>


      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<style lang="scss">
.form-wrap {
  overflow: hidden;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-self: center;
  margin: 0 auto;
  width: 90%;
  background: #fff;

  @media (min-width: 900px) {
    width: 100%;
  }

  .login-register {
    margin-bottom: 32px;

    span {
      color: #000;
      text-decoration: underline;
      cursor:pointer;
    }
  }

  form {
    padding: 0 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;

    @media (min-width: 900px) {
      padding: 0 50px;
    }

    h2 {
      text-align: center;
      font-size: 32px;
      color: #303030;
      margin-bottom: 40px;

      @media (min-width: 900px) {
        font-size: 40px;
      }
    }

    .inputs {
      width: 100%;
      max-width: 350px;

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

        .icon {
          width: 12px;
          position: absolute;
          left: 6px;
        }
      }
    }

    .forgot-password {
      text-decoration: none;
      color: #000;
      cursor: pointer;
      font-size: 14px;
      margin: 16px 0 32px;
      border-bottom: 1px solid transparent;
      transition: 0.5s ease all;

      &:hover {
        border-color: #303030;
      }
    }
    button {
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

    .angle {
      display: none;
      position: absolute;
      background-color: #fff;
      transform: rotateZ(3deg);
      width: 60px;
      right: -30px;
      height: 101%;

      @media (min-width: 900px) {
        display: initial;
      }
    }
  }

  .background {
    display: none;
    flex: 3;
    background-size: cover;
    background-image: url("../assets/InManga.png");
    width: 100%;
    height: 100%;

    @media (min-width: 900px) {
      display: initial;
    }
  }
}</style>