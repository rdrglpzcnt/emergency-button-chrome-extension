const sites = {
  socialMedia: [
    '4chan',
    'beReal',
    'discord',
    'facebook',
    'instagram',
    'line',
    'mastodon',
    'pinterest',
    'reddit',
    'signal',
    'snapchat',
    'telegram',
    'threads',
    'tiktok',
    'tumblr',
    'twitter',
    'viber',
    'wa.me',
    'whatsapp',
    'x.com',
  ],
  video: [
    'appletv',
    'bilibili',
    'crunchyroll',
    'dailymotion',
    'disneyplus',
    'facebookwatch',
    'fubo',
    'funimation',
    'hbomax',
    'hulu',
    'iqiyi',
    'kick',
    'kickstarter/live',
    'netflix',
    'niconico',
    'paramountplus',
    'peacock',
    'plex',
    'pluto.tv',
    'primevideo',
    'roku',
    'starplus',
    'tubitv',
    'twitch',
    'vimeo',
    'viu',
    'vudu',
    'weTV',
    'youtube',
  ],
  nsfw: [
    'bangbros',
    'beeg',
    'brazzers',
    'cam4',
    'chaturbate',
    'eporner',
    'erome',
    'fansly',
    'fapello',
    'fapvid',
    'hustler',
    'livejasmin',
    'motherless',
    'myfreecams',
    'naughtyamerica',
    'onlyfans',
    'playboy',
    'pornhub',
    'porntrex',
    'realitykings',
    'redtube',
    'spankbang',
    'stripchat',
    'tushy',
    'vivid',
    'xhamster',
    'xnxx',
    'xvideos',
    'youporn',
  ],
  shopping: [
    'aliexpress',
    'amazon',
    'bestbuy',
    'costco',
    'ebay',
    'etsy',
    'linio',
    'mercadolibre',
    'newegg',
    'shein',
    'target',
    'temu',
    'walmart',
    'wish',
  ],
  memesAndTimeWasters: [
    '9gag',
    'boredpanda',
    'cheezburger',
    'imgur',
    'knowyourmeme',
    'memedroid',
    'thechive',
  ],
  sportsAndStreaming: [
    'espn',
    'f1',
    'formula1',
    'foxsports',
    'laliga',
    'ligamx',
    'mlb',
    'nba',
    'nfl',
    'nhl',
    'premierleague',
    'ufc',
  ],
  bettingAndCasino: [
    '1xbet',
    '888casino',
    'bet365',
    'betfair',
    'caliente.mx',
    'caliente',
    'casino',
    'codere',
    'poker',
    'pokerstars',
  ],
  gaming: [
    'battle.net',
    'epicgames',
    'leagueoflegends',
    'minecraft',
    'playstation',
    'riotgames',
    'roblox',
    'steam',
    'valorant',
    'xbox',
  ],
  random: [
    'bumble',
    'chatroulette',
    'forocoches',
    'okcupid',
    'ome.tv',
    'omegle',
    'tinder',
  ]
};

const emergencyButton = document.getElementById('emergencyButton');
const waitingIcon = document.getElementById('waitingIcon');
const successText = document.getElementById('successText');

function getSearchPromise(searchTerm) {
  return () => new Promise(function (resolve) {
    chrome.history.search({
      text: searchTerm,
      startTime: 0,
      endTime: Date.now(),
      maxResults: 10000
    }, function(items) {
      console.log({searchTerm, items})
      if (searchTerm === 'x.com') {
        resolve(items.filter(i => i.url.match('https://x.com')))
      } else {
        resolve(items)
      }
    })
  })
}

function getDeletePromise(historyItem) {
  return () => new Promise(function (resolve) {
    chrome.history.deleteUrl({
      url: historyItem.url
    }, () => {
      resolve(historyItem)
    })
  })
}

function onSuccess() {
  successText.innerText = `👍🏻`
  waitingIcon.classList.add('hidden')
}

function handleEmergencyButton() {
  const searchPromises = [];

  emergencyButton.classList.add('hidden')
  waitingIcon.classList.remove('hidden')
  
  for (const key in sites) {
    const group = sites[key];
    group.forEach(element => {
      searchPromises.push(getSearchPromise(element))
    });
  }
  
  Promise.allSettled(searchPromises.map(fn => fn()))
    .then(results => {
      const deletePromises = []
      const historyItems = [].concat(...results.map(r => r.value))
      if (historyItems.length) {
        historyItems.forEach(item => deletePromises.push(getDeletePromise(item)))
        Promise.allSettled(deletePromises.map(fn => fn()))
          .then(onSuccess)
      } else {
        onSuccess()
      }
    })
}

emergencyButton.addEventListener('click', handleEmergencyButton)