import os
import requests
from minio import Minio
from minio.error import S3Error
from dotenv import load_dotenv

load_dotenv()

MINIO_HOSTNAME = f"{os.environ.get('MINIO_HOST')}:{os.environ.get('MINIO_PORT')}"
ACCESS_KEY_ID = os.environ.get('MINIO_ACCESS_KEY')
SECRET_ACCESS_KEY = os.environ.get('MINIO_SECRET_KEY')
MUSIC_LIBRARY_DIRECTORY = "library"
BUCKET_NAME = os.environ.get('MUSIC_LIBRARY_BUCKET_NAME')
MUSIC_LIBRARY_MS = 'http://localhost:3011'

print(MINIO_HOSTNAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY)

def create_genre(genre):
    res = requests.post(f"{MUSIC_LIBRARY_MS}/genres", data={'name': genre}) 
    return res.json()

def create_artist(artist):
    res = requests.post(f"{MUSIC_LIBRARY_MS}/artists", data={'name': artist, 'biography': 'n/a', 'photo': f'{artist}/cover.jpg'}) 
    return res.json()

def create_album(artist, album):
    data = {
        'title': album, 
        'artistId': artist['id'], 
        'photo': f'{artist["name"]}/{album}/cover.jpg',
        'year': 2021,
    }
    res = requests.post(f"{MUSIC_LIBRARY_MS}/albums", json=data)
    return res.json()


def create_song(genre, artist, album, song):
    data = {
        'albumId': album['id'], 
        'artistId': artist['id'], 
        'genreId': genre['id'],
        'title': song['object'].split('/')[3].split('.')[0],
        'video': '',
        'duration': 100,
        'plays': 1,
        'storage': song['object']
    }
    res = requests.post(f"{MUSIC_LIBRARY_MS}/songs", json=data)
    return res.json()

def get_music_library_resources(directory):
    resources = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.jpg', 'jpeg', 'png', 'webp')) or file.endswith('.mp3'):
                object_name = f"{root}/{file}".replace(directory, '')
                filepath = os.path.join(root, file)
                resource = {
                    'object': object_name[1:], 
                    'filepath': filepath,
                    'type': 'audio' if file.endswith('.mp3') else 'image'
                }
                resources.append(resource)
    return resources

resources = get_music_library_resources(MUSIC_LIBRARY_DIRECTORY)
songs = [resource for resource in resources if resource['type'] == 'audio']


def build_library(songs):
    library = dict()
    for song in songs:
        genre = song['object'].split('/')[0]
        artist = song['object'].split('/')[1]
        album = song['object'].split('/')[2]
        if genre not in library:
            library[genre] = dict()
            library[genre][artist] = dict()
            library[genre][artist][album] = []
        if artist not in library[genre]:
            library[genre][artist] = dict()
            library[genre][artist][album] = []
        if album not in library[genre][artist]:
            library[genre][artist][album] = []
        library[genre][artist][album].append(song)
    return library
    

def save_library(library):
    for genre_name, genres in library.items():
        saved_genre = create_genre(genre_name)
        for artist_name, artists in genres.items():
            saved_artist = create_artist(artist_name)
            for album_name, album in artists.items():
                saved_album = create_album(saved_artist, album_name)
                for song in album:
                    res = create_song(saved_genre, saved_artist, saved_album, song)
                    print(f"saved {res['title']}")
    

def main():
    # init client
    client = Minio(
        MINIO_HOSTNAME,
        secure=False,
        access_key=ACCESS_KEY_ID,
        secret_key=SECRET_ACCESS_KEY
    )
    # verify bucket
    if not client.bucket_exists(BUCKET_NAME):
        client.make_bucket(BUCKET_NAME)
    else:
        print(f"{BUCKET_NAME} already exists")

    resource = get_music_library_resources(MUSIC_LIBRARY_DIRECTORY)
    songs = [resource for resource in resource if resource['type'] == 'audio']
    library = build_library(songs)
    save_library(library)
    for resource in resources:
        client.fput_object(BUCKET_NAME, resource['object'], resource['filepath'])




if __name__ == "__main__":
    try:
        main()
    except S3Error as exc:
        print("error occurred.", exc)