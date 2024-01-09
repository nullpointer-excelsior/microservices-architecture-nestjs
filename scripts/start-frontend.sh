#!/bin/bash

# Función de limpieza
cleanup() {
  echo "Script interrumpido. Eliminando el repositorio..."
  cd ..
  rm -rf spotify-clone-frontend
}

# Establece la trampa de señal para llamar a la función de limpieza cuando se reciba SIGINT (Ctrl+C)
trap cleanup SIGINT

git clone --depth 1 https://github.com/nullpointer-excelsior/spotify-clone-frontend.git 
cd spotify-clone-frontend || exit

npm install 
npm run start


