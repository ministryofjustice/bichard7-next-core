LANG="en_GB.UTF-8"

sudo apt-get install -y locales && \
  sudo sed -i -e "s/# $LANG.*/$LANG UTF-8/" /etc/locale.gen && \
  sudo dpkg-reconfigure --frontend=noninteractive locales && \
  sudo update-locale LANG=$LANG

echo "export LANG=$LANG" >> ~/.bash_profile
