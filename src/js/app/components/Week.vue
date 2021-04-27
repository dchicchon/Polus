<template>
  <div id="week">
    <div class="nav">
      <button class="arrow">←</button>
      <div
        class="title"
        style="width: 22rem; background: rgba(5, 80, 123, 0.992); border-radius: 75px;"
      >
        4/25/2021 - 5/1/2021
      </div>
      <button class="arrow">→</button>
    </div>
    <div class="weekdayNames">
      <h2 style="padding: 0px 0px 0.5rem; text-align: center;">Sunday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center;">Monday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center;">Tuesday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center;">Wednesday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center;">Thursday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center;">Friday</h2>
      <h2 style="padding: 0px 0px 0.5rem; text-align: center;">Saturday</h2>
    </div>
    <div class="weekdays">
      <div class="weekday">
        <div class="weekDate">25</div>
        <div class="weekDetails" id="4/25/2021">
          <ul></ul>
          <button class="add" value="4/25/2021">+</button>
        </div>
      </div>
      <div class="weekday">
        <div class="weekDate">26</div>
        <div class="weekDetails" id="4/26/2021">
          <ul></ul>
          <button class="add" value="4/26/2021" style="opacity: 0;">+</button>
        </div>
      </div>
      <div class="weekday">
        <div class="weekDate">27</div>
        <div class="weekDetails" id="4/27/2021">
          <ul></ul>
          <button class="add" value="4/27/2021" style="opacity: 0;">+</button>
        </div>
      </div>
      <div class="weekday">
        <div class="weekDate">28</div>
        <div class="weekDetails" id="4/28/2021">
          <ul></ul>
          <button class="add" value="4/28/2021">+</button>
        </div>
      </div>
      <div class="weekday">
        <div class="weekDate">29</div>
        <div class="weekDetails" id="4/29/2021">
          <ul></ul>
          <button class="add" value="4/29/2021" style="opacity: 0;">+</button>
        </div>
      </div>
      <div class="weekday">
        <div class="weekDate">30</div>
        <div class="weekDetails" id="4/30/2021">
          <ul></ul>
          <button class="add" value="4/30/2021">+</button>
        </div>
      </div>
      <div class="weekday">
        <div class="weekDate">1</div>
        <div class="weekDetails" id="5/1/2021">
          <ul></ul>
          <button class="add" value="5/1/2021">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass"></style>
<script>
export default {};
</script>
