const express = require('express');
const app = express();
const axios = require("axios");


function generateRandomIP() {
    // Generate four random numbers in the range of 0-255
    const octet1 = Math.floor(Math.random() * 256);
    const octet2 = Math.floor(Math.random() * 256);
    const octet3 = Math.floor(Math.random() * 256);
    const octet4 = Math.floor(Math.random() * 256);
  
    // Construct the IP address string
    const ipAddress = `${octet1}.${octet2}.${octet3}.${octet4}`;
  
    return ipAddress;
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.get('/sendotp', async (req, res) => {
    const { num } = req.query;
    try {
        const response = await axios({
            method: "post",
            url: "https://apim.djezzy.dz/oauth2/registration",
            data: `scope=smsotp&client_id=6E6CwTkp8H1CyQxraPmcEJPQ7xka&msisdn=213${num}`,
            headers: { 
                "content-type":"application/x-www-form-urlencoded",
                "X-Forwarded-For": generateRandomIP()
            },
        });
        res.json(response.data);
    } catch (error) {
        console.log(error)
        res.status(error.response.status).json(error.response.data);
    }
});

app.get('/verifyotp', async (req, res) => {
    const { num, otp } = req.query;
    try {
        const response = await axios({
            method: "post",
            url: "https://apim.djezzy.dz/oauth2/token",
            data: `scope=openid&client_secret=MVpXHW_ImuMsxKIwrJpoVVMHjRsa&client_id=6E6CwTkp8H1CyQxraPmcEJPQ7xka&otp=${otp}&mobileNumber=213${num}&grant_type=mobile`,
            headers: { 
                "content-type":"application/x-www-form-urlencoded",
                "X-Forwarded-For": generateRandomIP()
             },
          });

        res.json(response.data);
    } catch (error) {
        console.log(error)
        res.status(error.response.status).json(error.response.data);
    }
});

app.get('/2g', async (req, res) => {
    const { token, num } = req.query;
    try {
        const response = await axios({
            method: "post",
            url: `https://apim.djezzy.dz/djezzy-api/api/v1/subscribers/213${num}/subscription-product?include=`,
            data: {"data":{"id":"GIFTWALKWIN","type":"products","meta":{"services":{"steps":10000,"code":"GIFTWALKWIN2GO","id":"WALKWIN"}}}},
            headers: { 
                'Authorization': `Bearer ${token}`,
                "X-Forwarded-For": generateRandomIP()
             },
          });

        res.json(response.data);
    } catch (error) {
        console.log(error)
        res.status(error.response.status).json(error.response.data);
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening on port ${process.env.PORT || 3000}!`);
});
