# read iplog.txt
text = open('iplog.txt').read()
print(len(sorted(set(text.split('\n')))))