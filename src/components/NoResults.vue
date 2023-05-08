<script setup >
import { PhThinSmileySad,FlFilledLibrary,BxSolidHide } from "@kalimahapps/vue-icons";
import { defineProps } from 'vue'

defineProps({
    search: {
        type: String,
    },
    type: {
        type: String,
    },

})

</script>

<template>
    <div class="no-results" v-if="type === 'library'" >
        <FlFilledLibrary  class="icon" />
        <h3> The mangas you save will store here </h3>
    </div>
    <div class="no-results" v-else-if="type === 'hidden'" >
        <BxSolidHide  class="icon" />
        <h3> The mangas you hide will be display here </h3>
    </div>
    <div class="no-results" v-else>
        <PhThinSmileySad class="icon" />
        <h3>No search results for <strong>{{ search }}</strong> searching by <strong>{{ type }}</strong>  </h3>
    </div>
</template>

<style lang="scss" scoped>
.no-results {
    min-height: 50vh;
    display:flex;
    align-items:center;
    justify-content: center;
    width:100%;
    flex-direction: column;

    h3{
        font-weight: 300;

        span{
            font-weight: 500;
        }
    }

    .icon {
        font-size: 2.5rem;
        font-weight: 500;
    }
    
}

</style>