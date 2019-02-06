<template>
	<div>
		<svg :viewbox="`0 0 ${w} ${h}`" :width="w" :height="h">
			<rect x="0" y="0" :width="w" :height="h" fill="red" />
			<template v-for="puppet in puppets">
				<ComponentPuppet :x="puppet.px" :y="puppet.py" :r="puppet.r" />
			</template>
		</svg>
	</div>
</template>

<script lang="ts">
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	import {Component, Vue,} from 'vue-property-decorator';
	import {
		getterStep,
		getterWidth,
		getterHeight,
		getterRadiusScale,
		getterMatrix,
		mutationStepAdd,
		mutationRadiusScaleSet,
		mutationMatrixSet,
	} from './ModulePuppet';
	import {mat4,} from 'gl-matrix';
	import ComponentPuppet from './ComponentPuppet.vue';

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	@Component({
		components: {
			ComponentPuppet,
		},
	})
	export default class PagePuppet extends Vue{
		private puppets: {
			id: number;
			zIndex: number;
			px: number;
			py: number;
			vx: number;
			vy: number;
			r: number;
		}[] = [];

		private get w(): number{return this.$store.getters[getterWidth];}
		private get h(): number{return this.$store.getters[getterHeight];}

		// 作成時処理
		private created(): void{
			this.puppets = Array(9).fill(0).map((zero, index) => {
				const r: number = Math.random() * 2 * Math.PI;
				return {
					id: index,
					zIndex: 0,
					px: 5 * (Math.floor(index % 3) - 1),
					py: 5 * (Math.floor(index / 3) - 1),
					vx: 1 * Math.cos(r),
					vy: 1 * Math.sin(r),
					r: r,
				};
			});
			this.update();
		}

		// フレーム計算
		private update(): void{
			const tempMat1: mat4 = mat4.create();
			const tempMat2: mat4 = mat4.create();
			const tempMat3: mat4 = mat4.create();
			const step: number = this.$store.getters[getterStep];

			// 座標変換行列
			mat4.identity(tempMat1);
			mat4.scale(tempMat1, tempMat1, [this.w * 0.5, this.h * -0.5, 1]);
			mat4.translate(tempMat1, tempMat1, [1, -1, 0]);

			// 透視投影行列
			mat4.perspective(tempMat2, Math.PI / 6, this.w / this.h, 1.0, 1000.0);
			mat4.multiply(tempMat1, tempMat1, tempMat2);
			const radiusScale: number = (Math.abs(tempMat1[0]) + Math.abs(tempMat1[5])) / 2;

			// カメラ行列
			const cr: number = 20;
			const cx: number = cr * Math.sin(0.2 * step * Math.PI / 180);
			const cy: number = cr;
			const cz: number = cr * Math.cos(0.2 * step * Math.PI / 180); 
			mat4.lookAt(tempMat3, [cx, cy, cz], [0, 0, 0], [0, 1, 0]);
			mat4.multiply(tempMat1, tempMat1, tempMat3);

			// パペット計算テスト
			for(let i = 0; i < this.puppets.length; i++){
				if(this.puppets[i].id === 1){
					this.puppets[i].r = step * Math.PI / 180;
				}
			}

			// vueパラメータ反映
			this.$store.commit(mutationStepAdd);
			this.$store.commit(mutationRadiusScaleSet, radiusScale);
			this.$store.commit(mutationMatrixSet, tempMat1);
			this.puppets = this.puppets.map(puppet => Object.assign(puppet, {
				zIndex: tempMat1[2] * puppet.px + tempMat1[10] * puppet.py,
			})).sort((a, b) => b.zIndex - a.zIndex);

			// 次のフレームを準備
			requestAnimationFrame(this.update);
		}
	}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
</script>

<style lang="scss">
</style>
