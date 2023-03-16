
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import { calc, draw, } from "./shader";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class Manager {
    private image: HTMLImageElement | null = null;
    private handle: number = -1;

    // マウント時に呼ばれる処理
    public onMount(image: HTMLImageElement | null): void {
        if (image === null) { return; }
        this.image = image;
        this.mainloop();
    }

    // 常に呼ばれ続ける処理
    private mainloop(): void {
        calc(this.image);
        draw();
        this.handle = window.requestAnimationFrame((): void => this.mainloop());
    }

    // アンマウント時に呼ばれる処置
    public onUnmount(): void {
        window.cancelAnimationFrame(this.handle);
    }
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

interface ComponentProps {
    src: string;
    width: number;
    height: number;
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<ComponentProps> = (props: ComponentProps): JSX.Element => {
    const refImage: React.MutableRefObject<HTMLImageElement | null> = React.useRef(null);

    // 開発時のStrictModeではコンポーネントが2回呼ばれる
    // 副作用の調査のためにマウント直後に一旦アンマウントするからである
    // そこで、即座にアンマウントした場合は処理を行わないようにする
    React.useEffect((): () => void => {
        let isIgnore = false;
        let manager: Manager | null = null;
        window.setTimeout((): void => {
            if (!isIgnore) { manager = new Manager(); }
            if (manager !== null) { manager.onMount(refImage.current); }
        }, 0);
        return (): void => {
            if (manager === null) { isIgnore = true; }
            if (manager !== null) { manager.onUnmount(); }
        };
    }, []);

    return <img
        ref={refImage}
        src={props.src}
        width={props.width}
        height={props.height}
    />;
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

