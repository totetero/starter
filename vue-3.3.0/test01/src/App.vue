<template>
	<div id="app">
		<div>Hello App!</div>
		<router-link to="/counter">Go to Counter</router-link>
		<router-link to="/reverse">Go to Reverse</router-link>
		<div><router-view /></div>
		<ComponentBack />
	</div>
</template>

<script lang="ts">
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	import {Component, Vue,} from 'vue-property-decorator';
	import ComponentBack from './partsCommon/ComponentBack.vue';

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	@Component({
		components: {
			ComponentBack,
		},
	})
	export default class PageCounter extends Vue{}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
</script>

<style lang="scss">
</style>
