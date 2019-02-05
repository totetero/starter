import Vue from 'vue';
import Router from 'vue-router';
import PageTop from './pageTop/PageTop.vue';
import PageTest from './pageTest/PageTest.vue';
import PageVector from './pageVector/PageVector.vue';

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{path: '/', component: PageTop,},
		{path: '/test', component: PageTest,},
		{path: '/vector', component: PageVector,},
	],
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
