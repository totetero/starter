import Vue from 'vue';
import Router from 'vue-router';
import PageVector from './pageVector/PageVector.vue';

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{path: '/', component: PageVector,},
	],
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
