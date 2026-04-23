# Nextcloud Talk TV with SolidJS + LightningJS

A TV-optimized video calling client for Nextcloud Talk, built with SolidJS and LightningJS.

There are a few query params for customizing the application to test on devices

size='720' | '1080' | '4k'
numImageWorkers = 0 to disable image workers
disableBG=true to turn off background (reduce memory)
roundPoster=false to turn off rounded images on poster

## Main Repo

Solid
[https://github.com/lightning-tv/solid](https://github.com/lightning-tv/solid)

## Getting started

Get an API Read Access Token from [TMDB API](https://developers.themoviedb.org/3/getting-started/introduction)
and put the key in `src/api/key.js` with `export default 'KEY_VALUE'`

```
git clone https://github.com/lightning-tv/solid-demo-app
cd solid-demo-app
pnpm i
pnpm start
```

If you're interested in using SolidJS with Lightning and Web check out [Web Branch](https://github.com/lightning-tv/solid-demo-app/tree/web) to see the setup.
