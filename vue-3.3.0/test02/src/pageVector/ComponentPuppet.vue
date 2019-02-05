<template>
	<g>
		<template v-for="param in [{r: 2.0, c: '#000000',}, {r: 0.0, c: '#ffffff',}]">
			<circle
				v-for="part in parts"
				:cx="part[0]"
				:cy="part[1]"
				:r="part[2] + param.r"
				:fill="param.c"
			/>
		</template>
	</g>
</template>

<script lang="ts">
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	import {Component, Vue, Prop,} from 'vue-property-decorator';
	import {
		getterStep,
		getterWidth,
		getterHeight,
		getterRadiusScale,
		getterMatrix,
		mutationStepAdd,
		mutationRadiusScaleSet,
		mutationMatrixSet,
	} from './ModuleVector';
	import {mat4, vec4,} from 'gl-matrix';

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	// パペットパーツクラス
	class PuppetParts{
		public x: number;
		public y: number;
		public z: number;
		public r: number;
		public v: vec4 = vec4.create();
		// コンストラクタ
		constructor(r: number){
			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.r = r;
		}
		// 出力関数
		public export(mat: mat4, scale: number): number[]{
			vec4.set(this.v, this.x, this.y, this.z, 1.0);
			vec4.transformMat4(this.v, this.v, mat)
			return [
				this.v[0] / this.v[3],
				this.v[1] / this.v[3],
				this.r * scale / this.v[3],
			];
		}
	}

	// パペットクラス
	class Puppet{
		// パーツ情報
		private partsFotR: PuppetParts = new PuppetParts(0.3);
		private partsFotL: PuppetParts = new PuppetParts(0.3);
		private partsBody: PuppetParts = new PuppetParts(0.5);
		private partsHndR: PuppetParts = new PuppetParts(0.2);
		private partsHndL: PuppetParts = new PuppetParts(0.2);
		private partsFace: PuppetParts = new PuppetParts(0.6);

		// パーツ角度
		private head1Cos: number = 0;
		private head1Sin: number = 0;
		private hndr1Cos: number = 0;
		private hndr1Sin: number = 0;
		private hndl1Cos: number = 0;
		private hndl1Sin: number = 0;
		private fotr1Cos: number = 0;
		private fotr1Sin: number = 0;
		private fotl1Cos: number = 0;
		private fotl1Sin: number = 0;
		private hndr2Cos: number = 0;
		private hndr2Sin: number = 0;
		private hndl2Cos: number = 0;
		private hndl2Sin: number = 0;
		private fotr2Cos: number = 0;
		private fotr2Sin: number = 0;
		private fotl2Cos: number = 0;
		private fotl2Sin: number = 0;

		// ステータスウエイト
		private statusWeightStand: number = 1.0;
		private statusWeightRun: number   = 0.0;

		// コンストラクタ
		constructor(){
			// 手のz軸角度
			this.hndr1Cos = Math.cos(0 * Math.PI / 180);
			this.hndr1Sin = Math.sin(0 * Math.PI / 180);
			this.hndl1Cos = Math.cos(0 * Math.PI / 180);
			this.hndl1Sin = Math.sin(0 * Math.PI / 180);
			// 足のz軸角度
			this.fotr1Cos = Math.cos(60 * Math.PI / 180);
			this.fotr1Sin = Math.sin(60 * Math.PI / 180);
			this.fotl1Cos = Math.cos(60 * Math.PI / 180);
			this.fotl1Sin = Math.sin(60 * Math.PI / 180);
		}

		public update(step: number): void{
			// 体のx軸角度
			const theta01: number = (0 * this.statusWeightStand + 30 * this.statusWeightRun) * Math.PI / 180;
			this.head1Cos = Math.cos(theta01);
			this.head1Sin = Math.sin(theta01);
			// 手のy軸振り
			const swing: number = Math.sin((9 * step) * Math.PI / 180);
			const theta02: number = (0 * this.statusWeightStand + 30 * swing * this.statusWeightRun) * Math.PI / 180;
			this.hndr2Cos = Math.cos(theta02);
			this.hndr2Sin = Math.sin(theta02);
			this.hndl2Cos =  this.hndr2Cos;
			this.hndl2Sin = -this.hndr2Sin;
			// 足のx軸振り
			this.fotr2Cos = this.hndl2Cos;
			this.fotr2Sin = this.hndl2Sin;
			this.fotl2Cos = this.hndr2Cos;
			this.fotl2Sin = this.hndr2Sin;
			// ジャンプ
			const jump: number = this.statusWeightRun * 0.3 * Math.abs(swing);

			// 体
			const rf: number = this.partsFotR.r + (this.partsBody.r + this.partsFotR.r * 0.7) * this.fotr1Sin * this.fotr2Cos;
			const lf: number = this.partsFotL.r + (this.partsBody.r + this.partsFotL.r * 0.7) * this.fotl1Sin * this.fotl2Cos;
			const rh: number = this.partsHndR.r - (this.partsBody.r + this.partsHndR.r * 0.5) * this.hndr2Cos * this.hndr1Sin;
			const lh: number = this.partsHndL.r - (this.partsBody.r + this.partsHndL.r * 0.5) * this.hndl2Cos * this.hndl1Sin;
			this.partsBody.x = 0.0;
			this.partsBody.y = Math.max(this.partsBody.r, rf, lf, rh, lh) + jump;
			this.partsBody.z = 0.0;
			// 両足
			this.partsFotR.x = this.partsBody.x + (this.partsBody.r + this.partsFotR.r * 0.7) * this.fotr1Cos;
			this.partsFotR.y = this.partsBody.y - (this.partsBody.r + this.partsFotR.r * 0.7) * this.fotr1Sin * this.fotr2Cos;
			this.partsFotR.z = this.partsBody.z + (this.partsBody.r + this.partsFotR.r * 0.7) * this.fotr1Sin * this.fotr2Sin;
			this.partsFotL.x = this.partsBody.x - (this.partsBody.r + this.partsFotL.r * 0.7) * this.fotl1Cos;
			this.partsFotL.y = this.partsBody.y - (this.partsBody.r + this.partsFotL.r * 0.7) * this.fotl1Sin * this.fotl2Cos;
			this.partsFotL.z = this.partsBody.z + (this.partsBody.r + this.partsFotL.r * 0.7) * this.fotl1Sin * this.fotl2Sin;
			// 両手
			this.partsHndR.x = this.partsBody.x + (this.partsBody.r + this.partsHndR.r * 0.5) * this.hndr2Cos * this.hndr1Cos;
			this.partsHndR.y = this.partsBody.y + (this.partsBody.r + this.partsHndR.r * 0.5) * this.hndr2Cos * this.hndr1Sin;
			this.partsHndR.z = this.partsBody.z + (this.partsBody.r + this.partsHndR.r * 0.5) * this.hndr2Sin;
			this.partsHndL.x = this.partsBody.x - (this.partsBody.r + this.partsHndL.r * 0.5) * this.hndl2Cos * this.hndl1Cos;
			this.partsHndL.y = this.partsBody.y + (this.partsBody.r + this.partsHndL.r * 0.5) * this.hndl2Cos * this.hndl1Sin;
			this.partsHndL.z = this.partsBody.z + (this.partsBody.r + this.partsHndL.r * 0.5) * this.hndl2Sin;
			// 顔
			this.partsFace.x = this.partsBody.x;
			this.partsFace.y = this.partsBody.y + (this.partsBody.r + this.partsFace.r * 0.7) * this.head1Cos;
			this.partsFace.z = this.partsBody.z + (this.partsBody.r + this.partsFace.r * 0.7) * this.head1Sin;
		}

		// 出力関数
		public export(mat: mat4, scale: number): number[][]{
			return [
				this.partsFotR.export(mat, scale),
				this.partsFotL.export(mat, scale),
				this.partsBody.export(mat, scale),
				this.partsHndR.export(mat, scale),
				this.partsHndL.export(mat, scale),
				this.partsFace.export(mat, scale),
			];
		}
	}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	@Component({
		components: {
		},
	})
	export default class ComponentPuppet extends Vue{
		@Prop({type: Number, required: true,})
		private x!: number;

		@Prop({type: Number, required: true,})
		private y!: number;

		@Prop({type: Number, required: true,})
		private r!: number;

		@Prop({type: Number, default: 1,})
		private scale!: number;

		private pupprt: Puppet = new Puppet();

		private get parts(): number[][]{
			const tempMat1: mat4 = mat4.create();
			mat4.copy(tempMat1, this.$store.getters[getterMatrix]);
			mat4.translate(tempMat1, tempMat1, [this.x, 0, this.y]);
			mat4.rotateY(tempMat1, tempMat1, this.r);
			mat4.scale(tempMat1, tempMat1, [this.scale, this.scale, this.scale]);
			this.pupprt.update(this.$store.getters[getterStep]);
			return this.pupprt.export(tempMat1, this.$store.getters[getterRadiusScale] * this.scale);
		}
	}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
</script>

<style lang="scss">
</style>
