# Phaser Engines Project

## Overview
This is a project that is to be injected into a Phaser like browser based run-time editor and runtime.
The project supports different engines that wrap around the Phaser functionalities for beginners to learn programming.
The engine has core and separate engines that extend it.
The project uses Phaser 3 injected via html.

---

## Prerequisites
- Latest typescript installed globally on the system. It is needed to generate the d.ts files. 
- Nothing more is needed, the project has no node modules, no server, just vanialla js
- The d.ts files are needed for auto-complete and no errors displayed in Monaco editor run time in the browser.

## Install
* `npm install -g typescript`  

## Generate the d.ts
* `tsc -p tsconfig.json`  
  This will generate all needed d.ts files under types folder.
