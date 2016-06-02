filename=
while getopts "f:" mopt
do
	case $mopt in
		f)
			filename=$OPTARG;
			;;
		?)
			echo "unkonw argument"
			exit 1
			;;
	esac
done

if [ ! -f "$filename" ]
then
	filename='.node_config';
fi


regArr=();
tempArr=();
i=0;
j=0;
while read line
do
	for item in `echo $line | sed 's/=/ /g'`
	do
		tempArr[$j]=$item;
		j=$j+1;
	done
	j=0;
	i=$i+1;
	regArr[$i]="s/"${tempArr[0]}"/"${tempArr[1]}"/g;";
	echo ${regArr[$i]};
done < "$filename"


regStr="";
for itm in ${regArr[@]}
do
	regStr=$regStr"$itm";
done
regStr=${regStr:0:(${#regStr}-1)};

#if [ ! -d "./build" ]
#then
	#mkdir 'build';
#fi

#cp -R ./src/* ./build;

#for i in `find ./build -name '*.js'`;do sed.exe -i "$regStr" $i;done
for i in `find ./src -name '*.js'`;do sed.exe -i "$regStr" $i;done
