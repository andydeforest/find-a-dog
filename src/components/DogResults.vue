<template>
    <div>
        <div class="row">
            <div class="col text-center">
                <h2>Results</h2>
            </div>
        </div>
        <ul v-if="results.length">
            <li v-for="(res, x) in results" :key="x" class="dog-result my-3" @click="() => displayInfo(x)">{{ breedName }} #{{ x + 1 }}</li>
        </ul>
        <span v-else>No Results Found</span>
        <b-modal ref="bv-modal" id="bv-modal-breed-info" hide-backdrop hide-footer>
            <div class="row">
                <div class="col">
                    <h4 class="primary-text">Results</h4>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col text-center">
                    <h3 class="primary-text thin">{{ breedName }}</h3>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <b-carousel
                        ref="carousel"
                        :interval="0"
                        no-animation
                        v-model="activeSlide"
                    >
                        <b-carousel-slide v-for="(image, x) in this.truncatedResults" :key="x">
                            <template #img>
                                <img
                                    class="d-block img-fluid w-100"
                                    :src="image"
                                    :alt="`${breedName} image #${x + 1}`"
                                />
                            </template>
                        </b-carousel-slide>
                    </b-carousel>
                    <carousel-navigation :active-slide="activeSlide" :total-slides="truncatedResults.length" @update-slide="displayInfo" />
                </div>
            </div>
        </b-modal>
    </div>
</template>

<style scoped>
    li.dog-result {
        cursor: pointer;
        color: #fff;
        text-decoration: underline;
        font-size: 20px;
    }

    ::v-deep .modal-header > button {
        border: none !important;
        background-color: var(--primary-background) !important;
        color: var(--primary-text-color) !important;
        font-size: 30px !important;
        padding: 0 !important;
        margin: 0 !important;
        font-weight: 900 !important;
    }

    ::v-deep .modal-header {
        border-bottom: none !important;
        padding-bottom: 0px !important;
        padding-top: 0px !important;
    }

    ::v-deep .modal-content {
        background-color: var(--primary-background) !important;
        border-radius: 0px !important;
    }

    ::v-deep .modal-body {
        color: var(--primary-background) !important;
    }

    ::v-deep .modal {
        padding: 0.5rem 1.2rem;
    }

    ::v-deep .modal-dialog {
        display: flex;
        min-height: calc(100% - var(--bs-modal-margin) * 2);
    }

    @media(max-width: 767px) {
        ::v-deep .modal-dialog {
            align-items: end;
        }
    }
    @media(min-width: 767px) {
        ::v-deep .modal-dialog {
            align-items: center;
        }
    }
</style>

<script>

import { BModal, BCarousel, BCarouselSlide } from 'bootstrap-vue'
import CarouselNavigation from '@/components/CarouselNavigation.vue'

export default {
    name: 'dog-results',
    components: {
        BModal,
        BCarousel,
        BCarouselSlide,
        CarouselNavigation
    },
    props: {
        results: {
            type: Array,
            default: []
        },
        breedName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            activeSlide: 0
        }
    },
    methods: {
        displayInfo(slide = 0) {
            this.activeSlide = slide;
            this.$refs['bv-modal'].show();
            // the carousel is created when the modal is displayed, so we will wait until next tick to access its ref
            this.$nextTick(() => {
                this.$refs.carousel.setSlide(slide)
                
            })
        }
    },
    computed: {
        truncatedResults() {
            // since we only want 3 images, truncate the array if more than 3 exist
            if(this.results.length < 3) {
                return this.results;
            }
            return this.results.slice(0, 3);

        }
    }
}
</script>