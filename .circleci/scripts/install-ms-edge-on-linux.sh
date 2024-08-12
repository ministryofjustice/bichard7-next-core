#!/bin/sh

# Configure apt cache
sudo sh -c "echo 'APT::Keep-Downloaded-Packages \"true\";' > /etc/apt/apt.conf.d/99keep-debs"
sudo sh -c "echo 'Binary::apt::APT::Keep-Downloaded-Packages \"true\";' > /etc/apt/apt.conf.d/98keep-debs"

# Remove apt cache purge configuration
sudo rm /etc/apt/apt.conf.d/docker-clean || true

# Restore archives from cache
mkdir -p ~/vendor/apt_cache || true
mkdir -p ~/vendor/apt_lists || true
sudo cp -r ~/vendor/apt_cache /var/cache/apt
sudo cp -r ~/vendor/apt_lists /var/lib/apt/lists

# Install MS Edge
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge-dev.list'
sudo rm microsoft.gpg
sudo apt -y update
sudo apt -y install microsoft-edge-dev

# Clean unneeded packages from cache
sudo apt autoclean

# Copy archives ready to cache
sudo chmod -R +r /var/cache/apt || true
sudo chmod -R +r /var/lib/apt/lists || true
sudo cp -r /var/cache/apt ~/vendor/apt_cache
sudo cp -r /var/lib/apt/lists ~/vendor/apt_lists
