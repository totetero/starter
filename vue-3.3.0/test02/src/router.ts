import Vue from 'vue';
import Router from 'vue-router';
import PageTop from './pageTop/PageTop.vue';
import PageTest from './pageTest/PageTest.vue';
import PagePuppet from './pagePuppet/PagePuppet.vue';

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
		{path: '/puppet', component: PagePuppet,},
	],
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
