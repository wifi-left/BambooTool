@echo off
echo Starting the Building...
echo 1.Move package...

move package.json package.json.tmp

echo 1.Moving package.json...
echo Starting the Building...

echo 2.Copying package.json...

copy "buildnsis\package.json" "package.json.moved"
move package.json.moved package.json
echo 3.Run 'electron-builder' ...
call electron-builder

echo 4.Deleting 'package.json' ...
del package.json

echo 5.Reseting 'package.json' ...
move package.json.tmp package.json