#Requires AutoHotkey v2.0
#SingleInstance Force

SetTitleMatchMode(2)

^w:: {
    return
}
!Tab:: {
    return
}
^+Esc:: {
    return
}
^+t:: {
    return
}
^t:: {
    return
}
; ctrl+n
^n:: {
    return
}
^+Delete::{
    return
}


; Proces myślenia: jak najpierw włączy się mapa, potem TV, potem mapa ponownie - mapa zawsze będzie zfokusowana, a jak TV nie zostało włączone - zawiesi się i to również nie jest problem
WinWait("Maniek - Mapa")
WinActivate("Maniek - Mapa")
WinWaitActive("Maniek - Mapa")

WinWait("Maniek - TV Player")
WinActivate("Maniek - TV Player")
WinWaitActive("Maniek - TV Player")

WinWait("Maniek - Mapa")
WinActivate("Maniek - Mapa")
WinWaitActive("Maniek - Mapa")