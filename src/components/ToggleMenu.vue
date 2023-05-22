<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'
import { AnOutlinedUserAdd,CaUserAvatarFilledAlt,CoLogOut,BxSolidHide,FlFilledLibrary,BsSearch,AnFilledHome } from "@kalimahapps/vue-icons";
import { AkFolderAdd } from "@kalimahapps/vue-icons";
import { AkKey } from "@kalimahapps/vue-icons";
import ModalComponent from './ModalComponent.vue';
import SearchBar from './SearchBar.vue'
import { useRouter } from 'vue-router'
//reactive States
const showModal = ref(false)
const showUserOptions = ref(false)
const showAdminOptions = ref(false)
const showSearchModal = ref(false)
const router = useRouter()
//Vuex Store
const store = useStore()
const vuexState = store.state
const commit = store.commit

//Methods
const logOut = () => {
    showModal.value = true
}
const logOutAdmin = () => {
    commit('LOG_OUT_ADMIN')
    router.push('/')
    showAdminOptions.value = false
}
const handleUserOptions = () => {
    showUserOptions.value = !showUserOptions.value
}
const handleAdminOptions = () => {
    showAdminOptions.value = !showAdminOptions.value
}
const handleShowSearchModal = () => {
    showSearchModal.value = !showSearchModal.value
}
//handle emits
const closeModal = () => {
    showModal.value = false
}
const acceptModal = () => {
    commit('LOG_OUT')
    showModal.value = false
}



</script>

<template>
    <ModalComponent v-if="showModal" @close-modal="closeModal" @accept-modal="acceptModal"
        :modalMessage="'Are you shure you want log out'" :secondButton="{ message: 'Accept', show: true }" />

    <transition name="search-modal">
        <div class="search-modal" v-if="showSearchModal" @click.self="handleShowSearchModal">
            <div class="search-bar">
                <SearchBar @is-search="handleShowSearchModal" />
            </div>
        </div>
    </transition>
    <div class='menu'>
        <ul v-if="vuexState.user.id">
            <router-link to="/" class='active router-link'>
                <AnFilledHome />
                InManga
            </router-link>
            <p class='router-link' @click="handleShowSearchModal">
                <BsSearch />
                Search
            </p>
            <p v-if="vuexState.admin.id" @click="handleAdminOptions" class="router-link"> 
                <AkKey />
                Admin
            </p>
            <p @click="handleUserOptions" class='router-link'>
                <CaUserAvatarFilledAlt />
                User
            </p>
            
            <transition name="modal">

                <div class="profile-menu" v-if="showUserOptions">
                    <div class="info">
                        <p class="initials"> {{ vuexState.user.username.substring(0,2) }} </p>
                        <div class="right">
                            <p> {{ vuexState.user.username }} </p>
                            <p>Welcome to InManga</p>
                        </div>
                    </div>
                    <div class="options">
                        <div class="option" @click="handleUserOptions">
                            <router-link class="option" to="/library">
                                <FlFilledLibrary class="icon" />
                                <p>Library</p>
                            </router-link>
                        </div>

                        <div class="option" @click="handleUserOptions">
                            <router-link class="option" to="/hidden">
                                <BxSolidHide class="icon" />
                                <p>Hiden</p>
                            </router-link>
                        </div>

                        <div @click="logOut" class="option">
                            <CoLogOut class="icon" />
                            <p>Sign Out</p>
                        </div>
                    </div>
                </div>
            </transition>

            <transition name="modal">

                <div class="profile-menu" v-if="showAdminOptions">
                    <div class="info">
                        <p class="initials"> {{ vuexState.admin.username.substring(0,2) }} </p>
                        <div class="right">
                            <p> {{ vuexState.admin.username }} </p>
                            <p>Welcome admin</p>
                        </div>
                    </div>
                    <div class="options">
                        <div class="option" @click="handleAdminOptions">
                            <router-link class="option" to="/admin">
                                <FlFilledLibrary class="icon" />
                                <p>Posts Library</p>
                            </router-link>
                        </div>

                        <div class="option" @click="handleAdminOptions">
                            <router-link class="option" to="/admin/new">
                                <AkFolderAdd class="icon" />
                                <p>New manga</p>
                            </router-link>
                        </div>

                        <div @click="logOutAdmin" class="option" >
                            <CoLogOut class="icon" />
                            <p>Sign Out</p>
                        </div>
                    </div>
                </div>
            </transition>

        </ul>
        <ul v-else>
            <router-link to="/" class='active router-link'>
                <AnFilledHome />
                InManga
            </router-link>
            <p class='router-link' @click="handleShowSearchModal">
                <BsSearch />
                Search
            </p>
            <p v-if="vuexState.admin.id" @click="handleAdminOptions" class="router-link"> 
                <AkKey />
                Admin
            </p>
            <router-link to="/users/login" class='router-link'>
                <AnOutlinedUserAdd />
                Log In
            </router-link>

            <transition name="modal">

                <div class="profile-menu" v-if="showAdminOptions">
                    <div class="info">
                        <p class="initials">{{ vuexState.admin.username.substring(0,2) }}</p>
                        <div class="right">
                            <p> {{ vuexState.admin.username }} </p>
                            <p>Welcome admin</p>
                        </div>
                    </div>
                    <div class="options">
                        <div class="option" @click="handleUserOptions">
                            <router-link class="option" to="/admin">
                                <FlFilledLibrary class="icon" />
                                <p>Posts Library</p>
                            </router-link>
                        </div>

                        <div class="option" @click="handleUserOptions">
                            <router-link class="option" to="/admin/new">
                                <AkFolderAdd class="icon" />
                                <p>New manga</p>
                            </router-link>
                        </div>

                        <div @click="logOutAdmin" class="option" >
                            <CoLogOut class="icon" />
                            <p>Sign Out</p>
                        </div>
                    </div>
                </div>
            </transition>
        </ul>

    </div>
</template>

<style lang="scss">
.search-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    background: #0000007b;
    backdrop-filter: blur(20px);
    padding: 1rem;

    .search-bar {
        margin-top: -20vh;
        width: 100%;
        max-width: 1000px;
    }

    @media (max-width: 770px) {
        .search-bar {
            margin-top: -50vh;
        }
    }
}

.menu {
    position: fixed;
    top: 3%;
    right: 3%;
    z-index: 10;
    opacity: 0;
    animation: fade-in 1s ease 1 forwards;
}

@keyframes fade-in {
    to {
        opacity: 1;
    }
}

.menu.active {
    opacity: 1;
    pointer-events: all;
}

.menu ul {
    position: relative;
    display: flex;
    list-style: none;
    backdrop-filter: blur(40px);
    background-color: rgba(255, 255, 255, .9);
    height: 65px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    padding: 25px;

    .profile-menu {
        position: absolute;
        top: 70px;
        right: 50px;
        width: 250px;
        z-index: 200;
        background-color: #fff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-radius: 2rem;
        border-top-right-radius: 0;


        .info {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #303030;

            .initials {
                position: initial;
                width: 40px;
                height: 40px;
                background-color: #303030;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }

            .right {
                flex: 1;
                margin-left: 24px;

                p:nth-child(1) {
                    font-size: 14px;
                }

                p:nth-child(2),
                p:nth-child(3) {
                    font-size: 12px;
                }
            }
        }

        .options {
            padding: 15px;

            .option {
                text-decoration: none;
                color: #222;
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                cursor: pointer;

                .icon {
                    width: 18px;
                    height: auto;
                }

                p {
                    font-size: 14px;
                    margin-left: 12px;
                }

                &:last-child {
                    margin-bottom: 0px;
                }
            }
        }
    }
}

.menu ul .router-link {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    margin: 0 12px;
    padding: 6px 0;
    text-transform: capitalize;
    cursor: pointer;
    color: rgb(2, 24, 24);
    transform: translateX(100%);
    opacity: 0;
    cursor: pointer;
    animation: fade-in-2 1s ease 1 forwards;
    display: flex;
    flex-direction: column;
}

@keyframes fade-in-2 {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes showUserModal {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.menu ul .active {
    color: #2980b9;
}

.menu ul .active::after {
    transform: translateY(0);
}

// Animated modal 
.modal-enter-active,
.modal-leave-active {
    transition: 0.8s ease all;
    opacity: 1;
}

.modal-enter-from,
.modal-leave-to {
    transform: translateX(70px);
    opacity: 0;
}

// Animated search modal 
.search-modal-enter-active,
.search-modal-leave-active {
    transition: 0.3s ease all;
    opacity: 1;
}

.search-modal-enter-from,
.search-modal-leave-to {
    opacity: 0;
}
</style>

