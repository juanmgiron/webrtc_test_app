import axios from 'axios';
const instance = axios.create({baseURL: 'https://sitterbackend.teladoc-memex.com'});
export default instance