const fs = require('fs');

class GetJsonData {
    /**
     * get bill status 
     *
     * @param errorCode
     * @returns status from errorcode
     */
     getBillStatus(errorCode) {
        try {
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

    /**
     * get service code 
     *
     * @param serviceCode
     * @returns service type
     */
      getServiceCode(serviceCode) {
        try {
          const rawData = fs.readFileSync(APP_SETTINGS.SERVICES_MASTER_DATA_FILE_PATH);
          const jsonData = JSON.parse(rawData);
          const serviceGroups = [
            "BILL_ELECTRIC",
            "BILL_WATER",
            "BILL_TELEVISION",
            "BILL_INTERNET",
            "BILL_TELEPHONE",
          ];
        
          for (const group of serviceGroups) {
            if (jsonData.services[group] && jsonData.services[group][serviceCode]) {
              return "one";
            }
          }
        
          if (jsonData.services["BILL_FINANCE"] && jsonData.services["BILL_FINANCE"][serviceCode]) {
            return "many";
          }
        
          return "unknown";
        
      
        } catch (error) {
          console.error('Lỗi khi đọc tệp JSON:', error);
          throw error;
        }
      }

}

module.exports = GetJsonData;