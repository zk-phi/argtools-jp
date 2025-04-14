cat lex.csv | grep -e ",普通名詞" -e ",代名詞" -e ",数詞" -e ",固有名詞,一般" -e ",固有名詞,地名" | cut -f 15,5,6,7 -d "," | nkf -Z | sort | uniq > nouns
cat lex.csv | grep -e ",普通名詞" -e ",代名詞" -e ",数詞" -e ",固有名詞,一般" -e ",固有名詞,地名" | cut -f 14,5,6,7 -d "," | nkf --hiragana | sort | uniq > yomigana
cat lex.csv | grep -e ",動詞" | cut -f 15,5,6,7 -d "," | nkf -Z | sort | uniq > verbs
cat lex.csv | grep -e ",形状詞" -e ",感動詞" -e ",形容詞" -e ",副詞" -e ",連体詞" -e ",接続詞" | cut -f 15,5,6,7 -d "," | nkf -Z | sort | uniq > adjectives
cat lex.csv | grep -e ",固有名詞,人名" | cut -f 15,5,6,7 -d "," | nkf -Z | sort | uniq > propers
