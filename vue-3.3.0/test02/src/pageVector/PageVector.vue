<template>
	<div>
		<svg viewbox="0 0 300 300" width="300" height="300">
			<rect x="10" y="10" width="90" height="90" stroke="black" stroke-width="1" fill="none" />
			<line x1="100" y1="100" x2="200" y2="200" stroke="black" />
			<circle :cx="100 + parseInt(param1, 10)" :cy="100 + parseInt(param1, 10)" r="25" fill="#06f" />
		</svg>
		<div><input type="range" min="0" max="100" v-model="param1"></div>
		<ComponentButton>あいうえお</ComponentButton>
	</div>
</template>

<script lang="ts">
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	import {Component, Vue,} from 'vue-property-decorator';
	import ComponentButton from '../partsCommon/ComponentButton.vue';

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	@Component({
		components: {
			ComponentButton,
		},
	})
	export default class PageVector extends Vue{
		private param1: number = 0;
	}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
</script>

<style lang="scss">
</style>
