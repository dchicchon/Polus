<template>
  <div>
    {{ description }}
    <label @click="toggleItem($event, name)" for="switch" class="switch">
      <input type="checkbox" class="toggle" v-model="currentValue" />
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    toggleItem: {
      type: Function,
      required: true,
    },
    currentValue: {
      type: Boolean,
      required: false,
    },
  },

  watch: {
    currentValue(val) {},
  },
};
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 15px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 15px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 10px;
  width: 10px;
  left: 4px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  transform: translateX(12px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 10px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>