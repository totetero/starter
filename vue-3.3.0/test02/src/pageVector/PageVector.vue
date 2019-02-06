<template>
	<div>
		<svg :viewbox="`0 0 ${w} ${h}`" :width="w" :height="h">
			<rect :x="m" :y="m" :width="wm2" :height="hm2" stroke="black" stroke-width="1" fill="none" />
			<line :x1="x0" :y1="y0" :x2="x1" :y2="y1" stroke="black" />
			<line :x1="x1" :y1="y1" :x2="x2" :y2="y2" stroke="black" />
			<line :x1="x2" :y1="y2" :x2="x3" :y2="y3" stroke="black" />
			<line :x1="x3" :y1="y3" :x2="x0" :y2="y0" stroke="black" />
			<circle :cx="x0" :cy="y0" :r="m" fill="#06f" />
			<circle :cx="x1" :cy="y1" :r="m" fill="#06f" />
			<circle :cx="x2" :cy="y2" :r="m" fill="#06f" />
			<circle :cx="x3" :cy="y3" :r="m" fill="#06f" />
		</svg>
		<div><input type="range" min="0" max="100" v-model="rangeValue"></div>
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
		private w: number = 300;
		private h: number = 300;
		private m: number = 10;
		private rangeValue: string = '50';

		private get rangeRatio(): number{return parseInt(this.rangeValue, 10) / 100;}
		private get wm2(): number{return this.w - this.m * 2;}
		private get hm2(): number{return this.h - this.m * 2;}
		private get wm4(): number{return this.w - this.m * 4;}
		private get hm4(): number{return this.h - this.m * 4;}
		private get x0(): number{return this.m * 2 + this.wm4 * this.rangeRatio;}
		private get y0(): number{return this.hm2;}
		private get x1(): number{return this.wm2;}
		private get y1(): number{return this.hm2 - this.hm4 * this.rangeRatio;}
		private get x2(): number{return this.wm2 - this.wm4 * this.rangeRatio;}
		private get y2(): number{return this.m * 2;}
		private get x3(): number{return this.m * 2;}
		private get y3(): number{return this.m * 2 + this.hm4 * this.rangeRatio;}
	}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
</script>

<style lang="scss">
</style>
