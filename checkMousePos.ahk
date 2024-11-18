#Requires AutoHotkey v2.0
#SingleInstance Force

checkPosition() {
	MouseGetPos &mouseX, &mouseY
	ToolTip("X:" mouseX " Y:" mouseY, mouseX, mouseY)
	return
}

F4:: {
	checkPosition()
	return
}	

Esc:: {
	ExitApp
}