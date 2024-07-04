import { AllHtmlEntities } from 'html-entities';

const entities = new AllHtmlEntities();

function findOGTags(content, url) {
    const metaTagOGRegex = /<meta[^>]*(?:property=[ '"]*og:([^'"]*))?[^>]*(?:content=["]([^"]*)["])?[^>]*>/gi;
    const matches = content.match(metaTagOGRegex);
    const meta = {};

    if (matches) {
        const metaPropertyRegex = /<meta[^>]*property=[ "]*og:([^"]*)[^>]*>/i;
        const metaContentRegex = /<meta[^>]*content=[ "]([^"]*)[^>]*>/i;

        for (let i = matches.length; i--;) {
            let propertyMatch;
            let contentMatch;
            let metaName;
            let metaValue;

            try {
                propertyMatch = metaPropertyRegex.exec(matches[i]);
                contentMatch = metaContentRegex.exec(matches[i]);

                if (!propertyMatch || !contentMatch) {
                    continue;
                }

                metaName = propertyMatch[1].trim();
                metaValue = contentMatch[1].trim();

                if (!metaName || !metaValue) {
                    continue;
                }
            } catch (error) {
                if (__DEV__) {
                    console.log('Error on ', matches[i]);
                    console.log('propertyMatch', propertyMatch);
                    console.log('contentMatch', contentMatch);
                    console.log(error);
                }

                continue;
            }

            if (metaValue.length > 0) {
                if (metaValue[0] === '/') {
                    if (metaValue.length <= 1 || metaValue[1] !== '/') {
                        if (url[url.length - 1] === '/') {
                            metaValue = url + metaValue.substring(1);
                        } else {
                            metaValue = url + metaValue;
                        }
                    } else {
                        // handle protocol agnostic meta URLs
                        if (url.indexOf('https://') === 0) {
                            metaValue = `https:${metaValue}`;
                        } else if (url.indexOf('http://') === 0) {
                            metaValue = `http:${metaValue}`;
                        }
                    }
                }
            } else {
                continue;
            }

            meta[metaName] = entities.decode(metaValue);
        }
    }

    return meta;
}

function findHTMLMetaTags(content, url) {
    const metaTagHTMLRegex = /<meta(?:[^>]*(?:name|itemprop)=[ '"]([^'"]*))?[^>]*(?:[^>]*content=["]([^"]*)["])?[^>]*>/gi;
    const matches = content.match(metaTagHTMLRegex);
    const meta = {};

    if (matches) {
        const metaPropertyRegex = /<meta[^>]*(?:name|itemprop)=[ "]([^"]*)[^>]*>/i;
        const metaContentRegex = /<meta[^>]*content=[ "]([^"]*)[^>]*>/i;

        for (let i = matches.length; i--;) {
            let propertyMatch;
            let contentMatch;
            let metaName;
            let metaValue;

            try {
                propertyMatch = metaPropertyRegex.exec(matches[i]);
                contentMatch = metaContentRegex.exec(matches[i]);

                if (!propertyMatch || !contentMatch) {
                    continue;
                }

                metaName = propertyMatch[1].trim();
                metaValue = contentMatch[1].trim();

                if (!metaName || !metaValue) {
                    continue;
                }
            } catch (error) {
                if (__DEV__) {
                    console.log('Error on ', matches[i]);
                    console.log('propertyMatch', propertyMatch);
                    console.log('contentMatch', contentMatch);
                    console.log(error);
                }

                continue;
            }

            if (metaValue.length > 0) {
                if (metaValue[0] === '/') {
                    if (metaValue.length <= 1 || metaValue[1] !== '/') {
                        if (url[url.length - 1] === '/') {
                            metaValue = url + metaValue.substring(1);
                        } else {
                            metaValue = url + metaValue;
                        }
                    } else {
                        // handle protocol agnostic meta URLs
                        if (url.indexOf('https://') === 0) {
                            metaValue = `https:${metaValue}`;
                        } else if (url.indexOf('http://') === 0) {
                            metaValue = `http:${metaValue}`;
                        }
                    }
                }
            } else {
                continue;
            }

            meta[metaName] = entities.decode(metaValue);
        }

        if (!meta.title) {
            const titleRegex = /<title>([^>]*)<\/title>/i;
            const titleMatch = content.match(titleRegex);

            if (titleMatch) {
                meta.title = entities.decode(titleMatch[1]);
            }
        }
    }

    return meta;
}

function parseMeta(html, url, options) {
    let meta = findOGTags(html, url);

    if (options.fallbackOnHTMLTags) {
        try {
            meta = {
                ...findHTMLMetaTags(html, url),
                ...meta,
            };
        } catch (error) {
            if (__DEV__) {
                console.log('Error in fallback', error);
            }
        }
    }

    return meta;
}

async function fetchHtml(urlToFetch, forceGoogle = false) {
    let result;

    let userAgent
        = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36';

    if (forceGoogle) {
        userAgent
            = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
    }
    
    if(urlToFetch.indexOf('twitter.com') >= 0 || urlToFetch.indexOf('x.com') >= 0){
        const AgetForX = [
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0",
            "facebookexternalhit/1.1;line-poker/1.0",
            "recon (github.com/jimmysawczuk/recon; similar to Facebot, facebookexternalhit/1.1)",
            "facebookexternalhit/1.1",
            "facebookexternalhit/1.1 (compatible; Blueno/1.0; +https://naver.me/scrap)",
            "facebookexternalhit/1.1; kakaotalk-scrap/1.0; +https://devtalk.kakao.com/t/scrap/33984",
            "Mozilla/5.0 (compatible; The Lounge IRC Client; +https://github.com/thelounge/thelounge) facebookexternalhit/1.1 Twitterbot/1.0",
            "Mozilla/5.0 (compatible) facebookexternalhit/1.1 (+https://faviconkit.com/robots)",
            "RemindPreview/1.0 facebookexternalhit/1.0",
            "Mozilla/5.0 (compatible) facebookexternalhit/1.1 ( https://faviconkit.com/robots)"
        ];
        userAgent = AgetForX[Math.floor(Math.random() * 10)];
    }

    try {
        result = await fetch(urlToFetch, {
            method: 'GET',
            headers: {
                'user-agent': userAgent,
            },
        });

        if (result.status >= 400) {
            throw result;
        }

        return result.text().then((resultParsed) => resultParsed);
    } catch (responseOrError) {
        if (responseOrError.message && __DEV__) {
            if (responseOrError.message === 'Network request failed') {
                console.log(urlToFetch, 'could not be fetched');
            } else {
                console.log(responseOrError);
            }
            return null;
        }

        return responseOrError.text().then((error) => {
            if (__DEV__) {
                console.log(
                    'An error has occured while fetching url content',
                    error
                );
            }
            return null;
        });
    }
}

async function fetchJSON(urlToFetch, urlOfVideo) {
    try {
        const result = await fetch(urlToFetch, { method: 'GET' });

        if (result.status >= 400) {
            throw result;
        }

        const resultParsed = await result.json();

        return {
            title: resultParsed.title,
            image: resultParsed.thumbnail_url,
            url: urlOfVideo,
        };
    } catch (error) {
        if (__DEV__) {
            console.log(error);
        }
        return null;
    }
}

function getUrls(contentToMatch) {
    const regexp = /(?:(?=[\s`!()\[\]{};:'".,<>?«»“”‘’])|\b)((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/|[a-z0-9.\-]+[.](?:com|org|net))(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))*(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]|\b))/gi;
    const urls = contentToMatch.match(regexp);
    const urlsToReturn = [];

    if (urls && urls.length) {
        urls.forEach((url) => {
            if (url.toLowerCase().indexOf('http') === 0) {
                urlsToReturn.push(url);
            } else {
                urlsToReturn.push(`http://${url}`);
            }
        });
    } else {
        if (__DEV__) {
            console.log('Could not find an html link');
        }
    }

    return urlsToReturn;
}

async function extractMeta(
    textContent = '',
    options = { fallbackOnHTMLTags: true }
) {
    try {
        const urls = getUrls(textContent);

        const metaData = [];
        let i = 0;

        while (i < urls.length) {
            if (urls[i].indexOf('youtube.com') >= 0) {
                metaData.push(
                    await fetchJSON(
                        `https://www.youtube.com/oembed?url=${
                            urls[i]
                        }&format=json`,
                        urls[i]
                    )
                );
            } else { /* eslint-disable no-loop-func */
                metaData.push(
                    await fetchHtml(urls[i])
                        .then((html) => ({
                            ...html ? parseMeta(html, urls[i], options) : {},
                            url: urls[i],
                        }))
                );
            }

            i++;
        }

        return metaData;
    } catch (e) {
        console.log(e);

        return {};
    }
}

const exporting = {
    extractMeta,
    // Exporting for testing
    findOGTags,
    findHTMLMetaTags,
};
// For testing
module.exports = exporting;

export default exporting;
