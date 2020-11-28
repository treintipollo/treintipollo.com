# development sever with a dummy ssl certificate to test https in localhost
# call this script from the root of the project so the paths for the files are correct
sudo thin start -p 443 --ssl --ssl-key-file server/server.key --ssl-cert-file server/server.crt