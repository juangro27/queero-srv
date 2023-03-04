const axios = require('axios')

class ApiCountriesService {
    static _instance
    constructor() {
        this.api = axios.create({
            baseURL: 'https://restcountries.com/v3.1'
        })
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new ApiCountriesService();
        }
        return this._instance;
    }


    getAllCountries = () => {
        return this.api.get(`/all`)
    }
}

module.exports = ApiCountriesService.getInstance()