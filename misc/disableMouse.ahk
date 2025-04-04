#Requires AutoHotkey v2.0
#SingleInstance Force

CoordMode "Mouse", "Screen" 
Loop
{
    MouseMove 0, 0, 0 ; Utrzymuje mysz w jednym miejscu
    Sleep 5 ; Małe opóźnienie, aby zmniejszyć obciążenie CPU
}
