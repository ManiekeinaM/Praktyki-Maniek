#Requires AutoHotkey v2.0
#SingleInstance Force

SetTitleMatchMode(2)

; Disable all Ctrl shortcuts
^a::return
^b::return
^d::return
^e::return
^f::return
^g::return
^h::return
^i::return
^j::return
^k::return
^l::return
^m::return
^n::return
^o::return
^p::return
^q::return
^r::return
^s::return
^t::return
^u::return
^w::return
^x::return
^y::return
^z::return
^1::return
^2::return
^3::return
^4::return
^5::return
^6::return
^7::return
^8::return
^9::return
^0::return
^Esc::return
^Tab::return
^Enter::return
^Space::return
^Backspace::return
^Delete::return
^Insert::return
^Home::return
^End::return
^PgUp::return
^PgDn::return
^Up::return
^Down::return
^Left::return
^Right::return

; Disable all Ctrl+Shift shortcuts
^+a::return
^+b::return
^+c::return
^+d::return
^+e::return
^+f::return
^+g::return
^+h::return
^+i::return
^+j::return
^+k::return
^+l::return
^+m::return
^+n::return
^+o::return
^+p::return
^+q::return
^+r::return
^+s::return
^+t::return
^+u::return
^+v::return
^+w::return
^+x::return
^+y::return
^+z::return
^+1::return
^+2::return
^+3::return
^+4::return
^+5::return
^+6::return
^+7::return
^+8::return
^+9::return
^+0::return
^+Esc::return
^+Tab::return
^+Enter::return
^+Space::return
^+Backspace::return
^+Delete::return
^+Insert::return
^+Home::return
^+End::return
^+PgUp::return
^+PgDn::return
^+Up::return
^+Down::return
^+Left::return
^+Right::return

; Disable all Alt shortcuts except Alt+F4
!a::return
!b::return
!c::return
!d::return
!e::return
!f::return
!g::return
!h::return
!i::return
!j::return
!k::return
!l::return
!m::return
!n::return
!o::return
!p::return
!q::return
!r::return
!s::return
!t::return
!u::return
!v::return
!w::return
!x::return
!y::return
!z::return
!1::return
!2::return
!3::return
!4::return
!5::return
!6::return
!7::return
!8::return
!9::return
!0::return
!Esc::return
!Tab::return
!Enter::return
!Space::return
!Backspace::return
!Delete::return
!Insert::return
!Home::return
!End::return
!PgUp::return
!PgDn::return
!Up::return
!Down::return
!Left::return
!Right::return

; Shift
+Esc::return
+Tab::return
+Enter::return
+Space::return
+Backspace::return
+Delete::return
+Insert::return
+Home::return
+End::return
+PgUp::return
+PgDn::return
+Up::return
+Down::return
+Left::return
+Right::return

; Ctrl Alt
^!Delete::return
^!Esc::return
^!Tab::return
^!Enter::return
^!Space::return
^!Backspace::return
^!Insert::return
^!Home::return
^!End::return
^!PgUp::return
^!PgDn::return
^!Up::return
^!Down::return
^!Left::return
^!Right::return

; Numpad
Numpad0::return
Numpad1::return
Numpad2::return
Numpad3::return
Numpad4::return
Numpad5::return
Numpad6::return
Numpad7::return
Numpad8::return
Numpad9::return
NumpadDot::return
NumpadDiv::return
NumpadMult::return
NumpadAdd::return
NumpadSub::return
NumpadEnter::return
NumpadDel::return

Shift::return
Ctrl::return

^=::return
^-::return
^+=::return
^+-::return
!+::return
!-::return

; Allow Alt+F4


; Procedural Logic
WinWait("Maniek - Mapa")
WinActivate("Maniek - Mapa")
WinWaitActive("Maniek - Mapa")

WinWait("Maniek - TV Player")
WinActivate("Maniek - TV Player")
WinWaitActive("Maniek - TV Player")

WinWait("Maniek - Mapa")
WinActivate("Maniek - Mapa")
WinWaitActive("Maniek - Mapa")