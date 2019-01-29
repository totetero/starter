<template>
	<svg :viewbox="`0 0 ${width} ${height}`" :width="width" :height="height">
		<g class="area">
			<rect
				x="1"
				y="1"
				rx="10"
				ry="10"
				:width="width - 2"
				:height="height - 2"
				stroke="black"
				stroke-width="1"
				fill="#ff0000"
			/>
			<text
				:x="width / 2"
				:y="height / 2"
				font-size="20px"
				text-anchor="middle"
				dominant-baseline="middle"
				fill="black"
			>{{label}}</text>
		</g>
	</svg>
</template>

<script lang="ts">
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	import {Component, Vue, Prop,} from 'vue-property-decorator';

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------

	@Component({
		components: {
		},
	})
	export default class ComponentButton extends Vue{
		@Prop({type: String, default: 'ボタン',})
		private label!: string;

		@Prop({type: Number, default: 120,})
		private width!: number;

		@Prop({type: Number, default: 40,})
		private height!: number;
	}

	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
	// ----------------------------------------------------------------
</script>

<style lang="scss">
.area{
	transform: scale(0.95);
	transform-origin: 50% 50%;
	user-select: none;
	cursor: pointer;
}

.area:hover{
	transform: scale(1.00);
}

.area:active{
	transform: scale(0.90);
}
</style>
