
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import yoga, {
	Node,
	YogaNode,
	Layout,
	FLEX_DIRECTION_ROW,
	ALIGN_CENTER,
	JUSTIFY_CENTER,
	DIRECTION_LTR,
	YogaFlexDirection,
	YogaAlign,
	YogaJustifyContent,
} from "yoga-layout";

// jsxによる要素作成
const createElement = (type: string, props: {
	width: number;
	height: number;
	flexDirection: YogaFlexDirection;
	justifyContent: YogaJustifyContent;
	alignItems: YogaAlign;
}, ...children: YogaNode[]): YogaNode => {
	const node: YogaNode = Node.create();
	props && props.width && node.setWidth(props.width);
	props && props.height && node.setHeight(props.height);
	props && props.flexDirection && node.setFlexDirection(props.flexDirection);
	props && props.justifyContent && node.setJustifyContent(props.justifyContent);
	props && props.alignItems && node.setAlignItems(props.alignItems);
	children && children.forEach((child: YogaNode, index: number): void => node.insertChild(child, index));
	return node;
};

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	// キャンバス作成
	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.width = 500;
	canvas.height = 300;
	document.body.appendChild(canvas);
	const context: CanvasRenderingContext2D = canvas.getContext("2d");

	// jsxによる要素作成
	const root: YogaNode = (
		<div
			width={canvas.width}
			height={canvas.height}
			flexDirection={FLEX_DIRECTION_ROW}
			justifyContent={JUSTIFY_CENTER}
			alignItems={ALIGN_CENTER}
		>
			<div width={100} height={100}></div>
			<div width={100} height={100}></div>
		</div>
	);

	// ヨガ計算
	root.calculateLayout(canvas.width, canvas.height, DIRECTION_LTR);

	// ヨガ計算の結果を描画
	const recursiveDraw = (node: YogaNode): void => {
		const layout: Layout = node.getComputedLayout();
		context.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
		context.fillRect(layout.left, layout.top, layout.width, layout.height);
		const count = node.getChildCount();
		for(let i = 0; i < count; i++){
			const child: YogaNode = node.getChild(i);
			child && recursiveDraw(child);
		}
	}
	recursiveDraw(root);
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

