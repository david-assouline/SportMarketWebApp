async function getPrices() {

    const baseUrl = 'https://z340b62ka1.execute-api.us-east-2.amazonaws.com/get_prices';

    const response = await fetch(baseUrl, {
        method: 'GET',
    })
    return await response.json()
}