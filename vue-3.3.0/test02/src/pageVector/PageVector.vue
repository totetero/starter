<template>
	<div>
		<svg viewbox="0 0 300 300" width="300" height="300">
			<g transform="translate(150, 150)">
				<ComponentPuppet :step="step" :mat="mat" />
			</g>
			<rect x="10" y="10" width="280" height="280" stroke="black" stroke-width="1" fill="none" />
			<line :x1="x0" :y1="y0" :x2="x1" :y2="y1" stroke="black" />
			<line :x1="x1" :y1="y1" :x2="x2" :y2="y2" stroke="black" />
			<line :x1="x2" :y1="y2" :x2="x3" :y2="y3" stroke="black" />
			<line :x1="x3" :y1="y3" :x2="x0" :y2="y0" stroke="black" />
			<circle :cx="x0" :cy="y0" r="10" fill="#06f" />
			<circle :cx="x1" :cy="y1" r="10" fill="#06f" />
			<circle :cx="x2" :cy="y2" r="10" fill="#06f" />
			<circle :cx="x3" :cy="y3" r="10" fill="#06f" />
		</svg>
		<div><input type="range" min="0" max="260" v-model="param1"></div>
		<ComponentButton>あいうえお</ComponentButton>
	</div>
</template>

<script lang="ts">
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	import {Component, Vue,} from 'vue-property-decorator';
	import {mat4,} from 'gl-matrix';
	import ComponentButton from '../partsCommon/ComponentButton.vue';
	import ComponentPuppet from './ComponentPuppet.vue';

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	@Component({
		components: {
			ComponentButton,
			ComponentPuppet,
		},
	})
	export default class PageVector extends Vue{
		private param1: string = '0';
		private step: number = 0;
		private mat: mat4 = mat4.create();

		private get x0(): number{return 20 + parseInt(this.param1, 10);}
		private get y0(): number{return 280;}
		private get x1(): number{return 280;}
		private get y1(): number{return 280 - parseInt(this.param1, 10);}
		private get x2(): number{return 280 - parseInt(this.param1, 10);}
		private get y2(): number{return 20;}
		private get x3(): number{return 20;}
		private get y3(): number{return 20 + parseInt(this.param1, 10);}

		private created(): void{
			this.update();
		}

		private update(): void{
			const tempMat1: mat4 = mat4.create();
			mat4.identity(tempMat1);
			mat4.rotateY(tempMat1, tempMat1, this.step * Math.PI / 180);
			this.mat = tempMat1;
			this.step = this.step + 1;
			requestAnimationFrame(this.update);
		}
	}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
</script>

<style lang="scss">
</style>
