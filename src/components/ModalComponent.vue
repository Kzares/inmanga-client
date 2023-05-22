<script setup>
import { defineProps, defineEmits } from 'vue'

//defining props
defineProps({
  modalMessage: {
    type: String,
    required: true
  },
  secondButton: {
    type: Object,
    required: false
  }
})

//defining emits
const emit = defineEmits(['close-modal', 'accept-modal'])

//methods to send emits

const closeModal = () => {
  emit('close-modal')
}
const acceptModal = () => {
  emit('accept-modal')
}

</script>
<template>
  <div class="modal">
    <div class="modal-content">
      <p>{{ modalMessage }}</p>
      <div v-if="secondButton.show" class="buttons">
        <button @click="closeModal">Close</button>
        <button @click="acceptModal"> {{ secondButton.message }} </button>
      </div>
      <button v-else @click="closeModal">Close</button>

    </div>
  </div>
</template>
  
<style lang="scss" scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);

  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 8px;
    width: 300px;
    padding: 40px 30px;
    background-color: #fff;

    p {
      text-align: center;
    }
    button {
      align-self: center;
      transition: 500ms ease all;
      cursor: pointer;
      margin-top: 24px;
      padding: 12px 24px;
      background-color: #303030;
      color: #fff;
      border-radius: 20px;
      border: none;
      text-transform: uppercase;

      &:focus {
        outline: none;
      }

      &:hover {
        background-color: rgba(48, 48, 48, 0.7);
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;

      button {
        align-self: center;
        transition: 500ms ease all;
        cursor: pointer;
        margin-top: 24px;
        padding: 12px 24px;
        background-color: #303030;
        color: #fff;
        border-radius: 20px;
        border: none;
        text-transform: uppercase;
  
        &:focus {
          outline: none;
        }
  
        &:hover {
          background-color: rgba(48, 48, 48, 0.7);
        }
      }
    }
  }
}
</style>
  