## TLDR:

Simple tool to create a music bingo card in jpeg with 4 x 4 dimension
from a Spotify playlist.

### How to run:

1. Use for example to create the extract: https://exportify.net to create a list of songs
2. Place songs.csv to folder
3. run with python bingo_generator.py or with notebook

### Specs:

Currently takes in a .csv with 100 songs, number of sets can be modified
Put the songs to num,track,artist format in csv. 

To-do:

- [ ] modify to support the full default export, so no need for cleanup
- [ ] add support to fetch playlist directly from spotify based on id if possible