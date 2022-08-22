import axios from 'axios'

const Dog = {
    list: () => {
        return axios.get('https://dog.ceo/api/breeds/list/all');
    },
    fetchImages: (masterBreed, subBreed = null) => {
        return axios.get(`https://dog.ceo/api/breed/${masterBreed}${subBreed !== null ? `/${subBreed}` : ''}/images`);
    }
}

export default {
    Dog
}