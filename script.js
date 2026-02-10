const sites = {
  socialMedia: [
    'facebook',
    'tiktok',
    'reddit',
    'x.com',
    'twitter',
    'instagram',
    'snapchat',
    'threads',
    'tumblr',
    'discord',
    'telegram',
    'pinterest',
    '4chan',
    'whatsapp',
    'wa.me',
    'beReal',
    'mastodon',
    'signal',
    'line',
    'viber'
  ],
  video: [
    'youtube',
    'netflix',
    'primevideo',
    'hbomax',
    'disneyplus',
    'paramountplus',
    'appletv',
    'crunchyroll',
    'funimation',
    'twitch',
    'kick',
    'vimeo',
    'dailymotion',
    'pluto.tv',
    'tubitv',
    'plex',
    'roku',
    'vudu',
    'fubo',
    'hulu',
    'peacock',
    'starplus',
    'viu',
    'iqiyi',
    'weTV',
    'bilibili',
    'niconico',
    'kickstarter/live',
    'facebookwatch',
  ],
  nsfw: [
    'pornhub',
    'xvideos',
    'xnxx',
    'onlyfans',
    'fansly',
    'redtube',
    'youporn',
    'brazzers',
    'bangbros',
    'naughtyamerica',
    'realitykings',
    'tushy',
    'vivid',
    'playboy',
    'hustler',
    'spankbang',
    'beeg',
    'motherless',
    'cam4',
    'chaturbate',
    'stripchat',
    'livejasmin',
    'myfreecams',
    'erome',
    'fapello',
    'fapvid',
    'eporner',
    'porntrex',
    'xhamster'
  ],
  shopping: [
    'mercadolibre',
    'amazon',
    'aliexpress',
    'shein',
    'temu',
    'ebay',
    'etsy',
    'wish',
    'walmart',
    'target',
    'costco',
    'linio',
    'bestbuy',
    'newegg'
  ],
  memesAndTimeWasters: [
    '9gag',
    'imgur',
    'knowyourmeme',
    'boredpanda',
    'cheezburger',
    'thechive',
    'memedroid'
  ],
  sportsAndStreaming: [
    'nfl',
    'nhl',
    'nba',
    'mlb',
    'ufc',
    'f1',
    'formula1',
    'laliga',
    'premierleague',
    'ligamx',
    'espn',
    'foxsports'
  ],
  bettingAndCasino: [
    'caliente',
    'bet365',
    'codere',
    '1xbet',
    'betfair',
    'casino',
    'poker',
    'pokerstars',
    '888casino',
    'caliente.mx'
  ],
  gaming: [
    'steam',
    'epicgames',
    'battle.net',
    'riotgames',
    'leagueoflegends',
    'valorant',
    'minecraft',
    'roblox',
    'playstation',
    'xbox'
  ],
  random: [
    'omegle',
    'ome.tv',
    'tinder',
    'bumble',
    'okcupid',
    'chatroulette',
    'forocoches'
  ]
};

const emergencyButton = document.getElementById('emergencyButton');
const waitingIcon = document.getElementById('waitingIcon');
const successText = document.getElementById('successText');

function getHistoryItemsPromise(searchTerm) {
  return () => new Promise(function (resolve) {
    chrome.history.search({
      text: searchTerm,
      startTime: 0,
      endTime: Date.now(),
      maxResults: 10000
    }, function(items) {
      if (searchTerm === 'x.com') {
        resolve(items.filter(i => i.url.match('https://x.com')))
      } else {
        resolve(items)
      }
    })
  })
}

function getHistoryItemDeletePromise(historyItem) {
  return () => new Promise(function (resolve) {
    chrome.history.deleteUrl({
      url: historyItem.url
    }, () => {
      resolve(historyItem)
    })
  })
}

function onSuccess() {
  successText.innerText = `Estás limpio 🥷🏻`
  waitingIcon.classList.add('hidden')
}

function handleEmergencyButton() {
  const searchPromises = [];

  emergencyButton.classList.add('hidden')
  waitingIcon.classList.remove('hidden')
  
  for (const key in sites) {
    const group = sites[key];
    group.forEach(element => {
      searchPromises.push(getHistoryItemsPromise(element))
    });
  }
  
  Promise.allSettled(searchPromises.map(fn => fn()))
    .then(results => {
      const deletePromises = []
      const historyItems = [].concat(...results.map(r => r.value))
      if (historyItems.length) {
        historyItems.forEach(item => {
          deletePromises.push(getHistoryItemDeletePromise(item))
        })
        Promise.allSettled(deletePromises.map(fn => fn())).then(() => {
          onSuccess()
        })
      } else {
        onSuccess()
      }
    })
}

emergencyButton.addEventListener('click', handleEmergencyButton)