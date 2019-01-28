<template>
	<button @click="increment">counter {{count}}</button>
</template>

<script lang="ts">
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	import {Component, Vue,} from 'vue-property-decorator';
	import {getterCount, actionIncrement,} from './ModuleCounter';

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	@Component({
		components: {
		},
	})
	export default class PageCounter extends Vue{
		private get count(): number{
			return this.$store.getters[getterCount];
		}
		private increment(): void{
			this.$store.dispatch(actionIncrement);
		}
	}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
</script>

<style lang="scss">
</style>
