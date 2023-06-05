import {createRouter, createWebHistory} from 'vue-router'
import HomeView  from '../views/HomeView'
import SearchView from '../views/SearchView'
import MangaView from '../views/MangaView'
import AdminView from '../views/AdminView'
import AdminNew from '../views/AdminNew'
import AdminEdit from '../views/AdminEdit'
import CategoriesView from '../views/CategoriesView'
import LoginView from '../views/LoginView'
import LoginAdminView from '../views/LoginAdminView'
import HiddenView from '../views/HiddenView'
import LibraryView from '../views/LibraryView'
import DownloadView from '../views/DownloadView'

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/search/:type/:search',
            name: 'search',
            component: SearchView
        },
        {
            path: '/manga/:id',
            name: 'manga',
            component: MangaView
        },
        
        {
            path: '/manga/download/:id',
            name: 'download',
            component: DownloadView
        },
        
        {
            path: '/category/:category',
            name: 'category',
            component: CategoriesView
        },

        {
            path: '/admin/login',
            name: 'login',
            component: LoginAdminView
        },

        {
            path: '/library',
            name: 'library',
            component: LibraryView
        },

        {
            path: '/hidden',
            name: 'hidden',
            component: HiddenView
        },

        {
            path: '/admin',
            name: 'admin',
            component: AdminView
        },
        {
            path: '/admin/new',
            name: 'adminNew',
            component: AdminNew
        },
        {
            path: '/admin/edit/:id',
            name: 'adminEdit',
            component: AdminEdit
        },
        {
            path: '/users/:param',
            mane: 'login',
            component: LoginView
        }
    ]
})

export default router