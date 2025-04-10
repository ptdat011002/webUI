# run docker build

docker build -t local-website -f sites/local-website/Dockerfile .

# run docker container

docker run -d -p 8080:80 local-website