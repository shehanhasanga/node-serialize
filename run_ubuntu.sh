#!/bin/bash

#/home/carlos/Desktop/frameworkjsnode

printf "What is the SERVER directory path(frameworkjsnode folder)?  ->"
read ProjectPath
gnome-terminal -e "node $ProjectPath/lib/Server.js"
sleep 3
gnome-terminal -e "node $ProjectPath/lib/Middleware.js"
#sleep 3
#gnome-terminal -e "node $ProjectPath/lib/Middleware.js"
#sleep 3
#gnome-terminal -e "node $ProjectPath/lib/Middleware.js -a ../test/empty.js"
exit 0
