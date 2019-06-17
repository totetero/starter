
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";

// 情報構造体
interface Props extends React.Props<void>{
}

// 状態構造体
interface State{
}

// コンポーネント
export default class Component extends React.Component<Props, State>{
	// プロパティ初期値
	static defaultProps: Props = {
	};

	// コンストラクタ
	constructor(props: Props){
		super(props);
		// 状態設定
		this.state = {
		};
	}

	// レンダー
	public render(): JSX.Element{
		return(
			<div>test</div>
		);
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

