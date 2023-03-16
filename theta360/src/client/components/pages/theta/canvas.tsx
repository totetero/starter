
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import { start, close, } from "./shader";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class Manager {
    // マウント時に呼ばれる処理
    public onMount(canvas: HTMLCanvasElement | null): void {
        if (canvas === null) { return; }
        start(canvas);
    }

    // アンマウント時に呼ばれる処置
    public onUnmount(): void {
        close();
    }
}
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

interface ComponentProps {
    width: number;
    height: number;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<ComponentProps> = (props: ComponentProps): JSX.Element => {
    const refCanvas: React.MutableRefObject<HTMLCanvasElement | null> = React.useRef(null);

    // 開発時のStrictModeではコンポーネントが2回呼ばれる
    // 副作用の調査のためにマウント直後に一旦アンマウントするからである
    // そこで、即座にアンマウントした場合は処理を行わないようにする
    React.useEffect((): () => void => {
        let isIgnore = false;
        let manager: Manager | null = null;
        window.setTimeout((): void => {
            if (!isIgnore) { manager = new Manager(); }
            if (manager !== null) { manager.onMount(refCanvas.current); }
        }, 0);
        return (): void => {
            if (manager === null) { isIgnore = true; }
            if (manager !== null) { manager.onUnmount(); }
        };
    }, []);

    return <canvas
        ref={refCanvas}
        width={props.width}
        height={props.height}
    />;
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

