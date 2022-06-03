import fs from 'fs';
import fetch from 'node-fetch';
import data from './config.json' assert { type: 'json' };

const store = data.store;
const accessToken = data.accessToken;
const apiVersion = '2022-04';
const apiLocation = '/admin/api/';

const shopGraphQl = 'https://' + store + apiLocation + apiVersion + '/graphql.json';

let files = [];

function downloadFiles (file_urls) {
  if (!fs.existsSync("./files")) fs.mkdirSync("./files");
  if (!fs.existsSync("./files/1")) fs.mkdirSync("./files/1");

  let dir = "1";
  let count = 0;

  const promises = file_urls.map((file_url, idx) => {
    return fetch(file_url)
      .then((res) => {
        if (count % 200 === 0 && count !== 0) {
          dir = (+dir + 1).toString();
          if (!fs.existsSync("./files/" + dir)) fs.mkdirSync("./files/" + dir);
        }

        var file_name = res.url.split("/").pop().split("?")[0];
        var dest = fs.createWriteStream(`./files/${dir}/${file_name}`);
        res.body.pipe(dest);
        count++;
        process.stdout.write(`Downloading file ${count} of ${file_urls.length}\r`);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  Promise.all(promises)
    .then(() => {
      process.stdout.write("Success. All files downloaded!\r");
    })
    .catch((err) => {
      console.log("Error!")
    });
}

function getFiles (cursor = null) {
  return fetch(
    shopGraphQl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken
      },
      body: JSON.stringify({
        query: `{
  files(first:50${cursor ? ',after:"'+ cursor +'"' : ''}) {
    edges {
      cursor
      node {
        ... on GenericFile {
          url
        }
        ... on MediaImage {
          image {
            originalSrc: url
          }
        }
        ...VideoFragment
        fileErrors {
          code
          details
          message
        }
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}

fragment VideoFragment on Video {
  originalSource {
    url
  }
}`})
    }
  )
    .then(res => {
      return res.json();
    })
    .then((result) => {
      if(result.data.files.edges.length) {
        result.data.files.edges.forEach(({node}) => {
          let file
          if (node.url) {
            file = node.url
          } else if (node.image.originalSrc) {
            file = node.image.originalSrc
          } else if (node.originalSource.url) {
            file = node.originalSource.url
          }

          files.push(file)
        });

         if (result.data.files.pageInfo.hasNextPage) {
           getFiles(result.data.files.edges[result.data.files.edges.length - 1].cursor)
         } else {
           process.stdout.write("Files fetched\r");
           downloadFiles(files)
         }
      } else {

      }
    })
    .catch(err => console.error(err));
}

getFiles()
