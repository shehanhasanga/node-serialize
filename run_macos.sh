#!/bin/sh

#./Documents/Workspace_FrameworkJS/frameworkjsnode
printf "What is the SERVER directory path(frameworkjsnode folder)?  ->"
#echo "`dirname $0`"
read ProjectPath
#if [$ProjectPath == '']
#	then
#	ProjectPath = dirname $0
#fi

#agent_move_random_between_host
echo "node $ProjectPath/lib/Server.js" > command0.command; chmod +x command0.command; open command0.command
#sleep 3
#echo "node $ProjectPath/lib/Middleware.js -a ../test/agent_move_random_between_hosts.js" > command1.command; chmod +x command1.command; open command1.command
#sleep 3
#echo "node $ProjectPath/lib/Middleware.js" > command2.command; chmod +x command2.command; open command2.command
sleep 3
echo "node $ProjectPath/lib/Middleware.js" > command3.command; chmod +x command3.command; open command3.command

#open -a Terminal $ProjectPath
#node "$ProjectPath/lib/Server.js"
#echo "pwd: `pwd`"
#echo "\$0: $0"
#echo "basename: `basename $0`"
#echo "dirname: `dirname $0`"
#echo "dirname/readlink: $(dirname $(readlink -f $0))"
exit 0
