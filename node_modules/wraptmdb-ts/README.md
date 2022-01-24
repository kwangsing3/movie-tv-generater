
<h3 align="right">
<a href="https://github.com/wrapTMDB/wrapTMDB-ts">Github page</a> |
<a href="https://www.npmjs.com/package/wraptmdb-ts">npm page</a>  
</h3>


# WrapTMDB-ts  
<h3>
<p align="center">
<a href="README.md"> English </a>|
<a href="/docs/README_ja.md"> 日本語 </a>|
<a href="/docs/README_zh-tw.md"> 繁體中文 </a>|
<a href="/docs/README_zh-cn.md"> 简体中文 </a>
</p>
</h3>
<br/>

# What is [wrapTMDB](https://github.com/wrapTMDB/wrapTMDB) ?

```wrapTMDB``` is a wrapper collection for wrapping TMDB API from their doc and implementing in different program languages.

It helps developer to request Movies or TV shows for infomation and metadata.<br/>

This repo written by Typescript and publich in npm,<br/>
see more  [here](https://github.com/wrapTMDB/wrapTMDB).
___
## What kinds of project are appropriated using with?

- If you want to make a client to track new movies infomation.
- If you want to make a tool helping you to manage your movie files or videos.
- Even if you want to make a application to replace TMDB offical website. (( lmao
- ...

___
## Useage

### Install:

```bash
$npm install wraptmdb-ts@latest
```

Before use this tool, make sure already have your [api_key](https://developers.themoviedb.org/3/getting-started/authentication).
<br/>

``` Typescript
import * as wrapTMDB from 'wraptmdb-ts'; // import as a namespace

wrapTMDB.Init('YOUR api_key');        //Always init your TOKEN_key first.
wrapTMDB.SetHeader({                  //Set header (optional but recommand)
    'User-Agent': 'npm package-dev',
    Referer: 'wraptmdb-ts',
  });

async function main() {
  let data = {};
  try {
    //using as a promise function
    data = await wrapTMDB.Movies.GetDetails(624860); 
  } catch (err) {
    console.error(err);
  }
  console.log(JSON.stringify(data));
}
main();
```
___

## How do I recognize these APIs ?

### Use your intuition:

```Typescript
data = await wrapTMDB.Movies.GetDetails(624860);
```
![alt text](docs/172714.png)

```Typescript
data = await wrapTMDB.Collections.GetTranslations(654321, 'en-US');
```
![alt text](docs/172927.png)

```Typescript
data = await wrapTMDB.TVseasons.GetImages(54321, 65421, 'en-US');
```
![alt text](docs/172331.png)



# Join Development ?
```bash
$git clone https://github.com/wrapTMDB/wrapTMDB-ts &&

npm install ||

touch src/index.ts 
```

___
## Others

*** leave a star,  hope this tool would give you a big help. ***

THANK YOU :)

Any request are welcome.