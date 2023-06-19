import random
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np



# Define your number range
numbers = list(range(1, 100))

# Create an empty list to hold your sets
sets = []

# Generate 15 sets, define the amount of playboards here
for _ in range(15):
    # Use random.sample to get a unique set of 16 numbers
    random_set = random.sample(numbers, 16)
    # Append this set to your list of sets
    sets.append(random_set)

# Print the sets
for i, set in enumerate(sets):
    print(f"Set {i+1}: {set}")



# Load the csv file into a pandas DataFrame. File needs to be in directory root.
df = pd.read_csv('songs2.csv', delimiter=";")

# Convert the DataFrame to a dictionary for easy lookups
songs_dict = df.set_index('num').T.to_dict('list')

# Map the sets of numbers to songs
song_sets = [[songs_dict[num] for num in num_set] for num_set in sets]

# Print the song sets in a 4x4 grid format
for i, song_set in enumerate(song_sets):
    print(f"Set {i+1}:")
    for j in range(0, 16, 4):
        print(song_set[j:j+4])
    print()

# Select only the artist name for each song, and include the index number
artist_sets = [[f"{num}.\n {song[1]}" for num, song in zip(sets[i], song_set)] for i, song_set in enumerate(song_sets)]

# Create the grids for Artists

# Create the grids and save them as .jpg files
for i, song_set in enumerate(artist_sets):
    # Convert each set into a 4x4 numpy array for easy visualization
    artist_grid = np.array(song_set).reshape(4, 4)

    # Create a figure and axis
    fig, ax = plt.subplots()

    # Remove x and y axis
    ax.xaxis.set_visible(False)
    ax.yaxis.set_visible(False)

    # Turn off the frame
    ax.set_frame_on(False)

    # Create a table and fill it with the artists
    tbl = plt.table(cellText=artist_grid, cellLoc = 'center', loc='center', bbox=[0, 0, 1, 1])

    # Set the fontsize to fit the artists nicely into the cells
    tbl.auto_set_font_size(False)
    tbl.set_fontsize(8)

    # Save the figure as a .jpg file
    plt.savefig(f"Set_{i+1}.jpg")

# Create the grids for Songs

# Select only the song name for each song, and include the index number
song_sets = [[f"{num}.\n {song[0]}" for num, song in zip(sets[i], song_set)] for i, song_set in enumerate(song_sets)]

# Create the grids and save them as .jpg files
for i, song_set in enumerate(song_sets):
    # Convert each set into a 4x4 numpy array for easy visualization
    song_grid = np.array(song_set).reshape(4, 4)

    # Create a figure and axis
    fig, ax = plt.subplots()

    # Remove x and y axis
    ax.xaxis.set_visible(False)
    ax.yaxis.set_visible(False)

    # Turn off the frame
    ax.set_frame_on(False)

    # Create a table and fill it with the song names
    tbl = plt.table(cellText=song_grid, cellLoc = 'center', loc='center', bbox=[0, 0, 1, 1])

    # Set the fontsize to fit the song names nicely into the cells
    tbl.auto_set_font_size(False)
    tbl.set_fontsize(6)

    # Save the figure as a .jpg file
    plt.savefig(f"Song_Set_{i+1}.jpg")

print("Success.")
