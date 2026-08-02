import cx, { type Argument } from "classnames";

/** Единая точка склейки классов внутри админки. */
export default function cn(...args: Argument[]) {
    return cx(...args);
}
