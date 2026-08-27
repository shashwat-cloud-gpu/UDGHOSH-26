const https = require('https');

const urls = ['https://flic.kr/p/2ss6FyU', 'https://flic.kr/p/2ssdFWg', 'https://flic.kr/p/2sscjLL'];

urls.forEach(url => {
  https.get(url, res => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, res2 => {
        let data = '';
        res2.on('data', chunk => data += chunk);
        res2.on('end', () => {
          const match = data.match(/<meta property="og:image" content="([^"]+)"/);
          if (match) console.log(url, match[1]);
          else console.log(url, 'Not found');
        });
      });
    }
  });
});
