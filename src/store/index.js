import { createStore } from 'vuex';
import axios from 'axios'

export default createStore({
  state: {
    user: {},
    admin: {}
  },

  mutations: {

    //update user in database
    UPDATE_USER_SAVED(state){
     
      axios.post(`http://localhost:5000/api/users/update-user/saved`, {
        id: state.user.id,
        saved: state.user.saved
      })
      

    },
    UPDATE_USER_HIDDEN(state){
      axios.post(`http://localhost:5000/api/users/update-user/hidden`, {
        id: state.user.id,
        hidden: state.user.hidden
      })
      

    },
    UPDATE_USER_LIKED(state){
      axios.post(`http://localhost:5000/api/users/update-user/liked`, {
        id: state.user.id,
        liked: state.user.liked
      })
      

    },


    //User functions

    SAVE_USER(state){
      window.localStorage.setItem(`user`, JSON.stringify(state.user) )
    },
    UPDATE_USER(state, payload) {
      const user = {
        ...payload
      }
      state.user = user
      window.localStorage.setItem(`user`, JSON.stringify(user) )
    },
    LOAD_USER(state) {
      const user = window.localStorage.getItem(`user`) ? JSON.parse(window.localStorage.getItem(`user`)) : {}
      state.user = user
    },
    LOG_OUT(state) {
      window.localStorage.removeItem(`user` )
      state.user = {}      
    },


    //Update database mutations 
    LIKE_MANGA(state, id){
      console.log(state.user.id)
      axios.get(`http://localhost:5000/api/mangas/like/${id}`)
      .then(res => console.log(res.data))
      .catch(res => console.log(res.data) )
    },
    DISLIKE_MANGA(state,id){
      console.log(state.user.id)
      axios.get(`http://localhost:5000/api/mangas/like/${id}?like=-1`)
      .then(res => console.log(res.data))
      .catch(res => console.log(res.data) )
    },

    //admin
    SAVE_ADMIN(state){
      window.localStorage.setItem(`admin`, JSON.stringify(state.admin) )
    },
    UPDATE_ADMIN(state, payload) {
      const admin = {
        ...payload
      }
      state.admin = admin
      window.localStorage.setItem(`admin`, JSON.stringify(admin) )
    },
    LOAD_ADMIN(state) {
      const admin = window.localStorage.getItem(`admin`) ? JSON.parse(window.localStorage.getItem(`admin`)) : {}
      state.admin = admin
    },
    LOG_OUT_ADMIN(state) {
      window.localStorage.removeItem(`admin` )
      state.admin = {}      
    },

  },
  actions: {

    //Add to library functions
    ADD_TO_LIBRARY({state, commit}, id ){

      const saved = state.user.saved
      saved.push(id)
      state.user.saved = saved

      commit(`UPDATE_USER_SAVED`)
      commit(`SAVE_USER`)      
    },
    
    REMOVE_FROM_LIBRARY({state, commit}, id) {
      const saved = state.user.saved
      const filterArray = saved.filter(data => data !== id )
      state.user.saved = filterArray

      commit(`UPDATE_USER_SAVED`)
      commit(`SAVE_USER`)      
    },

    //Move to hidden functions
    ADD_TO_HIDDEN({state, commit}, id) {
      const hidden = state.user.hidden
      hidden.push(id)
      state.user.hidden = hidden

      commit(`UPDATE_USER_HIDDEN`)
      commit(`SAVE_USER`)      
    },

    REMOVE_FROM_HIDDEN({state, commit}, id) {
      const hidden = state.user.hidden
      const filterArray = hidden.filter(data => data !== id )
      state.user.hidden = filterArray

      commit(`UPDATE_USER_HIDDEN`)
      commit(`SAVE_USER`)      
    },

    //Add to liked functions
    ADD_TO_LIKED({state, commit}, id ){

      const liked = state.user.liked
      liked.push(id)
      state.user.liked = liked

      commit(`UPDATE_USER_LIKED`)
      commit(`SAVE_USER`)      
      commit(`LIKE_MANGA`, id)
    },
    
    REMOVE_FROM_LIKED({state, commit}, id) {
      const liked = state.user.liked
      const filterArray = liked.filter(data => data !== id )
      state.user.liked = filterArray

      commit(`UPDATE_USER_LIKED`)
      commit(`SAVE_USER`)      
      commit(`DISLIKE_MANGA`, id)
    },
  },
  modules: {
  }
});
