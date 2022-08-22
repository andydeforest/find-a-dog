<template>
    <div style="display: flex; justify-content: center;">
        <ul class="mt-2 mb-3 carousel-nav-list">
            <li v-for="x in totalSlides" :key="x">
                <div class="carousel-nav-item" :class="[activeSlide + 1 === x ? 'active' : '']" @click="$emit('update-slide', x - 1)"></div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .carousel-nav-list {
        list-style: none;
        overflow-x: scroll !important;
        max-width: 100%;
        list-style-type: none;
        padding-left: 0 !important;
        margin: auto;
        overflow-x: scroll;
        white-space: nowrap;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .carousel-nav-list::-webkit-scrollbar {
        display: none;
    }

    .carousel-nav-list > li {
        display: inline-block;
    }

    .carousel-nav-list > li > div.carousel-nav-item {
        cursor: pointer;
        height: 10px;
        width: 10px;
        background-color: #fff;
        border-radius: 50%;
        margin: 0 6px;
    }

    .carousel-nav-list > li > div.carousel-nav-item.active {
        background-color: var(--primary-text-color);
    }

</style>

<script>
export default {
    name: 'carousel-navigation',
    emits: ['update-slide'],
    props: {
        activeSlide: {
            type: Number,
            default: 0
        },
        totalSlides: {
            type: Number,
            default: 0
        }
    },
    watch: {
        activeSlide() {
            this.$nextTick(() => {
                this.scrollToActive();
            });
        }
    },
    methods: {
        scrollToActive(smooth = true) {
            const active = document.querySelector('.carousel-nav-item.active');
            active.scrollIntoView({behavior: smooth ? 'smooth' : 'auto', inline: 'center'});
        }
    }
}
</script>