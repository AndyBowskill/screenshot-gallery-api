const db = require('../config/db');
const fetch = require('node-fetch');

const handleScreenshots = (request, response) => {
  const { email, url } = request.body;
  const encodedUrl = encodeURIComponent(url);

  let query = 'https://shot.screenshotapi.net/screenshot';
  query += `?token=${process.env.SCREENSHOT_API_KEY}&url=${encodedUrl}&width=600&height=450&fresh=true&output=json&file_type=webp&block_ads=true&no_cookie_banners=true&wait_for_event=load`;

  fetch(query)
    .then((response) => response.json())
    .then((screenshotAPI) => {
      db.insert({
        email: email,
        screenshot: screenshotAPI.screenshot,
        url: screenshotAPI.url,
      })
        .into('screenshots')
        .returning('screenshot')
        .then((screenshot) => {
          db.select('*')
            .from('screenshots')
            .where('email', '=', email)
            .orderBy('id', 'desc')
            .then((screenshots) => {
              const data = {
                screenshots: screenshots,
                user: {
                  email: email,
                },
              };

              response.status(200).json(data);
            })
            .catch((error) => response.status(500).json(error));
        })
        .catch((error) => response.status(500).json(error));
    })
    .catch((error) => response.status(500).json(error));
};

module.exports = {
  handleScreenshots,
};
