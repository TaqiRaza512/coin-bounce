import axios from 'axios';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const NEWS_API_ENDPOINT=`https://newsapi.org/v2/everything?q=business AND blockchain&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;

const CRYPTO_API_ENDPOINT =`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en`;

export const getNews = async () => {

    let response;
    try{
        console.log("URL",NEWS_API_ENDPOINT);
        response = await axios.get(NEWS_API_ENDPOINT);
        response = response.data.articles.slice(1,15);
    }
    catch(err)
    {
        console.log("error",err);

        console.log(err);
    }
    return response;
};

export const getCrypto = async() => {
     let response;
     try{
        response = await axios.get(CRYPTO_API_ENDPOINT);
        response =response.data;
     }
     catch(err){
        console.log(err);
     }
     return response;
}