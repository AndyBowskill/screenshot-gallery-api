const handleScreenshots = (request, response, db) => {
  const { email, url } = request.body;
  const encodedUrl = encodeURIComponent(url);
  console.log('API key: ', process.env.SCREENSHOT_API_KEY);
  let query = 'https://shot.screenshotapi.net/screenshot';
  query += `?token=${process.env.SCREENSHOT_API_KEY}&url=${encodedUrl}&width=900&height=506&&output=json&file_type=webp&image_quality=50&block_ads=true&no_cookie_banners=true&wait_for_event=load`;
  console.log('Query: ', query);
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
