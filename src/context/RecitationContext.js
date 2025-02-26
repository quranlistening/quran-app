import { createContext } from "react";

/**
 * RecitationContext:
 * A simple context object that holds global states and methods.
 * The actual state values are populated in RecitationProvider.js
 */
const RecitationContext = createContext(null);

export default RecitationContext;