<template>
  <div id="month">
    <div class="nav">
      <button class="arrow">←</button>
      <div
        class="title"
        style="background: rgba(5, 80, 123, 0.992); border-radius: 75px;"
      >
        April 2021
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
    <div class="monthDays">
      <div class="monthDay">
        <h3 class="monthDayTitle">28</h3>
        <div class="monthDetails" id="3/28/2021">
          <ul></ul>
          <button class="add" value="3/28/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">29</h3>
        <div class="monthDetails" id="3/29/2021">
          <ul></ul>
          <button class="add" value="3/29/2021" style="opacity: 0;">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">30</h3>
        <div class="monthDetails" id="3/30/2021">
          <ul></ul>
          <button class="add" value="3/30/2021" style="opacity: 0;">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">31</h3>
        <div class="monthDetails" id="3/31/2021">
          <ul></ul>
          <button class="add" value="3/31/2021" style="opacity: 0;">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">1</h3>
        <div class="monthDetails" id="4/1/2021">
          <ul></ul>
          <button class="add" value="4/1/2021" style="opacity: 0;">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">2</h3>
        <div class="monthDetails" id="4/2/2021">
          <ul></ul>
          <button class="add" value="4/2/2021" style="opacity: 0;">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">3</h3>
        <div class="monthDetails" id="4/3/2021">
          <ul></ul>
          <button class="add" value="4/3/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">4</h3>
        <div class="monthDetails" id="4/4/2021">
          <ul></ul>
          <button class="add" value="4/4/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">5</h3>
        <div class="monthDetails" id="4/5/2021">
          <ul></ul>
          <button class="add" value="4/5/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">6</h3>
        <div class="monthDetails" id="4/6/2021">
          <ul></ul>
          <button class="add" value="4/6/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">7</h3>
        <div class="monthDetails" id="4/7/2021">
          <ul></ul>
          <button class="add" value="4/7/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">8</h3>
        <div class="monthDetails" id="4/8/2021">
          <ul></ul>
          <button class="add" value="4/8/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">9</h3>
        <div class="monthDetails" id="4/9/2021">
          <ul></ul>
          <button class="add" value="4/9/2021" style="opacity: 0;">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">10</h3>
        <div class="monthDetails" id="4/10/2021">
          <ul></ul>
          <button class="add" value="4/10/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">11</h3>
        <div class="monthDetails" id="4/11/2021">
          <ul></ul>
          <button class="add" value="4/11/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">12</h3>
        <div class="monthDetails" id="4/12/2021">
          <ul></ul>
          <button class="add" value="4/12/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">13</h3>
        <div class="monthDetails" id="4/13/2021">
          <ul></ul>
          <button class="add" value="4/13/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">14</h3>
        <div class="monthDetails" id="4/14/2021">
          <ul></ul>
          <button class="add" value="4/14/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">15</h3>
        <div class="monthDetails" id="4/15/2021">
          <ul></ul>
          <button class="add" value="4/15/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">16</h3>
        <div class="monthDetails" id="4/16/2021">
          <ul></ul>
          <button class="add" value="4/16/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">17</h3>
        <div class="monthDetails" id="4/17/2021">
          <ul></ul>
          <button class="add" value="4/17/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">18</h3>
        <div class="monthDetails" id="4/18/2021">
          <ul></ul>
          <button class="add" value="4/18/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">19</h3>
        <div class="monthDetails" id="4/19/2021">
          <ul></ul>
          <button class="add" value="4/19/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">20</h3>
        <div class="monthDetails" id="4/20/2021">
          <ul></ul>
          <button class="add" value="4/20/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">21</h3>
        <div class="monthDetails" id="4/21/2021">
          <ul></ul>
          <button class="add" value="4/21/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">22</h3>
        <div class="monthDetails" id="4/22/2021">
          <ul></ul>
          <button class="add" value="4/22/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">23</h3>
        <div class="monthDetails" id="4/23/2021">
          <ul></ul>
          <button class="add" value="4/23/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">24</h3>
        <div class="monthDetails" id="4/24/2021">
          <ul></ul>
          <button class="add" value="4/24/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">25</h3>
        <div class="monthDetails" id="4/25/2021">
          <ul></ul>
          <button class="add" value="4/25/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">26</h3>
        <div class="monthDetails" id="4/26/2021">
          <ul></ul>
          <button class="add" value="4/26/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">27</h3>
        <div class="monthDetails" id="4/27/2021">
          <ul></ul>
          <button class="add" value="4/27/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">28</h3>
        <div class="monthDetails" id="4/28/2021">
          <ul></ul>
          <button class="add" value="4/28/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">29</h3>
        <div class="monthDetails" id="4/29/2021">
          <ul></ul>
          <button class="add" value="4/29/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">30</h3>
        <div class="monthDetails" id="4/30/2021">
          <ul></ul>
          <button class="add" value="4/30/2021">+</button>
        </div>
      </div>
      <div class="monthDay">
        <h3 class="monthDayTitle">1</h3>
        <div class="monthDetails" id="5/1/2021">
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
