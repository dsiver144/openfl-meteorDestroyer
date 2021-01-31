
import Stage from "openfl/display/Stage";
import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import Input from "./Input";
import Main from "./Main";

var stage = new Stage (416, 768, 0xAAAAAA);
document.body.appendChild(stage.element);
stage.x = (stage.windowWidth - stage.stageWidth) / 2;
var main = new Main ();
stage._main = main;
stage.addChild (main);
// Game Loop
stage.addEventListener (Event.ENTER_FRAME, (e) => {
	main.update();
})
// Handle Input
stage.addEventListener(KeyboardEvent.KEY_DOWN, (e) => {
	main.updateInput('down', e);
});
stage.addEventListener(KeyboardEvent.KEY_UP, (e) => {
	main.updateInput('up', e);
});