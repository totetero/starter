import Vue from 'vue';
import Router from 'vue-router';
import PageCounter from './PageCounter.vue';
import PageReverse from './PageReverse.vue';

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{path: '/counter', component: PageCounter,},
		{path: '/reverse', component: PageReverse,},
	],
})

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
