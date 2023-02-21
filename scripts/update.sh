APP_DIR=/root/voice24
cd $APP_DIR

# Update the code
git pull

# Install the dependencies
npm install

# Restart the app
pm2 restart voice24.org --update-env