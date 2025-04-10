# Pavana Local Website
### About
This is a boilerplate to develop pavana-admin site.

### Technical
- React 18
- Ant Design 5, Emotion
- Mysql, Redis

### Repository Structure 

This repository is mono-repo based on yarn workspace v4. The structure include of sites, packages and services.

```
|--packages
|-------ds-core
|-------react-icons
|-------react-form-builder
|-------react-helper
|-------react-modal
|--sites
|-------local-website
|-------storybook

|---package.json
|---yarnrc.yaml

```



### Develop

1. Install dependencies

```bash
 yarn install
```
2. Build packages
```
yarn build:packages
```
3. Run app
```
yarn dev
```




### Build
```
yarn build:local-website
```

Output `sites/local-website/dist`


### Deploy

At Local: 
- Build local website and zip folder
- copy built folder to /sdcard/www


```
sh scripts/deploy.sh
```

At CAM Server
- Cd to www folder
- Unzip `app.zip` with replace mode
- remove `app.zip`
- reboot CAM  with cmd `reboot`

### Implemented a Component

1. Write storybook. Docs: https://storybook.js.org/docs/get-started 
2. Config resource of stories want to display in `/storybook/.storybook/main.js`
3. Run storybook
```
yarn storybook
```



### Implemented Icons
1. download icon (.svg file) into `/icons/<Filled|Color|Outlined>/<name>.svg`
2. Generate icon component with `yarn generate:icons`
3. rebuild packages
4. import and use icon: 
```typescript
import { IconOutlined } from '@packages/ds-icons' 
```

