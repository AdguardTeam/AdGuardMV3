import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const TOOLTIP_EDGE_PADDING = 4; // px

type Position = {
    x: number,
    y: number,
};

const getCssString = (position: Position, visible: boolean) => {
    const { x, y } = position;
    let css = `z-index:999;position:absolute;top:${y}px;left:${x}px;`;
    if (!visible) {
        css += 'visibility:hidden;';
    }
    return css;
};

type AttachmentPortalProps = {
    rootId: string,
    position: Position,
    children: JSX.Element
};

export const AttachmentPortal = ({ rootId, position, children }: AttachmentPortalProps) => {
    const parent = document.getElementById(rootId);
    const ref = useRef(document.createElement('div'));

    useEffect(() => {
        const el = ref.current;
        el.setAttribute('style', getCssString(position, false));
        parent?.appendChild(el);
        const rect = el.getBoundingClientRect();

        const offsetEdge = {
            top: rect.y,
            right: window.innerWidth - rect.right,
            bottom: window.innerHeight - rect.bottom,
            left: rect.x,
        };

        const nextPosition = { ...position };

        if (offsetEdge.right < TOOLTIP_EDGE_PADDING) {
            nextPosition.x = rect.x + offsetEdge.right - TOOLTIP_EDGE_PADDING;
        }

        if (offsetEdge.left < TOOLTIP_EDGE_PADDING) {
            nextPosition.x = rect.x - offsetEdge.left + TOOLTIP_EDGE_PADDING;
        }

        if (offsetEdge.top < TOOLTIP_EDGE_PADDING) {
            nextPosition.y = rect.y - offsetEdge.top + TOOLTIP_EDGE_PADDING;
        }

        if (offsetEdge.bottom < TOOLTIP_EDGE_PADDING) {
            nextPosition.y = rect.y + offsetEdge.bottom - TOOLTIP_EDGE_PADDING;
        }

        el.setAttribute('style', getCssString(nextPosition, true));

        return () => {
            parent?.removeChild(el);
        };
    }, [ref, parent, position]);

    return createPortal(children, ref.current);
};
