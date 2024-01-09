import os
import requests
from minio import Minio
from minio.error import S3Error
from dotenv import load_dotenv

load_dotenv()

MINIO_HOSTNAME = f"{os.environ.get('MINIO_HOST')}:{os.environ.get('MINIO_PORT')}"
ACCESS_KEY_ID = os.environ.get('MINIO_ROOT_USER')
SECRET_ACCESS_KEY = os.environ.get('MINIO_ROOT_PASSWORD')
MUSIC_LIBRARY_DIRECTORY = "media-resources"
BUCKET_NAME = os.environ.get('MUSIC_LIBRARY_BUCKET_NAME')
MUSIC_LIBRARY_MS = os.environ.get('MUSIC_LIBRARY_API')


def create_genre(genre):
    res = requests.post(f"{MUSIC_LIBRARY_MS}/genres", data={'name': genre}) 
    return res.json()


def create_artist(genre_name, artist):
    data = {
        'name': artist, 
        'biography': 'n/a', 
        'photo': f'{genre_name}/{artist}/cover.jpg'
    }
    res = requests.post(f"{MUSIC_LIBRARY_MS}/artists", data=data) 
    return res.json()


def create_album(genre_name, artist, album):
    print(genre_name, artist, album)
    data = {
        'title': album, 
        'artistId': artist['id'], 
        'photo': f'{genre_name}/{artist["name"]}/{album}/cover.jpg',
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
            saved_artist = create_artist(genre_name, artist_name)
            for album_name, album in artists.items():
                saved_album = create_album(genre_name, saved_artist, album_name)
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
        # prepare media files
        os.system(f'rm -fr {MUSIC_LIBRARY_DIRECTORY}')
        os.system('unzip jobs/media-resources.zip')
        # create bucket
        client.make_bucket(BUCKET_NAME)
        resources = get_music_library_resources(MUSIC_LIBRARY_DIRECTORY)
        songs = [resource for resource in resources if resource['type'] == 'audio']
        library = build_library(songs)
        save_library(library)
        for resource in resources:
            print('saving-object', resource['object'])
            client.fput_object(BUCKET_NAME, resource['object'], resource['filepath'])
        os.system(f'rm -fr {MUSIC_LIBRARY_DIRECTORY}')
    else:
       print(f"{BUCKET_NAME} already exists")



if __name__ == "__main__":
    try:
        main()
    except S3Error as exc:
        print("error occurred.", exc)
