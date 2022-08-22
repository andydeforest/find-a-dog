<template>
    <div>
        <div class="row">
            <div class="col text-center">
                <h2>Find a Dog</h2>
            </div>
        </div>
        <div v-if="!loadingList">
            <div class="row py-2">
                <div class="col">
                <vue-bootstrap-typeahead 
                    v-model="value"
                    size="lg"
                    class="search-input"
                    :data="dogs"
                    :serializer="dog => dog.displayName"
                    @hit="data => selection = data"
                    @input.capture="resetSearch"
                />
                </div>
            </div>
            <div class="row my-3">
                <div class="col text-center">
                    <button class="btn mx-auto search-submit" @click="searchSubmit">
                        <b-spinner v-if="loadingResults" />
                        <span v-else>GO</span>
                    </button>
                </div>
            </div>
            <div v-if="errorMessage !== null" class="row">
                <div class="col">
                    {{ errorMessage }}
                </div>
            </div>
            <div class="row" v-if="showingResults">
                <div class="col">
                    <dog-results :breed-name="selection.displayName" :results="results" />
                </div>
            </div>
        </div>
        <div v-else>
            <div class="row mt-5">
                <div class="col text-white text-center">
                    <b-spinner />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    ::v-deep .search-input input {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        padding: 12px;
    }
    ::v-deep .vbst-item.list-group-item.active {
        color: var(--primary-text-color);
        background: var(--primary-background);
    }
    .search-submit, .search-submit:focus {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        line-height: 45px;
        font-size: 40px;
        font-weight: 900;
        padding: 10px 30px;
        color: var(--primary-text-color);
        background: var(--primary-background);
        border-radius: 30px;
    }
</style>

<script>

import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import { BSpinner } from 'bootstrap-vue'
import API from '@/utils/API'
import DogResults from '@/components/DogResults.vue'

export default {
    name: 'dog-search',
    components: {
        VueBootstrapTypeahead,
        BSpinner,
        DogResults
    },
    data() {
        return {
            loadingList: true,
            loadingResults: false,
            dogs: [],
            results: [],
            value: '',
            errorMessage: null,
            selction: null,
            showingResults: false
        }
    },
    mounted() {
        API.Dog.list().then(response => {
            let arr = [];
            if(response.data.status === 'success') {
                for(const[masterBreed, subBreed] of Object.entries(response.data.message)) {
                    // several sub breeds exist for this dog, create objects
                    if(subBreed.length) {
                        subBreed.forEach(sb => {
                            arr.push({
                                masterBreed: masterBreed,
                                subBreed: sb,
                                displayName: this.formatDogBreedName(masterBreed, sb)
                            })
                        });
                    } else {
                        arr.push({
                            masterBreed: masterBreed,
                            subBreed: null,
                            displayName: this.formatDogBreedName(masterBreed)
                        })
                    }
                }
                this.dogs = arr;
            } else {
                this.errorMessage = 'Error making request!'
                console.error(response.data.message);
            }
        }).finally(() => {
            this.loadingList = false;
        });
    },
    methods: {
        searchSubmit() {
            if(this.selection === null || !this.value.length) {
                this.errorMessage = 'Error! Invalid input given!';
                return;
            }
            this.loadingResults = true;
            this.showingResults = false;
            API.Dog.fetchImages(this.selection.masterBreed, this.selection.subBreed).then(response => {
                if(response.data.status === 'success') {
                    this.results = response.data.message;
                    this.showingResults = true;
                    if(response.data.message.length === 0) {
                        this.errorMessage = 'No images found!'
                    }
                } else {
                    // handle API error here
                    this.errorMessage = 'Error making request!'
                    console.error(response.data.message);
                }
            }).finally(() => {
                this.loadingResults = false;
            })
        },
        formatDogBreedName(masterBreed, subBreed = null) {
            return `${subBreed !== null ? `${subBreed.charAt(0).toUpperCase() + subBreed.slice(1)} ` : ''}${masterBreed.charAt(0).toUpperCase() + masterBreed.slice(1)}`;
        },
        resetSearch() {
            this.errorMessage = null;
            this.selection = null;
            this.showingResults = false;
        }
    }
}
</script>