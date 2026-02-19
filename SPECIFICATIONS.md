
# Header Section (Metadata)

title: Name of the song.
artist: Name of the artist/group.
tempo: Tempo in BPM (Beats Per Minute). Default value is 120.
tuning: Tuning of the guitar from lowest string to highest string. Default tuning is standard.
capo: Position of the capo on the guitar.
time: Time signature (Beats per bar/type or beat).

Example

title: Stairway to Heaven
artist: Led Zeppelin
tempo: 120
tuning: E A D G B E
capo: 2
time: 4/4

# Body Section (Tablature)

## Tablature representation

We will take this for example :

e|-----------------------------------|-----------------------------------|
B|-1---------1-----0---------0-------|-3---------3-----1---------1-------|
G|-------0-------0-------0-------0---|-------0-------0-------0-------0---|
D|-----2-------2-------2-------2-----|-----2-------2-------2-------2-----|
A|-3-------3-------3-------3---------|-3-------3-------3-------3---------|
E|-----------------------------------|-----------------------------------|

The letters are placed at the begenning of every line of the whole file to make it easier to read and help with debugging/parsing.

We then start with a vertical bar. We do not add spaces since it would make it more complex to parse. And we do not put two columns of vertical bars since those are only used for section delimitation (see below).

The measure is ended with vertical bars at the end.

Measures contain the notes. The first two notes of the first section is a C on 3th fret of A string and a C on 1st fret of B string.

The first and last column of each section is ignored. These cannot contain notes. They can however contain special characters like repeat (see below).

## Hammer-On


## Pull-Off



