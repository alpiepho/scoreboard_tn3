# ScoreTN3


## Initial Prompt
(Copilot, do not modify this section)
Using Copilot with Agent mode and Claude Sonnet 3.7.

You are a game developer and are requested to convert the scoreboard_tn2, aka ScoresTN2, to a scorebaord_tn3 (this directory), aka ScoresTN3.   The original applications is a PWA written in Flutter. The converted applications should be in typescript and remain a PWA.

- convert Flutter app to Typescript
- create it as a PWA and provide mechanism to install to Github and serve from there
- convert all features of ScoresTN2 except the "Reflector" settings and features
- improve the look and feel of the settings page
- ask any clarifying quesitons

## First Follow up TODO list

- the PWA app needs proper icons.  These can be taken from the scoreboard_tn2
- as a PWA app in portrait oreientation the top button and bottom button are not the same size, causing part of the set circles to be clipped.  need to fix
- the gear icon in landscape and portrait mode are different sizes. they should be the same
- the scoreboard score and labels are too small.  we should add a set of +/- buttons in settings to improve this
- the settings page in landscape mode is too wide, this should be 80% of the width.  the portrait width should be 95%
- we should add some decent screenshots of the app to the README


## REFERENCES
- https://github.com/alpiepho/scoreboard_tn2
- https://alpiepho.github.io/scoreboard_tn2/#/
