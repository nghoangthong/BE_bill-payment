const fs = require('fs');

class GetJsonData {

     Status(errorCode) {
        try {
          // Đọc dữ liệu từ tệp JSON
          const rawData = fs.readFileSync(APP_SETTINGS.ERROR_FILE_PATH);
          const jsonData = JSON.parse(rawData);
          if (jsonData.Error && jsonData.Error[errorCode]) {
            return 'Error';
          }
      
          if (jsonData.Success && jsonData.Success[errorCode]) {
            return 'Success';
          }
          if (jsonData.Retry && jsonData.Retry[errorCode]) {
            return 'Retry';
          }
          if (jsonData.Pending && jsonData.Pending[errorCode]) {
            return 'Pending';
          }
      
          return 'unknown';
        } catch (error) {
          console.error('Lỗi khi đọc tệp JSON:', error);
          throw error;
        }
      }

}

module.exports = GetJsonData;