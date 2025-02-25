// import 'bootstrap/dist/css/bootstrap.css' move to index.html
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import * as Vue from 'vue'
// Import the individual components
import {
    BCard,
    BCardBody,
    BCardFooter,
    BCardHeader,
    BCardImg,
    BTable
} from 'bootstrap-vue'

// Add components globally
Vue.component('b-card', BCard)
Vue.component('b-card-body', BCardBody)
Vue.component('b-card-footer', BCardFooter)
Vue.component('b-card-header', BCardHeader)
Vue.component('b-card-img', BCardImg)
Vue.component('b-table', BTable)
