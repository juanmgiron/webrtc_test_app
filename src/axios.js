import axios from 'axios';
const instance = axios.create({baseURL: 'https://cors-everywhere.herokuapp.com/http://sitterpocbackend-env.eba-zb3abxvr.us-east-2.elasticbeanstalk.com'});
export default instance