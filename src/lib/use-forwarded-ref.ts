import type React from "react";
import { useEffect, useRef } from "react";

/**
 * Custom hook to manage forwarded refs.
 * Ensures that the inner reference is always up-to-date with the forwarded ref.
 *
 * @param ref - A forwarded ref from React.forwardRef
 * @returns A mutable ref object
 */
export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
    const innerRef = useRef<T>(null); // Create an internal ref

    useEffect(() => {
        if (!ref) return; // Ensure the ref is valid before assigning

        if (typeof ref === "function") {
            ref(innerRef.current); // If ref is a function, call it with the current ref value
        } else {
            (ref as React.MutableRefObject<T | null>).current = innerRef.current; // Assign value if ref is an object
        }
    }, [ref]); // Only re-run when `ref` changes

    return innerRef;
}
