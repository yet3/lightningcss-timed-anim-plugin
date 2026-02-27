import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";

const root = document.getElementById("app");
if (!root) {
	throw Error("App's root element is not defined!");
}

const app = mount(App, {
	target: root,
});

export default app;
