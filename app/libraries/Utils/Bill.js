const express = require('express');
const axios = require('axios');
const createJWT = require ('./CreateJWT');
const createSignature = require ('./CreateSignature');

class SendApi {
    static async sendApiPost(endpoint, data) {
      try {
        const jwtToken = createJWT;
    
        const config = {
          headers: {
            'Content-Type': `${CONSTANT.AUTH_HEADER_CONTENT_TYPE}`,
            'X-APPOTAPAY-AUTH': `${CONSTANT.AUTH_HEADER_SCHEME} ${jwtToken}` 
          }
        };
        const response = await axios.post(endpoint, createSignature.bodyJson(data), config);
        console.log(response.data);
        return response.data
      } 
      catch (error) {
        if (error.response) {
          console.error('API response error:', error.response.data);
          return error.response.data; 
        } else {
          console.error('Error sending API request:', error);
          throw error; 
        }
      }
    };
  
}
module.exports = SendApi;
